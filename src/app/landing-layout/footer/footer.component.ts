import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { CrudService } from '../shared/crud.service';
import { DataShareService } from '../shared/data-share.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public footerData: any = {};
  public isDisplay = true;
  public currentPage: any;
  clickTerms = false;
  clickPrivacy = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private all: CrudService,
    private dataShare: DataShareService) {
    this.all.get('getFooterData').subscribe(res => {
      this.footerData = res["data"][0];
    });
  }

  ngOnInit() {
    this.currentPage = `/${(this.router.url).split('/')[1]}`;
    this.router.events.subscribe((e: Event) => {
      if (e instanceof NavigationEnd) {
        if (this.currentPage === '/property_list' || this.currentPage === '/trader') {
          this.isDisplay = false;
        } else {
          this.isDisplay = true;
        }
      }
    });
    if (this.currentPage === '/property_list' || this.currentPage === '/trader') {
      this.isDisplay = false;
    } else {
      this.isDisplay = true;
    }

    // this.dataShare.currentPage.subscribe(page => {
    //   // For prperty list footer
    //   if ((page.length > 1) && page[1] === "property_list") {
    //     this.isDisplay = false;
    //   } else{
    //     this.isDisplay = true;
    //   }
    // });
  }

  // Click on Tems and conditions
  onClickTerms() {
    this.clickTerms = true;
  }

  // Click on Tems and conditions
  onClickPrivacy() {
    this.clickPrivacy = true;
  }


}
