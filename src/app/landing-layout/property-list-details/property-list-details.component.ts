import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { CrudService } from '../shared/crud.service';
import { DataShareService } from '../shared/data-share.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { Lightbox as box } from 'ngx-lightbox';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-property-list-details',
  templateUrl: './property-list-details.component.html',
  styleUrls: ['./property-list-details.component.css'],
  animations: [
    trigger('slideOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('2000ms ease-in', style({ transform: 'translateY(50%)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('2000ms ease-in', style({ transform: 'translateY(50%)' }))
      ])
    ])
  ],
})
export class PropertyListDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  public propertyDetails: any;
  public adData: any;
  imageUrl = environment.imageUrl;
  public agentDetails = [];
  public agencyDetails = {};
  public similarProperties = [];
  public toggelText = 'READ MORE';
  public display: boolean = false;
  public selectedEnquries: string[] = ['Could I have a price guide?'];
  public form: FormGroup = new FormGroup({});
  public formData: any;
  public isFormSubmited = false;
  public enquiriesErr = false;
  public paramsSub;
  public propertyId: number;
  public propertyImages: any[] = [];
  public lat: number = 51.678418;
  public long: number = 7.809007;
  // carousel settings
  public search_obj = {};
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
    private _lightbox: box,
    private propertyService: PropertyService,
    public fb: FormBuilder,
    private messageService: MessageService,
    private service: CrudService,
    private spinner: NgxSpinnerService,
    private dataShare: DataShareService,
    private titleService: Title,
    private http: HttpClient
  ) {
    this.titleService.setTitle(this.route.snapshot.data['title']);
    this.spinner.show("outer");
    window.scrollTo(0, 0);

    this.search_obj = JSON.parse(localStorage.getItem('search_obj'));
    console.log('search_obj => ', this.search_obj);
    let postcode = this.search_obj['locations'][0]['postCode'];
    let state = this.search_obj['locations'][0]['state'];
    if (state == 'NSW') {
      state = 'New South Wales';
    }
    if (state == 'ACT') {
      state = 'Australian Capital Territory';
    }
    if (state == 'VIC') {
      state = 'Victoria';
    }
    if (state == 'QLD') {
      state = 'Queensland';
    }
    if (state == 'SA') {
      state = 'South Australia';
    }
    if (state == 'WA') {
      state = 'Western Australia';
    }
    if (state == 'TAS') {
      state = 'Tasmania';
    }
    if (state == 'NT') {
      state = 'Northern Territory';
    }
    const obj = {};
    if (postcode) {
      console.log('postcode :: condition => ');
      obj['searchtext'] = postcode;
    }
    if (state) {
      console.log('postcode :: state => ');
      obj['searchState'] = state;
    }
    console.log('obj => ', obj);
    this.service.post('advertiseList', obj
      // {
      //   searchtext: postcode,
      //   searchState: state
      // }
    ).toPromise().then(async (res) => {
      console.log('res :: AD LIST ==============================> ', res);
      if (res['data'] && res['data'].length > 0) {
        this.adData = this.random_item(res['data']);
      }
      console.log('adData => ', this.adData);
      if (this.adData && this.adData._id) {
        await this.viewedAdvertise(this.adData._id);
      }
    });

    this.paramsSub = this.route.params.subscribe(params => {
      this.propertyId = parseInt(params.id, 10);
      this.propertyImages = [];
      const propertyDetails = this.route.snapshot.data['propertyDetail'];
      console.log('propertyDetails ===================> ', propertyDetails);
      this.lat = propertyDetails['geoLocation'].latitude;
      this.long = propertyDetails['geoLocation'].longitude;
      const agency_id = propertyDetails['advertiserIdentifiers'] ? propertyDetails['advertiserIdentifiers'].advertiserId : null;

      // for similar properties
      const similar_properties = this.route.snapshot.data["similarProperties"];
      this.similarProperties = this.createPropertyAraay(similar_properties);

      // for agents 
      const contactIds = propertyDetails['advertiserIdentifiers'] ? propertyDetails['advertiserIdentifiers'].contactIds : [];
      this.propertyDetails = propertyDetails;
      this.propertyService.getAgencyDetails(agency_id).subscribe((a_d) => {
        let agencyObj = {
          name: a_d['name'] ? a_d['name'] : '',
          id: a_d['id'] ? a_d['id'] : ''
        }
        this.propertyDetails['agencyDetails'] = agencyObj;
        if (contactIds && contactIds.length > 0 && a_d['agents'] && a_d['agents'].length > 0) {
          let agentsObj = [];
          const agentArray = a_d['agents'];
          for (const agent of agentArray) {
            if (contactIds.indexOf(agent.id) !== -1) {
              agentsObj.push(agent);
            }
          }
          this.propertyDetails['agentDetails'] = agentsObj;
        }
      });
      const len = propertyDetails['media'].length;
      if (len < 5) {
        let cnt = 5 - len;
        for (let i = 0; i < len; i++) {
          let obj = {
            source: `${propertyDetails['media'][i].url}/800x600`,
            thumbnail: `${propertyDetails['media'][i].url}/800x600`,
            src: `${propertyDetails['media'][i].url}`,
            title: ``
          }
          this.propertyImages.push(obj);
        }
        for (let i = 0; i < cnt; i++) {
          let obj = {
            source: `${propertyDetails['media'][i].url}/800x600`,
            thumbnail: `${propertyDetails['media'][i].url}/800x600`,
            src: `${propertyDetails['media'][i].url}`,
            title: ``
          }
          this.propertyImages.push(obj);
        }
      } else if (len >= 5) {
        for (let i = 0; i < 5; i++) {
          let obj = {
            source: `${propertyDetails['media'][i].url}/800x600`,
            thumbnail: `${propertyDetails['media'][i].url}/800x600`,
            src: `${propertyDetails['media'][i].url}`,
            title: ``
          }
          this.propertyImages.push(obj);
        }
      }
    });
    // for enquiry form
    this.formData = {};
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.form = this.fb.group({
      'first_name': new FormControl('', Validators.compose([Validators.required, this.noWhitespaceValidator])),
      'last_name': new FormControl('', Validators.compose([Validators.required, this.noWhitespaceValidator])),
      'email': new FormControl('', Validators.compose([Validators.required, Validators.pattern(pattern)])),
      'phone': new FormControl('', Validators.pattern("[0-9]{10}")),
      'post_code': new FormControl('', Validators.pattern("[0-9]{4}")),
      'property_query': new FormControl(''),
      'enquiries': new FormControl('')
    });
  }

  // white space validation
  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'required': true }
  }

  // random 
  random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  // Viewed Ad
  viewedAdvertise(id) {
    // this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
    //   console.log('res for ip => ', res);
    //   const ipAddress = res.ip;
    //   if (ipAddress) {
    //     console.log('value for viewwd ad api :: userIp , adId => ', ipAddress, id);
    //     this.service.post('viewedAdvertise', {
    //       userIP: ipAddress,
    //       adId: id
    //     }).subscribe((resp) => {
    //       console.log('res :: viewed ad api=> ', resp);
    //     });
    //   }
    // });
  }

  // clicked Ad
  clickedAd(id) {
    console.log('id => ', id);
    this.service.post('clickedAdvertise', {
      adId: id
    }).subscribe((res) => {
      console.log('res :: clicked ad api=> ', res);
    });
  }

  // validation for integer number
  restrictAlphabets(e) {
    var x = e.which || e.keycode;
    if ((x >= 48 && x <= 57) || x === 8 ||
      (x >= 35 && x <= 40) || x === 46) {
      return true;
    } else {
      return false;
    }
  }

  // extract property data from DOmain API
  createPropertyAraay(properties) {
    let list = [];
    for (const p of properties) {
      if (p.hasOwnProperty("listing") && list.length < 3) {
        if (p.id !== this.propertyId) {
          list.push(p.listing);
        }
      }
      else if (p.hasOwnProperty("listings") && list.length < 3) {
        if (p.listings.length > 0) {
          for (const ele of p.listings) {
            if (list.length < 3) {
              if (ele.id !== this.propertyId) {
                list.push(ele);
              }
            } else {
              return list;
            }
          }
        }
      } else if (list.length > 2) {
        return list;
      }
    }
    // return list;
  }

  // toggle for read more feature
  toggle(text) {
    if (text === 'READ MORE') {
      this.toggelText = 'READ LESS';
    } else {
      this.toggelText = 'READ MORE';
    }
  }

  // dialogue button
  showDialog(agent: Object) {
    this.display = true;
    this.formData.agent_email_id = agent['email'];
    this.formData.agent_id = `${agent['id']}`;
    this.formData.property_url = this.propertyDetails['seoUrl'];
    this.formData.recivername = `${agent['firstName']} ${agent['lastName']}`;
  }

  ngOnInit() { }

  // validation for enquiries
  changeEnquiry() {
    if (this.selectedEnquries.length > 0) {
      this.enquiriesErr = false;
    } else {
      this.enquiriesErr = true;
    }
  }

  // submit request form
  submit(form) {
    this.isFormSubmited = true;
    if (form.valid) {
      if (this.selectedEnquries.length > 0) {
        this.formData.enquiries = this.selectedEnquries;
        this.spinner.show("outer");
        this.service.post('send_customer_enquiry', this.formData).subscribe(res => {
          this.isFormSubmited = false;
          this.enquiriesErr = false;
          this.selectedEnquries = ['Could I have a price guide?'];
          this.display = false;
          this.formData = {};
          this.spinner.hide("outer");
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Enquiry Sent Successfully' });
        }, err => {
          err = err.error;
          this.isFormSubmited = false;
          this.enquiriesErr = false;
          this.selectedEnquries = ['Could I have a price guide?'];
          this.display = false;
          this.formData = {};
          this.spinner.hide("outer");
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        });
      }
    } else {
      console.log('\n in err : ', form);
    }
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  ngAfterViewInit() {
    this.spinner.hide("outer");
  }

  ngAfterViewChecked() {
    // document
    //   .getElementsByClassName("ui-lightbox-content")
    //   .item(0)
    //   .setAttribute("style", `width: unset;height: unset;`);
  }
  open(index: number): void {
    this._lightbox.open(this.propertyImages, index, { wrapAround: true, showImageNumberLabel: false, disableScrolling: false, positionFromTop: 100 });
  }
}
