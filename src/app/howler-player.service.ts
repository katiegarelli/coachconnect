import { Howl } from 'howler';
import { Subject } from 'rxjs'

export interface SoundInterface {
  sourceUrl: string;
  howl: Howl;
}

export class HowlerPlayer {

  private _sound: SoundInterface;
  private $progress: Subject<number>
  private paused : boolean = false;
  

  /** */
  constructor(songUrl: string) {
    this._sound = {
      sourceUrl: songUrl,
      howl: null
    };

    this.$progress = new Subject();
    this.$progress.next( 0 );
  }

  /** */
  public play() {
    this.paused = false;

    if ( !this._sound.howl ) {
      this._sound.howl = new Howl({
        src: [this._sound.sourceUrl],
        html5: true,
        autoplay: false,
        volume: 0,
        preload: false,
        onplay: () => {
          this.seekStep();
        },
        onseek: () => {
          this.seekStep();
        },
        onend: () => {
          this.$progress.next(100);
        }
      })
    }

    this._sound.howl.fade(0, 1, 500);
    this._sound.howl.play();
  }


  /** */
  public pause(): void {
    if ( this._sound.howl ) {
      this.paused = true;
      this._sound.howl.fade(1, 0, 500);
      this._sound.howl.once('fade', () => {
        this._sound.howl.pause();
        this._sound.howl.volume(1);
      });
    }
  }


  /** */
  private seekStep = () => {

    if ( this._sound.howl.playing() && !this.paused) {
      var sSeek = this._sound.howl.seek();
      var sDuration = this._sound.howl.duration();
      this.$progress.next( (sSeek *100 )/ sDuration );

      var self = this;
      setTimeout(() => {
        self.seekStep();
      }, 1);
    }

  }


  /** */
  public onPlay(): Subject<number> {
    return this.$progress;
  }

}