import {Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Video } from '../core/video';
import {AngularFirestore} from '@angular/fire/firestore';
import { AuthService } from '../core/auth.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry, concatMap } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFireFunctions } from '@angular/fire/functions';


@Component({
  selector: 'app-video-table',
  templateUrl: './video-table.component.html',
  styleUrls: ['./video-table.component.scss']
})
export class VideoTableComponent implements OnDestroy{
  displayedColumns: String[] = [
  'dateUploaded',
  'screenshot',
  'score',
  'outcome',
  'pin',
  'opponent',
  'weight',
  'matchDate',
  'home',
  'comments',
  'reviewer',
  'dateReviewed'
  ];

  @Input() selectedRowContentLocation: string = "";

  dataSource: any;
  selectedRow: any = {};
  selectedVideo$: Observable<any>;

  @Output()
  public onRowChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() tableStatus : string;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  userSubscription: any;
  coachSubscription: any;
  athleteSubscription: any;
  transcodingSubscription: any;
  isNotLoading: any = {};
  isTranscoded: any = {};


  constructor(private functions: AngularFireFunctions, public analytics: AngularFireAnalytics, private _snackBar: MatSnackBar, private http: HttpClient, private auth: AuthService, private afs: AngularFirestore) {}

  ngAfterViewInit() {
    this.userSubscription = this.auth.userDoc$.subscribe(user => {
      if(user) {
        if(user.role === 'coach') {
          this.coachSubscription = this.afs.collection<Video>('videos', ref => 
            ref.where('reviewerId', '==', user.uid).where('reviewStatus', '==', this.tableStatus).orderBy('dateUploaded','desc')
          ).valueChanges().subscribe(
            data => {
              data.forEach(element => {
                this.videoTranscoded(element.contentLocation);
              });

              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          )
        } else {
          this.athleteSubscription = this.afs.collection<Video>('videos', ref => 
            ref.where('uploaderId', '==', user.uid).where('reviewStatus', '==', this.tableStatus).orderBy('dateUploaded','desc')
          ).valueChanges().subscribe(
            data => {
              data.forEach(element => {
                this.videoTranscoded(element.contentLocation);
              });
              this.analytics.logEvent('load_videos_to_table', {});
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          )
        }
      }
    });  
  }

  async videoTranscoded(videoContentLocation: string) {
    const fun = this.functions.httpsCallable('checkVideoTranscodeStatus');
    await fun({ 'videoLocation':videoContentLocation.split('/')[0] }).toPromise().then((response: any)=> {
        if (JSON.parse(response)['transcode']['status'] == 'complete') {
          this.isTranscoded[videoContentLocation] = true;
          this.analytics.logEvent('check_video_transcode_status', {'videoContentLocation': videoContentLocation, 'transcoded': 'true'});
          return true;
        } else {
          const self = this;
          setTimeout(() => {
            self.videoTranscoded(videoContentLocation);
          }, 5000);
          this.analytics.logEvent('check_video_transcode_status', {'videoContentLocation': videoContentLocation, 'transcoded': 'false'});
        }
      },
      error => {
        console.log('Error checking the status of the video upload with id: ' + videoContentLocation + '. Failed because: ', error);
      });
  }

  displayVideo(row: any) {
    if(this.isTranscoded[row.contentLocation]) {
      this.selectedRow = row;
      this.selectedRowContentLocation = row.contentLocation;
      this.selectedVideo$ = this.afs.doc<Video>(`videos/${row.id}`).valueChanges();
      this.onRowChange.emit({'row': this.selectedRow, 'observable': this.selectedVideo$, 'index': this.selectedRowContentLocation});
      console.log("Displaying video");
      this.analytics.logEvent('video_row_selected', {'id': row.id, 'displayed': true});
    } else {
      this._snackBar.open('Please wait for the video to finish transcoding before viewing it.', 'Close', {
        duration: 5000,
      });
      this.analytics.logEvent('video_row_selected', {'id': row.id, 'displayed': false});
    }
  }

  ngOnDestroy() {
    if(this.coachSubscription) {
      this.coachSubscription.unsubscribe();
    }
    if(this.athleteSubscription) {
      this.athleteSubscription.unsubscribe();
    }
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if(this.transcodingSubscription) {
      this.transcodingSubscription.unsubscribe();
    }
  }

}