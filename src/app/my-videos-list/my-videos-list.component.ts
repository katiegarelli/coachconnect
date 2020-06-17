import {Component, AfterViewInit} from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Observable } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { CoachFinalCommentsComponent } from '../coach-final-comments/coach-final-comments.component';
import { AngularFireAnalytics } from '@angular/fire/analytics';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-my-videos-list',
  templateUrl: './my-videos-list.component.html',
  styleUrls: ['./my-videos-list.component.scss']
})
export class MyVideosListComponent {

  public dataViewer: number;

  updateDataViewer(event) {
    this.dataViewer = event;
  }

  public dataNotes: number;

  updateDataNotes(event) {
    this.dataNotes = event;
  }

  selectedRow: any = {};
  selectedVideo$: Observable<any>;
  selectedRowContentLocation: string;

  constructor(public analytics: AngularFireAnalytics, public dialog: MatDialog, public auth: AuthService) {}

  updateStatus(id: string, status: string, creditsCharged: number) {
    this.analytics.logEvent('update_video_status', {'status': status})

    if(status === 'F') {
      const dialogRef = this.dialog.open(CoachFinalCommentsComponent, {
        width: '500px',
        maxHeight : '80vh',
        data: {
          id: id,
          status: status,
          creditsCharged : creditsCharged
        }
      });
    } else {
      this.auth.updateVideoStatus(id, status, creditsCharged);
    }

  }

  updateRow(event) {
    this.selectedRow = event['row'];
    this.selectedVideo$ = event['observable'];
    this.selectedRowContentLocation = event['index'];

    this.analytics.logEvent('video_selected_from_table', event)
  }

}
