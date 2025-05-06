import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from '../shared/crud.service';
import { DataShareService } from '../shared/data-share.service';
import { Title } from '@angular/platform-browser';
import _ from 'underscore';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.css']
})
export class AccountActivationComponent implements OnInit {
  data: any = {};
  token: any;
  mrId: any;
  setpassword_form: FormGroup;
  setpassword_form_validation: boolean = false;
  show_spinner: boolean = false;
  param: any = {};
  currentPage: any;
  public tradersList = [];
  public dashboardURL = environment.portalURL

  constructor(
    private dataShare: DataShareService,
    private route: ActivatedRoute,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private titleService: Title,
    private toastr: ToastrService, private service: CrudService) {
    console.log('account activation component => ');
    this.titleService.setTitle(this.route.snapshot.data['title']);
    this.token = this.activeRoute.snapshot.params.token;
    this.mrId = this.activeRoute.snapshot.params.mrid;
    this.get_consumer_info(this.token);
    this.setpassword_form = this.fb.group({
      password: ['', [Validators.required,
      // Validators.pattern('^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#$%^&+=])[a-zA-Z0-9@#!$%^&+=]*$')
      Validators.pattern('(?=.*[a-z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{8,}')
      ]],
      conf: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('conf').value ? null : g.get('conf').setErrors({ 'mismatch': true });
  }

  ngOnInit() {
    this.route.url.subscribe((url: any) => {
      const currentPage = url[0].path;
      console.log('currentPage for trader => ', currentPage);
      if (currentPage.indexOf('trader_account_activation') >= 0 || currentPage.indexOf('consumer_account_activation') >= 0) {
        this.currentPage = currentPage;
      } else {
        this.router.navigate(['/']);
      }
    }, err => {
      this.router.navigate(['/']);
    });
    // this.dataShare.currentPage.subscribe(page => {

    //   const currentPage = this.router.url;
    //   console.log('currentPage => ', currentPage);
    //   // For set same header of home
    //   // if ((page.length > 1)) {
    //   if (currentPage.indexOf('/trader_account_activation') >= 0 || currentPage.indexOf('/consumer_account_activation') >= 0) {
    //     this.currentPage = currentPage;
    //   } else {
    //     // this.router.navigate(['/']);
    //   }
    //   // } else {
    //   //   this.router.navigate(['/']);
    //   // }
    // });
    this.service.post('tradersList', {}).subscribe(async (res: any) => {
      console.log('res: tradersList => ', res);
      let tData = res.data;
      tData = this.sorting(tData, 1);
      this.tradersList = tData.slice(0, 4);
    });
  }

  // Use for sorting order where 1 = Descending else Ascending
  sorting(data: any, order) {
    let t_data = _(data).chain().sortBy(function (t) {
      return t.totalReviewLength;
    }).sortBy(function (t) {
      return t.averageRate;
    }).value();
    if (order === 1) {
      t_data = t_data.reverse();
    }
    return t_data;
  }

  open(path) {
    document.getElementById('id01').setAttribute('style', 'display : block');
    document.getElementById('id01').removeAttribute('hidden');
    document.getElementById('vid').setAttribute('src', path);
  }

  close() {
    document.getElementById('id01').setAttribute('hidden', 'true');
    document.getElementById('id01').removeAttribute('style');
    document.getElementById('vid').setAttribute('src', '');
  }

  // Get information of consumer for set email
  get_consumer_info(token) {
    if (token) {
      let activation_data = {
        activation_code: token
      };
      this.service.post(`validate_account_activation_code`, activation_data).subscribe((res) => {
        if (res['data']) {
          this.data = res['data'];
          this.data['password'] = '';
        } else {
          this.toastr.error('Activation link is expired!', 'Error!', { timeOut: 3000 });
          // this.router.navigate(['trade']);
          this.router.navigate(['trader_signup']);
        }
      }, (err) => {
        let msg = err['error']['message'];
        this.toastr.error(msg, 'Error!', { timeOut: 3000 });
        this.router.navigate(['trade']);
      })
    }
  }

  // Set password
  set_password(flag: boolean, roleId) {
    if (flag) {
      this.show_spinner = true;
      let data = {
        password: this.data.password,
        activation_code: this.token,
        role_id: roleId
      };
      this.service.post(`activate_account`, data).subscribe((response) => {
        if (response['code'] == 200) {
          this.toastr.success('Account Activated Successfully!', 'Success!', { timeOut: 3000 });
          // this.router.navigate(['/']);
          setTimeout(() => {
            window.location.href = this.dashboardURL + '#!/login';
            // window.location.href = this.dashboardURL + '#!/setting';
            // window.location.href = `http://portal.syncitt.world/#!/activeUserAccount/${this.data._id}/${this.mrId}`;
          }, 3000);
        } else {
          this.toastr.error(response['message'], 'Error!', { timeOut: 3000 });
        }
      }, (error) => {
        if (error['error'].message) {
          this.toastr.error(error['error'].message, 'Error!', { timeOut: 3000 });
        }
        this.show_spinner = false;
      }, () => {
        this.show_spinner = false;
      });
    }
    this.setpassword_form_validation = !flag;
  }
}
