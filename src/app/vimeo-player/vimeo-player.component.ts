import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import Player from "@vimeo/player";
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-vimeo-player',
  templateUrl: './vimeo-player.component.html',
  styleUrls: ['./vimeo-player.component.scss']
})
export class VimeoPlayerComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() videoId: string;
  @Input() data: number;
  @Input() height: string = "300px";
  @Output() timeChange = new EventEmitter<number>();
  url: any;
  player: Player;
  isLoading: boolean = true;

  constructor(public analytics: AngularFireAnalytics, private dom:DomSanitizer){}

  ngOnChanges(changes: any) {
    if(changes.data && this.player) {
      this.player.setCurrentTime(changes.data.currentValue);
    }
  }

  ngOnInit() {
    /* wait DOM be available */
    if(this.videoId) {
      this.url = this.dom.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/' + this.videoId.split('/')[0]); 
      this.analytics.logEvent('launch_vimeo_player', {'id': this.videoId});

    }
    
  }

  ngAfterViewInit() {
    const iframe = document.querySelector('iframe');
    this.player = new Player(iframe);

    this.player.setLoop(true).then(function(loop) {
        // loop was turned on
    }).catch(function(error) {
      this.analytics.logEvent('error_setting_loop_vimeo_player', {'id': this.videoId});
    });

    const self = this;
  
    this.player.on('timeupdate', function(timeData: any) {
        self.timeChange.emit(timeData.seconds);
    });
    
  }

  pause() {
    this.player.pause();
  }


}