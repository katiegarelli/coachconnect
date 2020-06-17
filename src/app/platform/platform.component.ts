import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';


@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent {

  activeModule : string = "video";

  constructor(public analytics: AngularFireAnalytics, public auth: AuthService) { }

  setActiveModule(chosenModule: string) {
    this.activeModule = chosenModule;
    this.analytics.logEvent('change_profile_module', {'chosenModule': chosenModule})
  }

}
