import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {

  @Input() email: string;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
