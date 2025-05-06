import { Component, OnInit, AfterViewChecked, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudService } from '../shared/crud.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginComponent } from '../login/login.component';
import { Title } from '@angular/platform-browser';
import { Lightbox as box } from 'ngx-lightbox';
import * as moment from 'moment';
import { EncrDecrService } from '../shared/EncrDecrService.service';
import _ from 'lodash'

@Component({
  selector: 'app-trader-profile',
  templateUrl: './trader-profile.component.html',
  styleUrls: ['./trader-profile.component.css']
})
export class TraderProfileComponent implements OnInit, AfterViewChecked {

  @Output() loginOutput = new EventEmitter<Boolean>();

  traderData: any = [];
  trader: any = [];
  trader_id: any;
  category_id: any;
  startReview: number = 0;
  endReview: number = 5;
  p: number = 1; // use with pagination
  display: boolean = false; // Use for display dialogbox for send msg
  public toggelText = 'SHOW MORE';
  public reviewtoggelText = 'LOAD MORE REVIEWS';
  showNumber: Boolean = false;
  public imageUrl = environment.imageUrl;
  public selectedMoment = new Date();
  public sendMessage: FormGroup;
  form_validation: boolean = false;
  disableSubmit = false;
  @Input() login = LoginComponent;
  public portfolioImages: any[] = [];
  message: string;

  constructor(
    public fb: FormBuilder,
    private lightbox: box,
    private route: ActivatedRoute,
    private router: Router,
    private EncrDecr: EncrDecrService,
    private toastr: ToastrService, private service: CrudService,
    // private login: LoginComponent,
    private titleService: Title,
    private spinner: NgxSpinnerService) {
    this.titleService.setTitle(this.route.snapshot.data['title']);
    this.route.params.subscribe(res => { this.trader_id = res['trader_id'] });
  }

  ngOnInit() {
    this.spinner.show('outer');
    this.route.snapshot.data['traderData']['ProfileData'].subscribe(async (res) => {
      console.log('res => ', res);
      if (res['code'] == 200) {
        this.traderData['ProfileData'] = await res['data']; // Store Profile Data
        let traderProfile = this.traderData['ProfileData']
        let docTitle = `${_.capitalize(traderProfile.firstname)} ${_.capitalize(traderProfile.lastname)} - `
        if (traderProfile.city) {
          docTitle += `${_.capitalize(traderProfile.city)}, `
        }
        if (traderProfile.state) {
          docTitle += `${_.capitalize(traderProfile.state)}, `
        }
        docTitle += 'AU '
        if (traderProfile.zipCode) {
          docTitle += `${traderProfile.zipCode} `
        }
        docTitle += ` | Ownly`
        document.title = `${docTitle}`;

        if (this.traderData[`ProfileData`][`categoriesDetails`] && this.traderData[`ProfileData`][`categoriesDetails`].length > 0) {
          this.traderData[`ProfileData`][`categoriesDetails`] = (this.traderData[`ProfileData`][`categoriesDetails`][0].hasOwnProperty('name')) ? this.traderData[`ProfileData`][`categoriesDetails`] : [];
          let serviceCategoryList = 'null'
          serviceCategoryList = JSON.stringify(this.traderData[`ProfileData`][`categoriesDetails`])
          localStorage.setItem('service_cat', serviceCategoryList)
        } else {
          let serviceCategoryList = JSON.parse(localStorage.getItem('service_cat')) ? JSON.parse(localStorage.getItem('service_cat')) : 'null'
          if (serviceCategoryList && serviceCategoryList !== null && serviceCategoryList !== 'null' && serviceCategoryList.length > 0) {
            this.traderData[`ProfileData`][`categoriesDetails`] = serviceCategoryList
          } else {
            this.traderData[`ProfileData`][`categoriesDetails`] = []
          }
        }

        if (this.traderData['ProfileData']) {
          if (this.traderData['ProfileData'].categoriesDetails) {
            this.category_id = this.traderData['ProfileData'].categoriesDetails.length > 0 ?
              this.traderData[`ProfileData`].categoriesDetails[0]['_id'] : '';
          }
          if (this.traderData['ProfileData'].images) {
            for (let index = 0; index < this.traderData['ProfileData'].images.length; index++) {
              let obj = {
                src: `${this.imageUrl}user_image${this.traderData['ProfileData'].images[index].url}`,
                thumb: `${this.imageUrl}user_image${this.traderData['ProfileData'].images[index].url}`,
                caption: ``
              }
              this.portfolioImages.push(obj);
            }
          }
        }
      } else {
        let msg = res['message'];
        this.toastr.error(msg, 'Error!', { timeOut: 3000 });
        this.spinner.hide('outer');
        // this.router.navigate(['/']);
      }
    }, (err) => {
      let msg = err['error']['message'];
      this.toastr.error(msg, 'Error!', { timeOut: 3000 });
      this.spinner.hide('outer');
      // this.router.navigate(['/']);
    });

    this.route.snapshot.data['traderData']['UserReview'].subscribe(async (res) => {
      if (res['code'] == 200) {
        this.traderData['UserReview'] = await res; // Store User Review Data
      } else {
        let msg = res['message'];
        this.toastr.error(msg, 'Error!', { timeOut: 3000 });
        this.spinner.hide('outer');
      }
    }, (err) => {
      let msg = err['error']['message'];
      this.toastr.error(msg, 'Error!', { timeOut: 3000 });
      this.spinner.hide('outer');
      // this.router.navigate(['/']);
    });

    this.route.snapshot.data['traderData']['AllReview'].subscribe(async (res) => {
      if (res['code'] == 200) {
        this.traderData['AllReview'] = await res['data']; // Store User ALL review Data
        this.spinner.hide('outer');
      } else {
        let msg = res['message'];
        this.toastr.error(msg, 'Error!', { timeOut: 3000 });
        this.spinner.hide('outer');
        // this.router.navigate(['/']);
      }
    }, (err) => {
      let msg = err['error']['message'];
      this.toastr.error(msg, 'Error!', { timeOut: 3000 });
      this.spinner.hide('outer');
      // this.router.navigate(['/']);
    });


    this.route.snapshot.data['traderData']['JobHistory'].subscribe(async (res) => {
      if (res['code'] == 200) {
        this.traderData['JobHistory'] = await res['data']; // Store User ALL review Data
        this.spinner.hide('outer');
      } else {
        let msg = res['message'];
        this.toastr.error(msg, 'Error!', { timeOut: 3000 });
        this.spinner.hide('outer');
        // this.router.navigate(['/']);
      }
    }, (err) => {
      let msg = err['error']['message'];
      this.toastr.error(msg, 'Error!', { timeOut: 3000 });
      this.spinner.hide('outer');
      // this.router.navigate(['/']);
    });

    this.sendMessage = this.fb.group({
      'message': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(500)])),
    });
  }

  // Use for Show Number
  clickOnShowNumber() {
    this.service.post(`updateRevealContactNumber`, { reveal_contact_number: 1, user_id: this.trader_id }).subscribe(res => {
      if (res['code'] = 200) {
        this.showNumber = true;
      }
    })
  }

  // toggle for read more feature
  toggle(text, tag) {
    if (tag == 'about_user') {
      if (text === 'SHOW MORE') {
        this.toggelText = 'SHOW LESS';
      } else {
        this.toggelText = 'SHOW MORE';
      }
    }

    // Load more for review
    if (tag == 'review') {
      if (this.traderData['AllReview'].length >= this.endReview && text === 'LOAD MORE REVIEWS') {
        this.endReview = this.endReview + 5; // Append five records
        this.reviewtoggelText = 'LOAD MORE REVIEWS';
        if (this.traderData['AllReview'].length <= this.endReview) { // checked length for change label after appens five records
          this.reviewtoggelText = 'LOAD LESS REVIEWS';
        }
      } else {
        this.endReview = 5;
        this.reviewtoggelText = 'LOAD MORE REVIEWS';
      }
    }
  }

  // Use for display dialogbox for send msg
  showDialog() {
    if (localStorage.getItem('user')) {
      this.display = true;
    } else {
      this.service.onloginClick();
    }
  }
  // Use for display dialogbox for send msg
  send_Message(flag: boolean) {
    this.form_validation = !flag;
    if (flag) {
      this.disableSubmit = true;

      // Send Message API call
      const userData = this.EncrDecr.getEncrypt(localStorage.getItem('user'));
      if (!userData) {
        this.toastr.error('Server is busy please try a while', 'Info!', { timeOut: 3000 });
        return;
      }
      const reqData = {
        sender_id: userData.data._id,
        receiver_id: this.traderData.ProfileData._id,
        firstname: userData.data.firstname,
        lastname: userData.data.lastname,
        message: this.message,
        time: moment().toDate()
      };
      this.service.post('sendMessage', reqData).subscribe((res: any) => {
        this.disableSubmit = false;
        this.display = false;
        this.message = '';
        if (res.code === 200) {
          this.toastr.success('Message has been send successfully!', 'success!', { timeOut: 3000 });
        } else {
          this.toastr.error(res.message, 'error!', { timeOut: 3000 });
        }
      }, err => {
        console.log('send_Message: err => ', err);
        this.disableSubmit = false;
        // this.display = false;
        this.toastr.error('Server is busy please try a while', 'Info!', { timeOut: 3000 });
      });


    }
  }

  ngAfterViewChecked() {
    if (this.traderData['ProfileData']) {
      if (this.traderData['ProfileData'].availability) {
        this.checkWeekDays();
      }
    }
  }

  // Use for implement dots in calendar with logic based on API response
  checkWeekDays() {
    var avail_option = this.traderData['ProfileData'].availability.option;
    var avail_days = this.traderData['ProfileData'].availability.days;
    var avail_status = this.traderData['ProfileData'].availability.status;

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dt = new Date();
    var date = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), 1));
    var daysname = [];
    while (date.getMonth() === dt.getMonth()) {
      daysname.push(days[date.getDay()]);
      date.setDate(date.getDate() + 1);
    }

    var x = document.getElementsByClassName('ui-state-default');
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].className = 'ui-state-default ng-tns-c10-1 ng-star-inserted ' + ' ' + daysname[i]; // Added class of day name with each day.
    }

    if (avail_option == '0') { // if option 0 then apply dot with whole calder of current month
      var x = document.getElementsByClassName('ui-state-default');
      var i;
      for (i = 0; i < x.length; i++) {
        x[i].className = 'ui-state-default ng-tns-c10-1 ng-star-inserted highlight-availability' + ' ' + daysname[i];
      }
    } else if (avail_option == '1') { // if option 1 then apply dot with whole calder of current month except sunday
      var x = document.getElementsByClassName('ui-state-default');
      var i;
      for (i = 0; i < x.length; i++) {
        x[i].className = 'ui-state-default ng-tns-c10-1 ng-star-inserted highlight-availability';
      }
    } else if (avail_option == '2') { // if option 2 then apply dot with whole calder of current month with sunday & Saturday only
      var data = document.getElementsByClassName('Sunday');
      for (i = 0; i < data.length; i++) {
        data[i].className = 'ui-state-default ng-tns-c10-1 ng-star-inserted highlight-availability Sunday';
      }

      var data = document.getElementsByClassName('Saturday');
      for (i = 0; i < data.length; i++) {
        data[i].className = 'ui-state-default ng-tns-c10-1 ng-star-inserted highlight-availability Saturday';
      }

    } else if (avail_option == '3') { // if option 3 then apply dot with whole calder of current month except with specific day
      if (avail_days.indexOf('0') > -1) {
        const data = document.getElementsByClassName('Sunday');
        for (i = 0; i < data.length; i++) {
          data[i].className = 'ui-state-default ng-tns-c10-1 ng-star-inserted highlight-availability Sunday';
        }
      }

      if (avail_days.indexOf('1') > -1) {
        const data = document.getElementsByClassName('Monday');
        for (i = 0; i < data.length; i++) {
          data[i].className = 'ui-state-default ng-tns-c10-1 ng-star-inserted highlight-availability Monday';
        }
      }

      if (avail_days.indexOf('2') > -1) {
        const data = document.getElementsByClassName('Tuesday');
        for (i = 0; i < data.length; i++) {
          data[i].className = 'ui-state-default ng-tns-c10-1 ng-star-inserted highlight-availability Tuesday';
        }
      }

      if (avail_days.indexOf('3') > -1) {
        const data = document.getElementsByClassName('Wednesday');
        for (i = 0; i < data.length; i++) {
          data[i].className = 'ui-state-default ng-tns-c10-1 ng-star-inserted highlight-availability Wednesday';
        }
      }

      if (avail_days.indexOf('4') > -1) {
        const data = document.getElementsByClassName('Thursday');
        for (i = 0; i < data.length; i++) {
          data[i].className = 'ui-state-default ng-tns-c10-1 ng-star-inserted highlight-availability Thursday';
        }
      }

      if (avail_days.indexOf('5') > -1) {
        const data = document.getElementsByClassName('Friday');
        for (i = 0; i < data.length; i++) {
          data[i].className = 'ui-state-default ng-tns-c10-1 ng-star-inserted highlight-availability Friday';
        }
      }

      if (avail_days.indexOf('6') > -1) {
        const data = document.getElementsByClassName('Saturday');
        for (i = 0; i < data.length; i++) {
          data[i].className = 'ui-state-default ng-tns-c10-1 ng-star-inserted highlight-availability Saturday';
        }
      }
    }
  }

  requestClickHandler = () => {
    this.router.navigate(['/trade'], { queryParams: { s: 'request', t: this.trader_id, c: this.category_id } });
    if (this.traderData[`ProfileData`][`categoriesDetails`] && this.traderData[`ProfileData`][`categoriesDetails`].length > 0) {
      localStorage.setItem('catList', JSON.stringify(this.traderData[`ProfileData`][`categoriesDetails`]));
    }
  }

  open(index: number): void {
    this.lightbox
      .open(this.portfolioImages, index,
        {
          wrapAround: true,
          showImageNumberLabel: false,
          disableScrolling: false,
          positionFromTop: 100
        });
  }
}
