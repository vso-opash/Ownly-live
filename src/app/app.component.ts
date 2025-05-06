import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  ActivatedRoute,
  Event
} from '@angular/router';
import { Location } from '@angular/common';
import { DataShareService } from './landing-layout/shared/data-share.service';
import { CrudService } from './landing-layout/shared/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Meta,Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { MetatagsService } from './metatags.service';
import { seoSitemap } from './seo-sitemap';
import { CanonicalService } from './shared/canonical.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'synciit-public';
  public url;
  checkCoockie: boolean;
  hostName: any = '';
  host: any = '';
  public currentPage: any;
  public sub;
  public metatagsService;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    public metaService: Meta,
    private all: CrudService,
    private router: Router,
    private titleService: Title,
    private canonicalService: CanonicalService
  ) {
    if (environment.production) {
      // const script = document.createElement('script');
      // script.async = true;
      // script.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.google_code;
      // document.head.prepend(script);
    }

    // this.all.getAccessToken().subscribe(res => {
    //   const accessToken = res['access_token'];
    //   localStorage.setItem('accessToken', btoa(accessToken));
    // });
    this.checkCoockie = true;
    this.metaService.updateTag({ name: 'description', content: 'data' }); 

    this.sub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.setMetaTags(event);
      }
    });
  }

  ngOnInit() {
   
  

    this.metaService.updateTag({ name: 'description', content: 'Dynamic Angular Tag-Added on System!' });
    this.canonicalService.setCanonicalURL();
    this.sub && this.sub.unsubscribe()
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
      .subscribe(() => {
 
        var rt = this.getChild(this.activatedRoute)
 
        rt.data.subscribe(data => {
          console.log(data);
          this.titleService.setTitle(data.title)
 
          if (data.descrption) {
            this.metaService.updateTag({ name: 'description', content: data.descrption })
          } else {
            this.metaService.removeTag("name='description'")
          }
 
          if (data.robots) {
            this.metaService.updateTag({ name: 'robots', content: data.robots })
          } else {
            this.metaService.updateTag({ name: 'robots', content: "follow,index" })
          }
 
          if (data.ogUrl) {
            this.metaService.updateTag({ property: 'og:url', content: data.ogUrl })
          } else {
            this.metaService.updateTag({ property: 'og:url', content: this.router.url })
          }
 
          if (data.ogTitle) {
            this.metaService.updateTag({ property: 'og:title', content: data.ogTitle })
          } else {
            this.metaService.removeTag("property='og:title'")
          }
 
          if (data.ogDescription) {
            this.metaService.updateTag({ property: 'og:description', content: data.ogDescription })
          } else {
            this.metaService.removeTag("property='og:description'")
          }
 
          if (data.ogImage) {
            this.metaService.updateTag({ property: 'og:image', content: data.ogImage })
          } else {
            this.metaService.removeTag("property='og:image'")
          }
 
 
        })
 
      })
 
  }
 
  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
 
  }
  

  checkCookie() {
    let cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
    }
    return cookieEnabled;
  }
  private setMetaTags(event: NavigationEnd) {
    const item = seoSitemap.find((i) => event.urlAfterRedirects === i.customUrl);
    if (item) {
      if (item.title) this.metatagsService.updateTitle(item.title);

      this.metatagsService.updateTags([
        item.description ? { name: 'description', content: item.description } : null,
        item.image ? { name: 'image', content: item.image } : null,
      ]);
      this.metatagsService.updateTag({ property: 'og:url', content: window.location.href });
    } else {
      this.metatagsService.updateTitle('Search for your Ownly   Trade Professional Common title there');
    }
}
}
