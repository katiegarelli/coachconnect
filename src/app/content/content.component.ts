import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  services;
  inLoading: boolean = true;
  promoVideo:string = "388881713";

  constructor(private config: ConfigService) {}

  ngOnInit() {
    this.services = this.getServices();
  }
  
  getServices() {
    return this.config.getConfig().services;
  }

}
