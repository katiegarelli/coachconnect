import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { NgwWowService } from 'ngx-wow';
import { IsLoadingService } from '@service-work/is-loading';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy  {
  title = 'CoachConnectSite';
  subscription: any;
  loadingServiceSubscription: any;
  isLoading: Observable<boolean>;

  constructor(private router: Router,
        private isLoadingService: IsLoadingService,
        private wowService: NgwWowService){
    this.subscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
        // Reload WoW animations when done navigating to page,
        // but you are free to call it whenever/wherever you like
        this.wowService.init(); 
    });

    this.isLoading = this.isLoadingService.isLoading$();

    this.loadingServiceSubscription = this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError,
        ),
      )
      .subscribe(event => {
        // If it's the start of navigation, `add()` a loading indicator
        if (event instanceof NavigationStart) {
          this.isLoadingService.add();
          return;
        }

        // Else navigation has ended, so `remove()` a loading indicator
        this.isLoadingService.remove();
      });

  }
 
  ngOnInit() {
    
  }
 
  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }

    if(this.loadingServiceSubscription) {
      this.loadingServiceSubscription.unsubscribe();
    }
  }
}