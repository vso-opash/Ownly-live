import { Component, OnInit } from '@angular/core';
import { CrudService } from '../shared/crud.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  form: FormGroup;
  form_validation = false;
  show_spinner = false;
  data: any = {};
  public roleArray = [
    { label: 'Tradie', value: 'Tradie' },
    { label: 'Consumer(Property Owner/Tenant)', value: 'Consumer(Property Owner/Tenant)' },
  ];
  // public roleArray = [
  //   { label: 'Tradie', value: '5a1d26b26ef60c3d44e9b377' },
  //   { label: 'Consumer(Property Owner/Tenant)', value: '5a1d295034240d4077dff208' },
  // ];
  // public selectedRole = '5a1d26b26ef60c3d44e9b377';
  public selectedRole = 'Tradie';

  constructor(
    private service: CrudService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private titleService: Title,
    private toastr: ToastrService,
  ) {
    this.titleService.setTitle(this.route.snapshot.data['title']);
    this.form = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}')]],
      mobile_no: ['', [Validators.required]],
      role: ['', [Validators.required]],
      comment: [''],
    });
  }

  ngOnInit() {
  }

  onSubmit(flag: boolean) {
    this.form_validation = !flag;
    let obj = {
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      email: this.form.value.email,
      mobile_no: this.form.value.mobile_no,
      role: this.form.value.role,
      comment: this.form.value.comment ? this.form.value.comment : ''
    }

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
