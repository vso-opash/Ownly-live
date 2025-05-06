import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CrudService } from '../shared/crud.service';
import { DataShareService } from '../shared/data-share.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EncrDecrService } from '../shared/EncrDecrService.service';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

const key = 'syncitt-2.0-public';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Login form
  loginForm: FormGroup;
  fpForm: FormGroup; // forgot password
  isSubmitted: boolean;
  isForgotPassword: boolean;
  disableSubmitBtn = false;
  loginData: any = {};
  public clickLogin = false;
  defaultRole: any = { description: 'Owner' };
  roles: any = [];

  constructor(
    private datashare: DataShareService,
    private EncrDecr: EncrDecrService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private service: CrudService,
    private authService: AuthService) {
    this.service.invokeLoginComponentFunction.subscribe(() => {
      this.clickOnLogin(true);
    });

    // Login Form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}')]],
      password: ['', [Validators.required]],
      remember_me: ['no']
    });
  }

  ngOnInit() {
    if (this.cookieService.get('syncitt2.0_remember_me')) {
      let loginUser = JSON.parse(this.cookieService.get('syncitt2.0_remember_me'));
      this.loginData.remember_me = true;
      this.loginData.email = loginUser.email;
      this.loginData.password = loginUser.password;
    }
    this.getUserRoles();
  }

  getUserRoles = () => {
    this.service.get('roles').subscribe((res: any) => {
      this.roles = res.data;
      this.defaultRole = this.roles.find(role => role.description === this.defaultRole.description);
    });
  }

  // Click on Login up form
  clickOnLogin(flag) {
    this.isForgotPassword = false;
    this.clickLogin = true;
  }

  /**
  * For login
  * @param flag boolean value
  * @returns returns a expires date
  */
  login(flag: boolean) {
    this.isSubmitted = !flag;
    if (flag) {
      let email = this.loginData.email;
      this.disableSubmitBtn = true;
      const u_data = this.loginData;
      if (this.loginData['remember_me']) {
        this.cookieService.set('syncitt2.0_remember_me', JSON.stringify(u_data));
      } else {
        this.cookieService.delete('syncitt2.0_remember_me');
        if (this.cookieService.get('syncitt2.0_remember_me')) {
          this.cookieService.delete('syncitt2.0_remember_me');
        }
      }
      this.service.post('userLogin', {
        email: u_data.email,
        password: u_data.password
      }).subscribe(
        response => {
          console.log('response[`code`]  => ', response['code']);
          this.loginData['email'] = '';
          this.loginData['password'] = '';
          let message = '';
          if (response) {
            if (response['code'] == 200) {
              if (!response['data']) {
                let message = 'Unauthorised Access!';
                this.toastr.error(message, 'Error!', { timeOut: 3000 });
                this.disableSubmitBtn = false;
              } else {
                this.clickLogin = false;
                this.loginData = {
                  data: response['data']['userInfo'],
                  token: response[`token`],
                  role: response['data']['roleInfo']
                };
                // Key : syncitt-2.0-public
                localStorage.setItem('user', this.EncrDecr.setEncrypt(this.loginData));
                this.datashare.getLoginUser(JSON.stringify(this.loginData));
                this.toastr.success('Login Successfully!', 'Success!', {
                  timeOut: 3000
                });
                // this.router.navigate(["/"]);
              }
            } else if (response['code'] == '406') {
              console.log('406 => ');
              this.toastr.warning(
                'Congrats! Your email is already registered with us.' +
                ' To complete registration simply Click Here to receive activation email.',
                'Warning!', {
                timeOut: 12000,
                progressBar: true,
              }).onTap
                .subscribe(() => this.toasterClickedHandler(email));

            } else {
              // message = "Something went wrong, Please try again later!";
              this.toastr.error(response['message'], 'Error!', { timeOut: 3000 });
            }
          } else {
            message = 'Something went wrong, Please try again later!';
            this.toastr.error(message, 'Error!', { timeOut: 3000 });
          }
        },
        err => {
          console.log('err => ', err);
          if (err.status == 500) {
            let message = 'Something went wrong, Please try again later!';
            if (err.error.message) {
              message = err.error.description;
            }
            this.toastr.error(message, 'Error!', { timeOut: 3000 });
            this.disableSubmitBtn = false;
          } else if (err.status == 401 || err.status == 400) {
            let message = 'Something went wrong, Please try again later!';
            if (err.error.message) {
              message = err.error.description;
            }
            if (err.status == 400) {
              message = err.error.message;
            }
            this.toastr.error(message, 'Error!', { timeOut: 3000 });
            this.disableSubmitBtn = false;
          } else {
            this.toastr.error('Something went wrong, Please try again later!', 'Error!', { timeOut: 3000 });
            this.disableSubmitBtn = false;
          }
        },
        () => {
          this.disableSubmitBtn = false;
        }
      );
    }
  }

  toasterClickedHandler(value) {
    console.log('Toastr clicked');
    console.log('this.loginData[email] ==>', this.loginData['email']);
    this.service.post('resend_account_activation_mail', {
      email: value
    }).subscribe(res => {
      console.log('res => ', res);
      this.toastr.success(res['message'], 'Success!', {
        timeOut: 3000
      });
    }, err => {
      console.log('err => ', err);
      this.toastr.error(err['message'], 'Error!', { timeOut: 3000 });
    });
  }

  // Social Login
  socialLogin(socialProvider) {
    console.log('socialProvider => ', socialProvider);
    let socialPlatformProvider;
    if (socialProvider === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    if (socialPlatformProvider) {
      this.authService.signIn(socialPlatformProvider).then(
        (data) => {
          console.log('data => ', data);
          const userInfo = {
            social_provider: data.provider,
            photoUrl: data.photoUrl,
            firstname: data.firstName,
            lastname: data.lastName,
            email: data.email,
            social_token: data.authToken,
            social_id: data.id,
            role_id: this.defaultRole._id,
            name: data.name
          };
          this.service.post('socialLogin', userInfo).subscribe(response => {
            console.log('res :: socialLogin api response => ', response);
            let message = '';
            if (response) {
              if (response['code'] === 200) {
                if (!response['data']) {
                  message = 'Unauthorised Access!';
                  this.toastr.error(message, 'Error!', { timeOut: 3000 });
                  this.disableSubmitBtn = false;
                } else {
                  this.clickLogin = false;
                  this.loginData = {
                    data: response['data']['data'],
                    token: response[`token`],
                  };
                  localStorage.setItem('user', this.EncrDecr.setEncrypt(this.loginData));
                  this.datashare.getLoginUser(JSON.stringify(this.loginData));
                  this.toastr.success('Login Successfully!', 'Success!', {
                    timeOut: 3000
                  });
                }
              } else {
                // message = "Something went wrong, Please try again later!";
                this.toastr.error(response['message'], 'Error!', { timeOut: 3000 });
              }
            } else {
              message = 'Something went wrong, Please try again later!';
              this.toastr.error(message, 'Error!', { timeOut: 3000 });
            }

          }, err => {
            console.log('err => ', err);
          });
        });
    }
  }

  signup() {
    this.clickLogin = false;
    this.service.onSignupClick();
  }

  forgotPassword() {
    this.clickLogin = false;
    this.fpForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[0-9a-z._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}')]],
    });
    this.fpForm.updateValueAndValidity();
    this.isForgotPassword = true;
  }

  forgotPasswordSubmit(isValid) {
    this.isSubmitted = !isValid;
    if (isValid) {
      this.disableSubmitBtn = true;
      this.service.post('forgotPassword', this.fpForm.value).subscribe((res: any) => {
        if (res.code === 200) {
          this.toastr.success(res.message, 'Success!', {
            timeOut: 3000
          });
          this.isForgotPassword = false;
          this.disableSubmitBtn = false;
        } else {
          this.toastr.error(res.message, 'Error!', { timeOut: 3000 });
          this.disableSubmitBtn = false;
        }
      }, err => {
        this.toastr.error(err.error.message, 'Error!', { timeOut: 3000 });
        this.disableSubmitBtn = false;
      });
    }
  }
}
