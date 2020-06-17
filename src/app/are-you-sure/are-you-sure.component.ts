import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-are-you-sure',
  templateUrl: './are-you-sure.component.html',
  styleUrls: ['./are-you-sure.component.sass']
})
export class AreYouSureComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  submit(){
    this.data.submit();

    if(this.data.snackMessageOnsubmit) {
      this._snackBar.open(this.data.snackMessageOnsubmit, 'Close', {
        duration: 5000,
      });
    }
    
  }

}
