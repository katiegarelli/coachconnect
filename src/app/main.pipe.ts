import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from './config.service';
import { config, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { catchError, retry, concatMap } from 'rxjs/operators';


config;
const allowed = ['displayName','lastName','dob','organizationId','background','achievements','email','yearsExperience','phone','address1','address2','City','State','Zip'];

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}

@Pipe({name: 'floor'})
export class FloorPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    return Math.floor(value);
  }
}

//shows all the user fields that are visible and currently set on the user
@Pipe({name: 'allSetVislibleUserFields'})
export class allSetVisibleUserFieldsPipe implements PipeTransform {
  transform(value, visibleValue) : any {
    return Object.keys(value)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: value[key]
        };
      }, {});
  }
}

//shows all the user fields that are visible and currently set on the user
@Pipe({name: 'getStatus'})
export class getStatusPipe implements PipeTransform {

  transform(value, visibleValue) : any {
    return value.body['transcode']['status'];
  }
}

//shows all the user fields that are visible and currently set on the user
@Pipe({name: 'vimeoThumbnail'})
export class vimeoThumbnailPipe implements PipeTransform {
  constructor(private http: HttpClient) {}

  transform(value, visibleValue) : any {
    return this.http.get('https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + value).pipe(
      retry(10), // retry a failed request up to times
      catchError((error) => {return new Observable(error);}) // then handle the error
    );
  }
  
    //setTimeout(function() {this.getThumbnailRequest(value)}, 5000);
}

//shows all the user fields that are visible and currently set on the user
@Pipe({name: 'thumbUrl'})
export class thumbUrlPipe implements PipeTransform {
  constructor(private http: HttpClient) {}

  transform(value, visibleValue) : any {
    // Use JSON filtering so we only receive the data that we need to make an upload happen.
    if(value) {
      return value['thumbnail_url'];
    } else {
      return null;
    }
  }
}

//shows all allowed user fields even if they arent set
@Pipe({name: 'vislibleUserFields'})
export class VisibleUserFieldsPipe implements PipeTransform {
  transform(value, visibleValue) : any {
    allowed.forEach(element => {
      if (!Object.keys(value).includes(element)){
        value[element] = "";
      } 
    });
    return Object.keys(value)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: value[key]
        };
      }, {});
  }
}

@Pipe({name: 'userDisplayFields'})
export class UserDisplayFieldsPipe implements PipeTransform {
  constructor(private config: ConfigService, public datepipe: DatePipe) {}

  transform(value, visibleValue) : any {
    let keys = [];

    Object.keys(value).filter(key => this.config.getConfig().userFormFields.includes(key)).sort(this.config.getConfig().sortUserInfo).forEach(key => {
      if(key !== "dob") {
        keys.push({key: key, value: value[key]});
      } else {
        keys.push({key: key, value: value[key] == null ? "" : this.datepipe.transform( value[key].toDate(), 'MM/dd/yyyy')});
      }
    })

    return keys;
  }
}

//shows all user fields even if they arent set
@Pipe({name: 'userDisplayFormFields'})
export class UserDisplayFormFieldsPipe implements PipeTransform {
  constructor(private config: ConfigService, public datepipe: DatePipe) {}

  transform(value, visibleValue) : any {

    let keys = [];

    Object.keys(value).filter(key => this.config.getConfig().userFormFields.includes(key)).sort(this.config.getConfig().sortUserInfo).forEach(key => {
      if(key === "email") {} 
      else if(key !== "dob") {
        keys.push({key: key, value: value[key]});
      } else {
        keys.push({key: key, value: value[key] == null ? "" : new Date(value[key].seconds *1000)});
      }
    })

    return keys;
  }
}

//shows all user fields even if they arent set
@Pipe({name: 'getDownloadUrl'})
export class GetDownloadUrlPipe implements PipeTransform {
  constructor(private storage: AngularFireStorage) {}

  transform(value, visibleValue) : any {
    if(value.contentLocation) {
      return this.storage.ref(value.contentLocation).getDownloadURL();
    }
  }
}

//shows all user fields even if they arent set
@Pipe({name: 'getDownloadUrlThumb'})
export class GetDownloadUrlThumbPipe implements PipeTransform {
  constructor(private storage: AngularFireStorage) {}

  transform(value, visibleValue) : any {
    if(value.contentLocation) {
      return this.storage.ref(value.contentLocation + "_thumb").getDownloadURL();
    }
  }
}

//shows all user fields even if they arent set
@Pipe({name: 'getCoachUrl'})
export class getCoachUrlPipe implements PipeTransform {
  constructor(private storage: AngularFireStorage) {}

  transform(value, visibleValue) : any {
    if(value) {
      const id = value.split("|", 5)[0];
      const timestamp = value.split("|", 5)[4];

      return this.storage.ref("profilePictures/" + id + "_" + timestamp).getDownloadURL();
    }
  }
}

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

    transform(value: number): string {
      if(value) {
        var minutes: number = Math.floor(value / 60);
        var seconds: number = Math.floor(value - minutes * 60);
        return (minutes >= 10 ? minutes : '0' + minutes) + ':' + (seconds >= 10 ? seconds : '0' + seconds);
      } else {
        return "00:00";
      }
    }

}

@Pipe({name: 'getProfilePictureUrl'})
export class GetProfilePictureUrlPipe implements PipeTransform {
  constructor(private storage: AngularFireStorage) {}

  transform(value, visibleValue) : any {
    if(value && value.photoURL) {
      return this.storage.ref(value.photoURL).getDownloadURL();
    }
  }
}

//shows all user fields even if they arent set
@Pipe({name: 'label'})
export class DisplayLabelPipe implements PipeTransform {
  constructor(private config: ConfigService) {}

  transform(value, visibleValue) : any {  
    return this.config.getConfig().labels[value] ? this.config.getConfig().labels[value] : value;
  }
}

@Pipe({name: 'coachDropdownId'})
export class CoachDropdownIdPipe implements PipeTransform {
  transform(value, visibleValue) : any {  
    return value.split("|", 4)[0];
  }
}

@Pipe({name: 'coachDropdownName'})
export class CoachDropdownNamePipe implements PipeTransform {
  transform(value, visibleValue) : any {  
    return value.split("|", 4)[1];
  }
}

@Pipe({name: 'coachDropdownPrice'})
export class CoachDropdownPricePipe implements PipeTransform {
  transform(value, visibleValue) : any {  
    return value.split("|", 4)[2];
  }
}

@Pipe({name: 'coachDropdownStatus'})
export class CoachDropdownStatusPipe implements PipeTransform {
  transform(value, visibleValue) : any {  
    return value.split("|", 4)[3];
  }
}

@Pipe({name: 'getCoachList'})
export class GetCoachListPipe implements PipeTransform {
  transform(value, visibleValue) : any {  

    var coaches = [];

    if(value) {
      Object.keys(value['coach-map']).forEach(key => {
        coaches.push(key + "|" + value['coach-map'][key]);
      });
    }
    
    return coaches;
  }
}

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
 
  constructor(private sanitizer: DomSanitizer) {
  }
 
  public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
			case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
			case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
			case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
			case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
			case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
			default: throw new Error(`Invalid safe type specified: ${type}`);
		}
  }
 
}



@NgModule({
  declarations:[getStatusPipe, thumbUrlPipe, vimeoThumbnailPipe, SafeHtmlPipe, GetDownloadUrlThumbPipe, getCoachUrlPipe, CoachDropdownStatusPipe, FloorPipe, MinuteSecondsPipe, GetCoachListPipe,CoachDropdownPricePipe,CoachDropdownNamePipe,CoachDropdownIdPipe,GetProfilePictureUrlPipe, KeysPipe, VisibleUserFieldsPipe, UserDisplayFieldsPipe, UserDisplayFormFieldsPipe, allSetVisibleUserFieldsPipe, DisplayLabelPipe, GetDownloadUrlPipe], // <---
  imports:[CommonModule],
  exports:[getStatusPipe, thumbUrlPipe, vimeoThumbnailPipe, SafeHtmlPipe, GetDownloadUrlThumbPipe, getCoachUrlPipe, CoachDropdownStatusPipe, FloorPipe, MinuteSecondsPipe, GetCoachListPipe,CoachDropdownPricePipe,CoachDropdownNamePipe,CoachDropdownIdPipe,GetProfilePictureUrlPipe, KeysPipe, VisibleUserFieldsPipe, UserDisplayFieldsPipe, UserDisplayFormFieldsPipe, allSetVisibleUserFieldsPipe, DisplayLabelPipe, GetDownloadUrlPipe] // <---
})

export class MainPipe{
}