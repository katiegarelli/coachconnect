import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileUploadService } from '../file-upload.service'
import { AngularFireAnalytics } from '@angular/fire/analytics';

declare var MediaRecorder: any;

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss']
})
export class AudioRecorderComponent {

  @Input() data: number;
  @Input() videoId: string;

  @Output()
  private startedRecording = new EventEmitter();

  isRecording : boolean;
  state : string = 'stopped'; 
  config : any = {
    manualEncoderId: 'wav',
    micGain: 1.0,
    processorBufferSize: 2048,
    stopTracksAndCloseCtxWhenFinished: true,
    usingMediaRecorder: false,//typeof window['MediaRecorder'] !== 'undefined',
    //userMediaConstraints: { audio: true }
    userMediaConstraints: { audio: { echoCancellation: false } }
  };

  audioCtx : AudioContext;
  micGainNode : any;
  outputGainNode : any;
  processorNode : any;
  destinationNode : any;
  micAudioStream : any;
  inputStreamNode : any;
  mediaRecorder : any;
  encoderWorker: any;
  chunks : any = [];
  chunkType : string = '';
  blob : any;

  constructor( 
    private uploader: FileUploadService,
    public analytics: AngularFireAnalytics) 
  { 
    window['AudioContext'] = window['AudioContext'] || window['webkitAudioContext']
  }

  _startRecording () {
    this._stopAllRecording();
    this.startRecording();
    this.startedRecording.emit();
    this.isRecording = true;
  }

  _stopAllRecording () {
    if (this.isRecording) {
      this.stopRecording();
      this.isRecording = false;
    }
  }

  onSave() {
    try {
      if(this.blob) {
        this.uploader.startAudioUpload(this.blob, {videoId: this.videoId, videoTime: (this.data ? this.data : 0)});
        if(this.mediaRecorder){
          this.mediaRecorder.recordedChunks = [];
        }
        this.analytics.logEvent('saved_audio_recording', {});
      }
    } catch(e) {
      console.log("Error saving audio");
    } finally {
      this.blob = '';
    }
  }

  onCancel() {
    this.blob = '';
    this.analytics.logEvent('cancel_audio_recording', {});
  }

  /* Returns promise */
  startRecording () {
    if (this.state !== 'stopped') {
      return
    }

    // This is the case on ios/chrome, when clicking links from within ios/slack (sometimes), etc.
    if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Missing support for navigator.mediaDevices.getUserMedia. Please Open from your phone browser directly.') // temp: helps when testing for strange issues on ios/safari
      return
    }

    this.audioCtx = new AudioContext()
    this.micGainNode = this.audioCtx.createGain()
    this.outputGainNode = this.audioCtx.createGain()

    // If not using MediaRecorder(i.e. safari and edge), then a script processor is required. It's optional
    // on browsers using MediaRecorder and is only useful if wanting to do custom analysis or manipulation of
    // recorded audio data.
    if (!this.config.usingMediaRecorder) {
      this.processorNode = this.audioCtx.createScriptProcessor(this.config.processorBufferSize, 1, 1) // TODO: Get the number of channels from mic
    }

    // Create stream destination on chrome/firefox because, AFAICT, we have no other way of feeding audio graph output
    // in to MediaRecorder. Safari/Edge don't have this method as of 2018-04.
    if (this.audioCtx.createMediaStreamDestination) {
      this.destinationNode = this.audioCtx.createMediaStreamDestination()
    }
    else {
      this.destinationNode = this.audioCtx.destination
    }

    // Create web worker for doing the encoding
    if (!this.config.usingMediaRecorder) {
      this.encoderWorker = new Worker('assets/encoder-wav-worker.js')

      this.encoderWorker.addEventListener('message', (e) => {
        let event = new Event('dataavailable')
        event['data'] = new Blob(e.data, { type: 'audio/wav' })
        this._onDataAvailable(event)
      })
    }

    // This will prompt user for permission if needed
    return navigator.mediaDevices.getUserMedia(this.config.userMediaConstraints)
      .then((stream) => {
        this._startRecordingWithStream(stream)
      })
      .catch((error) => {
        alert('Error recording audio. Please make sure to allow this site to record audio in your browser settings. ' + error.message) // temp: helps when testing for strange issues on ios/safari
        console.log(error)
      })
  }

  _startRecordingWithStream (stream) {
    this.micAudioStream = stream

    this.inputStreamNode = this.audioCtx.createMediaStreamSource(this.micAudioStream)
    this.audioCtx = this.inputStreamNode.context

    this.inputStreamNode.connect(this.micGainNode)
    this.micGainNode.gain.setValueAtTime(this.config.micGain, this.audioCtx.currentTime)

    let nextNode = this.micGainNode

    this.state = 'recording'

    if (this.processorNode) {
      nextNode.connect(this.processorNode)
      this.processorNode.connect(this.outputGainNode)
      this.processorNode.onaudioprocess = (e) => this._onAudioProcess(e)
    }
    else {
      nextNode.connect(this.outputGainNode)
    }

    this.outputGainNode.connect(this.destinationNode)

    if (this.config.usingMediaRecorder) {
      this.mediaRecorder = new MediaRecorder(this.destinationNode.stream)
      this.mediaRecorder.addEventListener('dataavailable', (evt) => this._onDataAvailable(evt))
      this.mediaRecorder.addEventListener('error', (evt) => this._onError(evt))

      this.mediaRecorder.start()
    }
    else {
      // Output gain to zero to prevent feedback. Seems to matter only on Edge, though seems like should matter
      // on iOS too.  Matters on chrome when connecting graph to directly to audioCtx.destination, but we are
      // not able to do that when using MediaRecorder.
      this.outputGainNode.gain.setValueAtTime(0, this.audioCtx.currentTime)
    }
  }

  _onAudioProcess (e) {
    // Safari and Edge require manual encoding via web worker. Single channel only for now.
    // Example stereo encoderWav: https://github.com/MicrosoftEdge/Demos/blob/master/microphone/scripts/recorderworker.js
    if (!this.config.usingMediaRecorder) {
      if (this.state === 'recording') {
        if (this.config.broadcastAudioProcessEvents) {
          this.encoderWorker.postMessage(['encode', e.outputBuffer.getChannelData(0)])
        }
        else {
          this.encoderWorker.postMessage(['encode', e.inputBuffer.getChannelData(0)])
        }
      }
    }
  }

  stopRecording () {
    if (this.state === 'stopped') {
      return
    }

    if (this.config.usingMediaRecorder) {
      this.state = 'stopped'
      this.mediaRecorder.stop()
    }
    else {
      this.state = 'stopped'
      this.encoderWorker.postMessage(['dump', this.audioCtx.sampleRate])
    }

  }

  _onDataAvailable (evt) {
    this.chunks.push(evt.data)
    this.chunkType = evt.data.type

    if (this.state !== 'stopped') {
      return
    }

    //TODO: forced this to be wav... can I do that?
    this.blob = new Blob(this.chunks, { 'type': this.chunkType })

    // this.blob = new Blob(this.chunks, { 'type': 'audio/wav' })
    let blobUrl = URL.createObjectURL(this.blob)
    const recording = {
      ts: new Date().getTime(),
      blobUrl: blobUrl,
      mimeType: this.blob.type,
      size: this.blob.size
    }

    this.chunks = []
    this.chunkType = null

    if (this.destinationNode) {
      this.destinationNode.disconnect()
      this.destinationNode = null
    }
    if (this.outputGainNode) {
      this.outputGainNode.disconnect()
      this.outputGainNode = null
    }

    if (this.processorNode) {
      this.processorNode.disconnect()
      this.processorNode = null
    }

    if (this.encoderWorker) {
      this.encoderWorker.postMessage(['close'])
      this.encoderWorker = null
    }

    if (this.micGainNode) {
      this.micGainNode.disconnect()
      this.micGainNode = null
    }
    if (this.inputStreamNode) {
      this.inputStreamNode.disconnect()
      this.inputStreamNode = null
    }

    if (this.config.stopTracksAndCloseCtxWhenFinished) {
      // This removes the red bar in iOS/Safari
      this.micAudioStream.getTracks().forEach((track) => track.stop())
      this.micAudioStream = null

      this.audioCtx.close()
      this.audioCtx = null
    }

    const recordingEl = document.getElementById("audio-recording");
    recordingEl['src'] = recording.blobUrl;
    recordingEl['type'] = recording.mimeType

  }

  _onError (evt) {
    console.log('error', evt)
    alert('error:' + evt) // for debugging purposes
  }


}
