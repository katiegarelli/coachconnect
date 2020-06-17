import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './core/auth.service';
import { IntroComponent } from './intro/intro.component';
import { ContentComponent } from './content/content.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { ClientsComponent } from './clients/clients.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SocialComponent } from './social/social.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ConfigService } from './config.service';
import { CoachComponent } from './coach/coach.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VideoViewerComponent } from './video-viewer/video-viewer.component';
import { MainPageComponent } from './main-page/main-page.component';
import { MyVideosListComponent } from './my-videos-list/my-videos-list.component';
import { PlatformComponent } from './platform/platform.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { VideoNotesComponent } from './video-notes/video-notes.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { ProfileActionsComponent } from './profile-actions/profile-actions.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MainPipe } from './main.pipe';
import { ProfileInfoFormComponent } from './profile-info-form/profile-info-form.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { VideoUploadFormComponent } from './video-upload-form/video-upload-form.component';
import { ProfilePicRoundComponent } from './profile-pic-round/profile-pic-round.component';
import { CoreModule } from './core/core.module';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { AngularFireAnalyticsModule, UserTrackingService, ScreenTrackingService, CONFIG } from '@angular/fire/analytics';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SignOutComponent } from './sign-out/sign-out.component';
import { DropzoneDirective } from './dropzone.directive';
import { UploaderComponent } from './uploader/uploader.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatRadioModule } from '@angular/material/radio';
import { CostComponent } from './cost/cost.component';
import { AreYouSureComponent } from './are-you-sure/are-you-sure.component';
import { CanPurchaseDirective } from './can-purchase.directive';
import { LoginComponent } from './login/login.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ElementsComponent } from './elements/elements.component';
import { BuyCreditsComponent } from './buy-credits/buy-credits.component';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { AccountHeaderComponent } from './account-header/account-header.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NewUserComponent } from './new-user/new-user.component';
import { VideoTableComponent } from './video-table/video-table.component';
import { ImageCropperModule } from 'ngx-img-cropper';
import { UnavailableDirective } from './unavailable.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { BackgroundComponent } from './background/background.component';
import { UpdateEmailComponent } from './update-email/update-email.component';
import { FormsModule }   from '@angular/forms';
import { ErrorsHandler } from './error-handler';
import { VimeoPlayerComponent } from './vimeo-player/vimeo-player.component';
import { CoachFinalCommentsComponent } from './coach-final-comments/coach-final-comments.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HelperComponent } from './helper/helper.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { AudioRecorderComponent } from './audio-recorder/audio-recorder.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    ContentComponent,
    TestimonialComponent,
    ClientsComponent,
    FooterComponent,
    HeaderComponent,
    SocialComponent,
    NavigationComponent,
    CoachComponent,
    VideoViewerComponent,
    MainPageComponent,
    MyVideosListComponent,
    PlatformComponent,
    VideoNotesComponent,
    ProfileComponent,
    ProfileInfoComponent,
    ProfileActionsComponent,
    ProfileInfoFormComponent,
    VideoUploadFormComponent,
    ProfilePicRoundComponent,
    SignOutComponent,
    DropzoneDirective,
    UploaderComponent,
    CostComponent,
    AreYouSureComponent,
    CanPurchaseDirective,
    LoginComponent,
    LoginPageComponent,
    ElementsComponent,
    BuyCreditsComponent,
    RegistrationPageComponent,
    RegistrationFormComponent,
    AccountHeaderComponent,
    NewUserComponent,
    VideoTableComponent,
    UnavailableDirective,
    EmailConfirmationComponent,
    HowItWorksComponent,
    AchievementsComponent,
    BackgroundComponent,
    UpdateEmailComponent,
    VimeoPlayerComponent,
    CoachFinalCommentsComponent,
    HelperComponent,
    ForgotPasswordComponent,
    TermsAndConditionsComponent,
    AudioRecorderComponent,
    AudioPlayerComponent
  ],
  imports: [
    MatDialogModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MainPipe,
    CommonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatSliderModule,
    ImageCropperModule,
    AngularFireStorageModule,
    CoreModule,
    AngularFireModule.initializeApp({
      apiKey: "",
      authDomain: "coach-connect-sports.firebaseapp.com",
      databaseURL: "https://coach-connect-sports.firebaseio.com",
      projectId: "coach-connect-sports",
      storageBucket: "gs://coach-connect-sports.appspot.com/",
      messagingSenderId: "637820629622",
      appId: "",
      measurementId: "G-LBHHYVX8QJ"
    }, "CoachConnectSite"),     
    AngularFirestoreModule.enablePersistence({synchronizeTabs: true}),   
    AngularFirePerformanceModule,    
    AngularFireAnalyticsModule,                           
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgxAuthFirebaseUIModule.forRoot({
        apiKey: "",
        authDomain: "coach-connect-sports.firebaseapp.com",
        databaseURL: "https://coach-connect-sports.firebaseio.com",
        projectId: "coach-connect-sports",
        storageBucket: "gs://coach-connect-sports.appspot.com/",
        messagingSenderId: "637820629622",
        appId: "",
        measurementId: "G-LBHHYVX8QJ"
      }, null, {
        enableFirestoreSync: false, // enable/disable autosync users with firestore
        toastMessageOnAuthSuccess: false, // whether to open/show a snackbar message on auth success - default : true
        toastMessageOnAuthError: false, // whether to open/show a snackbar message on auth error - default : true
        authGuardFallbackURL: '/login', // url for unauthenticated users - to use in combination with canActivate feature on a route
        authGuardLoggedInURL: '/platform', // url for authenticated users - to use in combination with canActivate feature on a route
        passwordMaxLength: 20, // `min/max` input parameters in components should be within this range.
        passwordMinLength: 8, // Password length min/max in forms independently of each componenet min/max.
        // Same as password but for the name
        nameMaxLength: 50,
        nameMinLength: 2,
        // If set, sign-in/up form is not available until email has been verified.
        // Plus protected routes are still protected even though user is connected.
        guardProtectedRoutesUntilEmailIsVerified: false
      }),
    MatSnackBarModule,
    MatRadioModule,
    MatSlideToggleModule,
    AngularFireFunctionsModule,
    MatPasswordStrengthModule,
    MatMenuModule,
    MatSidenavModule,
    MatCheckboxModule,
    AppRoutingModule,
    FormsModule,
    MatExpansionModule
  ],
  providers: [{ provide: CONFIG, useValue: {
    send_page_view: true,
    allow_ad_personalization_signals: false,
    anonymize_ip: true,
    DEBUG_MODE : true}
  },{
    provide: ErrorsHandler,
    useClass: ErrorsHandler,
  }, ConfigService, AuthService, AngularFirestore, AngularFireStorage, DatePipe, UserTrackingService, ScreenTrackingService],
  bootstrap: [AppComponent],
  entryComponents: [TermsAndConditionsComponent, ForgotPasswordComponent, HelperComponent, CoachFinalCommentsComponent, UpdateEmailComponent, BackgroundComponent, AchievementsComponent, BuyCreditsComponent, AreYouSureComponent, CoachComponent, ProfileInfoFormComponent, VideoUploadFormComponent, CostComponent]
})
export class AppModule { }