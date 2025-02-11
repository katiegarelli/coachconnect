import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.sass']
})
export class TestimonialComponent implements OnInit {

  testimonials;
  isLoading: boolean = true;

  constructor(private config: ConfigService) { }

  ngOnInit() {
    this.testimonials = this.getTestimonial();
  }

  getTestimonial() {
    return this.config.getConfig().testimonials;
  }

}
