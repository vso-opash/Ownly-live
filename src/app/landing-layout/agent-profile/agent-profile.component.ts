import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudService } from '../shared/crud.service';
import { ToastrService } from 'ngx-toastr';
import { OwlOptions } from 'ngx-owl-carousel-o';
import * as moment from 'moment';
import { EncrDecrService } from '../shared/EncrDecrService.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Lightbox as box } from 'ngx-lightbox';

@Component({
  selector: 'app-agent-profile',
  templateUrl: './agent-profile.component.html',
  styleUrls: ['./agent-profile.component.css']
})
export class AgentProfileComponent implements OnInit {

  agentData: any = [];
  trader: any = [];
  agentId: any;
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
  form_validation: boolean = false;
  disableSubmit = false;
  public portfolioImages: any[] = [];
  message: string;
  agencyReview: Number;
  isAll = true;
  isTenant = false;
  isOwner = false;
  public sendMessage: FormGroup;
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
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private service: CrudService,
    private toastr: ToastrService,
    private EncrDecr: EncrDecrService,
    public fb: FormBuilder,
    private lightbox: box,
  ) {
    this.spinner.show('outer');
    console.log('this.router => ', this.router);
    this.titleService.setTitle(this.route.snapshot.data['title']);
    this.route.params.subscribe(res => {
      console.log('res => ', res);
      this.agentId = res.agent_id;
      this.getAgentDetail(res.agent_id);
    });
    this.sendMessage = this.fb.group({
      message: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(500)])),
    });
  }

  ngOnInit() { }

  // Get Agent detail
  getAgentDetail(id) {
    this.service.post('getAgentProfile', {
      role_id: '5a1d113016bed22901ce050b',
      user_id: id
    }).subscribe(res => {
      console.log('res :: agent profile data => ', res);
      if (res['code'] == 200) {
        this.agentData = res['data'][0];
        console.log('this.agentData => ', this.agentData);


        if (this.agentData) {
          if (this.agentData.images) {
            for (let index = 0; index < this.agentData.images.length; index++) {
              let obj = {
                src: `${this.imageUrl}user_image${this.agentData.images[index].url}`,
                thumb: `${this.imageUrl}user_image${this.agentData.images[index].url}`,
                caption: ``
              }
              this.portfolioImages.push(obj);
            }
          }
        }


        // Get Agent Review
        this.service.get(`getUserReview/${id}`).subscribe(resp => {
          console.log('resp => ', resp);
          this.agentData['UserReview'] = resp;
          // Get Agency Review
          if (res['data'][0]['agency_id'] && res['data'][0]['agency_id']['principle_id'] && res['data'][0]['agency_id']['principle_id']) {
            const agency_id = res['data'][0]['agency_id']['principle_id']._id;
            this.service.get(`getUserReview/${agency_id}`).subscribe(response => {
              console.log('response => ', response);
              if (response['code'] == '200') {
                this.agentData['agencyReview'] = response;
                this.agencyReview = response['data'] ? response['data'] : 0;
                this.spinner.hide('outer');
              } else {
                this.spinner.hide('outer');
              }
            }, err => {
              let msg = err['error']['message'];
              // this.toastr.error(msg, 'Error!', { timeOut: 3000 });
              this.spinner.hide('outer');
            });
          }
        }, err => {
          let msg = err['error']['message'];
          // this.toastr.error(msg, 'Error!', { timeOut: 3000 });
          this.spinner.hide('outer');
          // this.router.navigate(['/trade']);
        });
        // Get all reviews
        this.service.get(`getTraderAllReviews/${this.agentId}`).subscribe(res => {
          console.log('res :: all reviews=> ', res);
          if (res['code'] == 200 && res['data'].length > 0) {
            this.agentData['AllReview'] = res['data']; // Store User ALL review Data
            console.log('this.agentData :: check here ======> ', this.agentData);
          } else {
            let msg = res['message'];
            // this.toastr.error(msg, 'Error!', { timeOut: 3000 });
            // this.router.navigate(['/']);
            // this.router.navigate(['/trade']);
          }
        }, err => {
          let msg = err['error']['message'];
          // this.toastr.error(msg, 'Error!', { timeOut: 3000 });
          this.spinner.hide('outer');
        });
        // Get Tenant reviews
        this.service.post(`GetUserRolesReview`, {
          user_id: this.agentId,
          user_role: '5a1d11c016bed22901ce050c'
        }).subscribe(res => {
          console.log('res :: all reviews=> ', res);
          if (res['code'] == 200) {
            this.agentData['TenantReviews'] = res['data']; // Store User ALL review Data
            console.log('this.agentData :: check here ======> ', this.agentData);
          } else {
            let msg = res['message'];
            // this.toastr.error(msg, 'Error!', { timeOut: 3000 });
            this.spinner.hide('outer');
            // this.router.navigate(['/']);
            // this.router.navigate(['/trade']);
          }
        }, err => {
          let msg = err['error']['message'];
          this.toastr.error(msg, 'Error!', { timeOut: 3000 });
          this.spinner.hide('outer');
          // this.router.navigate(['/trade']);
        });
        // Get Owner reviews
        this.service.post(`GetUserRolesReview`, {
          user_id: this.agentId,
          user_role: '5a1d295034240d4077dff208'
        }).subscribe(res => {
          console.log('res :: all reviews=> ', res);
          if (res['code'] == 200) {
            this.agentData['OwnerReviews'] = res['data']; // Store User ALL review Data
            console.log('this.agentData :: check here ======> ', this.agentData);
          } else {
            let msg = res['message'];
            this.toastr.error(msg, 'Error!', { timeOut: 3000 });
            this.spinner.hide('outer');
            this.router.navigate(['/trade']);
          }
        }, err => {
          let msg = err['error']['message'];
          this.toastr.error(msg, 'Error!', { timeOut: 3000 });
          this.spinner.hide('outer');
          // this.router.navigate(['/trade']);
        });

      }
    }, err => {
      console.log('err => ', err);
      let msg = err['error']['message'];
      this.toastr.error(msg, 'Error!', { timeOut: 3000 });
      this.spinner.hide('outer');
      // this.router.navigate(['/trade']);
    });
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
        receiver_id: this.agentData._id,
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

  // Use for Show Number
  clickOnShowNumber() {
    this.service.post(`updateRevealContactNumber`, { reveal_contact_number: 1, user_id: this.agentId }).subscribe(res => {
      if (res['code'] = 200) {
        this.showNumber = true;
      }
    });
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
      if (this.agentData['AllReview'].length >= this.endReview && text === 'LOAD MORE REVIEWS') {
        this.endReview = this.endReview + 5; // Append five records
        this.reviewtoggelText = 'LOAD MORE REVIEWS';
        if (this.agentData['AllReview'].length <= this.endReview) { // checked length for change label after appens five records
          this.reviewtoggelText = 'LOAD LESS REVIEWS';
        }
      } else {
        this.endReview = 5;
        this.reviewtoggelText = 'LOAD MORE REVIEWS';
      }
    }
  }

  // Manage review Tab
  manageTab(tab) {
    if (tab === 'All') {
      this.isAll = true;
      this.isTenant = false;
      this.isOwner = false;
    } else if (tab === 'Tenant') {
      this.isAll = false;
      this.isTenant = true;
      this.isOwner = false;
    } else if (tab === 'Owner') {
      this.isAll = false;
      this.isTenant = false;
      this.isOwner = true;
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
