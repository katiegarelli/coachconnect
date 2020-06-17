import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlatformComponent } from './platform/platform.component';
import { MainPageComponent } from './main-page/main-page.component';
import {SignOutComponent } from './sign-out/sign-out.component'
import {LoggedInGuard} from 'ngx-auth-firebaseui';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { ClientsComponent } from './clients/clients.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import {VimeoPlayerComponent} from './vimeo-player/vimeo-player.component';

const routes: Routes = [
  { path: 'home', component: MainPageComponent},
  { path: 'coaches', component: ClientsComponent},
  { path: 'testimonials', component: TestimonialComponent},
  { path: 'howItWorks', component: HowItWorksComponent},
  { path: 'platform', component: PlatformComponent, canActivate: [LoggedInGuard] },
  { path: 'signOut', component: SignOutComponent},
  { path: 'login', component: LoginPageComponent},
  { path: 'register', component: RegistrationPageComponent},
  { path: 'videoPlayer', component: VimeoPlayerComponent},
  { path: '', component: MainPageComponent},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
