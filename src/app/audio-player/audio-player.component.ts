import { Component, OnInit, Input } from '@angular/core';
import { HowlerPlayer } from '../howler-player.service';
import { Observable, Observer, Subject } from 'rxjs'


@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent {

  @Input() audioLink: string;

  $progress: Subject<number>;
  musicPlaying: boolean;
  howlerMusicPlayer: HowlerPlayer;

  /** */
  constructor() {
    this.musicPlaying = false;
  }

  
  ngOnChanges(changes: any) {
    if(changes.audioLink && changes.audioLink.currentValue) {
      this.audioLink = changes.audioLink.currentValue;
      this.howlerMusicPlayer = new HowlerPlayer(this.audioLink);
    }
  }

  play() {
    this.howlerMusicPlayer.play();
    this.musicPlaying = true;

    this.$progress = this.howlerMusicPlayer.onPlay();

    var self = this;
    this.$progress.subscribe((progress)=>{
      if(progress == 100){
        self.musicPlaying = false;
      }
    });
  }

  pause() {
    this.howlerMusicPlayer.pause();
    this.musicPlaying = false;
  }

}
