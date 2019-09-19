import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.sass']
})
export class SocialComponent implements OnInit {

  socialservices = {};

  constructor(private config: ConfigService) {}

  ngOnInit() {
    this.socialservices = this.getSocialServices();
  }
  
  getSocialServices() {
    return this.config.getConfig().socialservices;
  }

}
