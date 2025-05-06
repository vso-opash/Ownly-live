import {
  Component,
  OnInit,
  AfterViewInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PropertyService } from "../shared/property.service";
import { OwlOptions } from "ngx-owl-carousel-o";
import { DataShareService } from "../shared/data-share.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-properties-list",
  templateUrl: "./properties-list.component.html",
  styleUrls: ["./properties-list.component.css"]
})
export class PropertiesListComponent implements OnInit, AfterViewInit {

  // infinite scroll settings
  public propertiesList = [];
  public properties = [];
  public currentPage = 1;
  public throttle = 300;
  public scrollDistance = 4;
  public scrollUpDistance = 2;
  public search_obj = {};
  public hasNoPropertyRecords = false;

  // carousel settings
  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    autoplay: false,
    navSpeed: 700,
    navText: ["&#8249;", "&#8250;"],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  };

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private dataShare: DataShareService,
    private spinner: NgxSpinnerService,
    private titleService: Title
  ) {
    this.titleService.setTitle(this.route.snapshot.data['title']);
    window.scrollTo(0, 0);
    this.spinner.show("outer");
    this.propertiesList = [];
    this.properties = this.route.snapshot.data["propertyList"];
    this.search_obj = JSON.parse(localStorage.getItem('search_obj'));
  }

  createPropertyAraay(properties) {
    let list = [];
    properties.forEach(p => {
      if (p.hasOwnProperty("listing")) {
        list.push(p.listing);
      }
      if (p.hasOwnProperty("listings")) {
        if (p.listings.length > 0) {
          p.listings.forEach(ele => {
            list.push(ele);
          });
        }
      }
    });
    if (list.length === 0) {
      this.hasNoPropertyRecords = true;
    } else {
      this.hasNoPropertyRecords = false;
    }
    this.addItems(list);
  }

  addItems(list) {
    const cnt = list.length;
    for (let i = 0; i < cnt; i++) {
      this.propertiesList['push'](list[i]);
    }
    this.spinner.hide("outer");
  }

  onScrollDown() {
    this.currentPage += 1;
    this.search_obj['page'] = this.currentPage;
    // this.dataShare.changeSearchObj(this.search_obj);
    this.propertyService.getProperties(this.search_obj).toPromise().then(async res => {
      this.hasNoPropertyRecords = false;
      await this.createPropertyAraay(res);
    });
  }

  ngOnInit() {
    this.dataShare.currentsearchObj.subscribe(async s_obj => {
      if (s_obj) {
        this.propertiesList = [];
        this.search_obj = s_obj;
        this.currentPage = 1;
        this.search_obj['page'] = this.currentPage;
        await this.propertyService.getProperties(this.search_obj).toPromise().then(async res => {
          this.hasNoPropertyRecords = false;
          await this.createPropertyAraay(res);
        });
      } else {
        this.hasNoPropertyRecords = false;
        this.createPropertyAraay(this.properties);
      }
    });
  }

  ngAfterViewInit() {
  }
}
