import {Component, Output, Input, ViewChild, EventEmitter, OnDestroy} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import { AuthService } from '../core/auth.service';
import { Audio } from '../core/audio';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FileUploadService } from '../file-upload.service';
import {MatDialog} from '@angular/material/dialog';
import { AreYouSureComponent } from '../are-you-sure/are-you-sure.component';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-video-notes',
  templateUrl: './video-notes.component.html',
  styleUrls: ['./video-notes.component.scss']
})
export class VideoNotesComponent implements OnDestroy {

  @Input() selectedRow: any;


  /*video time two way binding*/
  @Input()
  public data: number

  @Output()
  public onData: EventEmitter<number> = new EventEmitter<number>();

  updateData(data) {
    //send data back to parent
    //data could be coming from a service/async http request as well.
    this.onData.emit(data)
  }

  /*END video time two way binding*/


  dataSource: any;
  columnsToDisplay;
  role: String;
  status: String;

  userSubscription: any;
  subscription: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public analytics: AngularFireAnalytics, public dialog: MatDialog, private auth: AuthService, private afs: AngularFirestore, private uploader: FileUploadService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnChanges(changes: any) {
    if(changes.selectedRow && changes.selectedRow.currentValue.id) {
      this.userSubscription = this.auth.userDoc$.subscribe(user => {
          this.role = user != null ? user.role : null;
          this.status = changes.selectedRow.currentValue.reviewStatus;
          if(this.role && this.role === 'coach' && this.status !== 'F') {
            this.columnsToDisplay = ['videoTime','contentLocation','delete'];
          } else {
            this.columnsToDisplay = ['videoTime','contentLocation'];
          }

          if(this.role === 'coach' || (this.role === 'athlete' && changes.selectedRow.currentValue.reviewStatus === "F")) {
            
            this.subscription = this.afs.collection<Audio>('audio', ref => 
              ref.where('videoId', '==', changes.selectedRow.currentValue.id).orderBy('videoTime','asc')
            ).valueChanges().subscribe(
              data => {
                const videoTimes = Object.keys(data)
                .map((key)=> {
                  return data[key].videoTime;
                });
                this.analytics.logEvent('loading_table_of_video_notes', {});
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            )
          } 
      });  
    }
  }

  deleteNote(row: any) {

    const dialogRef = this.dialog.open(AreYouSureComponent, {
      width: '500px',
      maxHeight : '80vh',
      data: {
        submit: function(){
          this.uploader.audioDelete(row);
        }, 
        message: 'Are you sure you want to delete this recording?',
        snackMessageOnsubmit : 'Recording deleted.',
        submitButton: 'Delete',
        uploader: this.uploader}
    });
    this.analytics.logEvent('audio_note_deleted', {});


  }

  jumpToTime(time: number) {
    this.updateData(time);
    this.data = time;
    this.analytics.logEvent('jump_to_video_time', {'time': time});
  }

  hightlightRow(noteTime: number, videoTime: number){
    return Math.floor(noteTime) === Math.floor(videoTime);
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }

    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}


