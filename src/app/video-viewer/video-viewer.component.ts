import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-video-viewer',
  templateUrl: './video-viewer.component.html',
  styleUrls: ['./video-viewer.component.scss']
})
export class VideoViewerComponent {

  constructor(public analytics: AngularFireAnalytics, private auth: AuthService) { }

  @Input() selectedVideo$: Observable<any>;
  @ViewChild('vimeoPlayer', {static: false}) vimeoPlayer: any;
  previousValue: number = -1;

  /*video time two way binding*/
  @Input()
  public data: number;

  recorderData : number;

  @Output()
  public onData: EventEmitter<number> = new EventEmitter<number>();

  updateData(data) {
    //send data back to parent
    //data could be coming from a service/async http request as well.
    this.onData.emit(data);
    this.recorderData = data;
  }

  /*END video time two way binding*/

  progress: number;

  receiveRecordingEvent(event) {
    this.pauseVideo();
    this.analytics.logEvent('start_recording_audio', {});
  }

  pauseVideo(){
    this.vimeoPlayer.pause();
  }

}
