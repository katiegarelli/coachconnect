import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { HelperComponent } from '../helper/helper.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent {

  constructor(public analytics: AngularFireAnalytics, public dialog: MatDialog) { 
    this.analytics.logEvent('show_new_user_component', {})
  }

  clickedCard(cardType: string) {
    console.log("card type: " + cardType);
    var message = "";
    var imgSrc = "";
    if(cardType == 'create') {
      message = "You have already created an account. If you wish to update your profile info please select 'Your Profile' from the menu.";
      imgSrc = "assets/images/helper-create.PNG";
    } else if (cardType == 'credits') {
      message = "To purchase credits use the 'Purchase Credits' action in your profile or select the action from the quick actions on the left side menu if available.";
      imgSrc = "assets/images/helper-credits.PNG";
    } else if (cardType == 'submit') {
      message = "To submit a video, use the 'Upload Video for Review' action in your profile or select the action from the quick actions on the left side menu if available.";
      imgSrc = "assets/images/helper-submit.PNG";
    }

    this.dialog.open(HelperComponent, {
      width: '1000px',
      maxHeight : '80vh',
      data: {
        message: message,
        imgSrc: imgSrc,
        cancelButton: 'Close',
      }
    });

  }

}
