import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { CrudService } from "../shared/crud.service";
import _ from "underscore";
import { environment } from "../../../environments/environment";
import { DataShareService } from "../shared/data-share.service";
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
} from "angularx-social-login";
import { EncrDecrService } from "../shared/EncrDecrService.service";
@Component({
  selector: "app-trader-landing",
  templateUrl: "./trader-landing.component.html",
  styleUrls: ["./trader-landing.component.css"],
})
export class TraderLandingComponent implements OnInit {
  data: any = {};
  form: FormGroup;
  form_validation = false;
  show_spinner = false;
  public tradersList = [];
  public imageUrl = environment.imageUrl;
  hostName: any = "";
  public dashboardURL = environment.portalURL;

  constructor(
    private router: Router,
    private service: CrudService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private titleService: Title,
    private toastr: ToastrService,
    private EncrDecr: EncrDecrService,
    private datashare: DataShareService,
    private authService: AuthService
  ) {
    this.titleService.setTitle(this.route.snapshot.data["title"]);
    this.form = this.fb.group(
      {
        firstname: ["", [Validators.required]],
        lastname: ["", [Validators.required]],
        email: [
          "",
          [
            Validators.required,
            Validators.pattern(
              "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
            ),
          ],
        ],
        password: [
          "",
          [
            Validators.required,
            // Validators.pattern('^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#$%^&+=])[a-zA-Z0-9@#!$%^&+=]*$')
            Validators.pattern("(?=.*[a-z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{8,}"),
          ],
        ],
        confirm_pass: ["", [Validators.required]],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("password").value === g.get("confirm_pass").value
      ? null
      : g.get("confirm_pass").setErrors({ mismatch: true });
  }

  open(path) {
    document.getElementById("id01").setAttribute("style", "display : block");
    document.getElementById("id01").removeAttribute("hidden");
    document.getElementById("vid").setAttribute("src", path);
    let ele = document.getElementById('id01')
    ele.style.display = "block"
  }

  close() {
    document.getElementById("id01").setAttribute("hidden", "true");
    document.getElementById("id01").removeAttribute("style");
    document.getElementById("vid").setAttribute("src", "");
    let myVideo = document.querySelector('video');
    myVideo.pause();
    let ele = document.getElementById('id01')
    ele.style.display = "none"
  }

  ngOnInit() {
    this.service.get("tradersListPublic").subscribe(
      (res) => {
        // this.service.post('tradersList', {}).subscribe(async (res: any) => {
        console.log("res: tradersList => ", res);
        // let tData = res.data;
        // tData = this.sorting(tData, 1);
        // this.tradersList = tData.slice(0, 4);
        if (res && res["data"]) {
          this.tradersList = res["data"].slice(0, 4);
        } else {
          this.tradersList = [];
        }
      },
      (err) => {
        console.log("err => ", err);
        this.tradersList = [];
      }
    );
  }

  // Use for sorting order where 1 = Descending else Ascending
  sorting(data: any, order) {
    let t_data = _(data)
      .chain()
      .sortBy(function (t) {
        return t.totalReviewLength;
      })
      .sortBy(function (t) {
        return t.averageRate;
      })
      .value();
    if (order === 1) {
      t_data = t_data.reverse();
    }
    return t_data;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  onSubmit(flag: boolean) {
    this.form_validation = !flag;
    if (flag) {
      this.show_spinner = true;
      let email = this.data.email;
      this.service
        .post("userRegister", {
          email: this.data.email,
          password: this.data.password,
          firstname: this.data.firstname,
          lastname: this.data.lastname,
          role_id: "5a1d26b26ef60c3d44e9b377",
        })
        .subscribe(
          (response) => {
            this.data = {};
            console.log("response ========> ", response);
            if (response) {
              if (response["code"] === 200) {
                if (!response["data"]) {
                  var message = "Unauthorised Access!";
                  this.show_spinner = false;
                  this.toastr.error(message, "Error!", { timeOut: 3000 });
                } else {
                  console.log("response[`message`] => ", response[`message`]);
                  this.show_spinner = false;
                  this.toastr.success(response["message"], "Success!", {
                    timeOut: 3000,
                  });
                  this.router.navigate(['/thank-you']);
                  // setTimeout(() => {
                  //   window.location.href = this.dashboardURL + '#!/dashboard';
                  // }, 3000);
                  // window.location.href = 'http://portal.syncitt.world/#!/dashboard';
                  // window.location.href = 'https://portal.ownly.com.au/#!/dashboard';
                }
              } else if (response["code"] == "406") {
                console.log("406 => ");
                this.toastr
                  .warning(
                    "Congrats! Your email is already registered with us." +
                    " To complete registration simply Click Here to receive activation email.",
                    "Warning!",
                    {
                      timeOut: 12000,
                      progressBar: true,
                    }
                  )
                  .onTap.subscribe(() => this.toasterClickedHandler(email));
              } else {
                this.show_spinner = false;
                this.toastr.error(response["message"], "Error!", {
                  timeOut: 3000,
                });
              }
            } else {
              message = "Something went wrong, Please try again later!";
              this.show_spinner = false;
              this.toastr.error(message, "Error!", { timeOut: 3000 });
            }
          },
          (err) => {
            this.data = {};
            if (err.status === 500) {
              var message = "Something went wrong, Please try again later!";
              if (err.error.message) {
                message = err.error.description;
              }
              this.show_spinner = false;
              this.toastr.error(message, "Error!", { timeOut: 3000 });
            } else if (err.status === 401 || err.status === 400) {
              var message = "Something went wrong, Please try again later!";
              if (err.error.message) {
                message = err.error.description;
              }
              if (err.status === 400) {
                message = err.error.message;
              }
              this.show_spinner = false;
              this.toastr.error(message, "Error!", { timeOut: 3000 });
            } else {
              this.show_spinner = false;
              this.toastr.error(
                "Something went wrong, Please try again later!",
                "Error!",
                { timeOut: 3000 }
              );
            }
          }
        );
    }
  }

  toasterClickedHandler(value) {
    console.log("Toastr clicked");
    console.log("this.loginData[email] ==>", this.data["email"]);
    this.service
      .post("resend_account_activation_mail", {
        email: value,
      })
      .subscribe(
        (res) => {
          console.log("res => ", res);
          this.toastr.success(res["message"], "Success!", {
            timeOut: 3000,
          });
        },
        (err) => {
          console.log("err => ", err);
          this.toastr.error(err["message"], "Error!", { timeOut: 3000 });
        }
      );
  }

  // Social Login
  socialLogin(socialProvider) {
    console.log("socialProvider => ", socialProvider);
    let socialPlatformProvider;
    if (socialProvider === "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    if (socialPlatformProvider) {
      this.authService.signIn(socialPlatformProvider).then((data) => {
        console.log("data => ", data);
        const userInfo = {
          social_provider: data.provider,
          photoUrl: data.photoUrl,
          firstname: data.firstName,
          lastname: data.lastName,
          email: data.email,
          social_token: data.authToken,
          social_id: data.id,
          role_id: "5a1d26b26ef60c3d44e9b377",
          name: data.name,
        };
        this.service.post("socialLogin", userInfo).subscribe(
          (response) => {
            console.log("res :: socialLogin api response => ", response);
            let message = "";
            if (response) {
              if (response["code"] === 200) {
                if (!response["data"]) {
                  message = "Unauthorised Access!";
                  this.toastr.error(message, "Error!", { timeOut: 3000 });
                } else {
                  let loginData = {
                    data: response["data"]["data"],
                    token: response['data'][`token`],
                  };
                  this.router.navigate(["/thank-you"]);
                  // this.router.navigate(["/trade"]);
                  localStorage.setItem(
                    "user",
                    this.EncrDecr.setEncrypt(loginData)
                  );
                  this.datashare.getLoginUser(JSON.stringify(loginData));
                  this.toastr.success("Login Successfully!", "Success!", {
                    timeOut: 3000,
                  });
                  this.router.navigate(["/thank-you"]);
                }
              } else {
                // message = "Something went wrong, Please try again later!";
                this.toastr.error(response["message"], "Error!", {
                  timeOut: 3000,
                });
              }
            } else {
              message = "Something went wrong, Please try again later!";
              this.toastr.error(message, "Error!", { timeOut: 3000 });
            }
          },
          (err) => {
            console.log("err => ", err);
          }
        );
      });
    }
  }
}
