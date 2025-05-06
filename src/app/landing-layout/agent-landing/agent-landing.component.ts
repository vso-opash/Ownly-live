import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../shared/crud.service';
import _ from 'underscore';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agent-landing',
  templateUrl: './agent-landing.component.html',
  styleUrls: ['./agent-landing.component.css']
})
export class AgentLandingComponent implements OnInit {

  public agentsList = [];
  form_validation = false;
  show_spinner = false;
  form: FormGroup;
  data: any = {};
  public imageUrl = environment.imageUrl;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private fb: FormBuilder,
    private service: CrudService,
    private toastr: ToastrService,
  ) {
    this.titleService.setTitle(this.route.snapshot.data["title"]);
    this.form = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}')]],
      mobile_no: ['', [Validators.required]],
      agency_name: ['', [Validators.required]],
      comment: [''],
    });
  }

  ngOnInit() {
    this.getAgentsList();
  }

  getAgentsList() {
    this.service.get('agentsList').subscribe(res => {
      let agentData = res['data'];
      agentData = this.sorting(agentData, 1);
      this.agentsList = agentData.slice(0, 3);
    }, err => {
      console.log('err => ', err);
      this.agentsList = [];
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

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  open(path) {
    document.getElementById("id03").setAttribute("style", "display : block");
    document.getElementById("id03").removeAttribute("hidden");
    document.getElementById("vid3").setAttribute("src", path);
    let ele = document.getElementById('id03')
    ele.style.display = "block"
  }

  close() {
    document.getElementById("id03").setAttribute("hidden", "true");
    document.getElementById("id03").removeAttribute("style");
    document.getElementById("vid3").setAttribute("src", "");
    let myVideo = document.querySelector('video');
    myVideo.pause();
    let ele = document.getElementById('id03')
    ele.style.display = "none"
  }

  onSubmit(flag: boolean) {
    this.form_validation = !flag;
    const obj = {
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      email: this.form.value.email,
      mobile_no: this.form.value.mobile_no,
      agency_name: this.form.value.agency_name,
      comment: this.form.value.comment ? this.form.value.comment : ''
    };

    if (flag) {
      this.show_spinner = true;
      this.service.post('contact_us', obj).subscribe(
        (response) => {
          console.log('response ==>', response);
          if (response['code'] === 200) {
            this.show_spinner = false;
            this.toastr.success(response['message'], 'Success!', { timeOut: 3000 });
            this.data = {}
          } else if (response['code'] === 400) {
            this.show_spinner = false;
            this.toastr.error(response['message'], 'Success!', { timeOut: 3000 });
          }
        }, (err) => {
          console.log('err ==>', err);
          this.show_spinner = false;
          this.toastr.error(err['message'], 'Success!', { timeOut: 3000 });
        });
    }
  }

}
