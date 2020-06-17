import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { AuthService } from '../core/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


header : {
  heading: String,
  headingtext: String,
  buttontext: String,
  buttonlink: String
};

constructor(private config: ConfigService, public auth: AuthService) {}

  ngOnInit() {
    this.header = this.getHeader();
  }

  getHeader() {
    return this.config.getConfig().header;
  }
}
