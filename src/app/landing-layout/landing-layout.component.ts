import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-landing-layout',
  templateUrl: './landing-layout.component.html',
  styleUrls: ['./landing-layout.component.css']
})
export class LandingLayoutComponent implements OnInit {

  hostName: any = '';
  host: any = '';
  public currentPage: any;

  constructor(private router: Router, private spinner: NgxSpinnerService, ) {
    // this.currentPage = `/${(this.router.url).split('/')[1]}`;
    // if (this.hostName !== 'www.ownlytrade.com.au' && this.currentPage !== '/#!') {
    //   console.log('if => ');
    //   this.router.navigate(['/trade']);
    // } else {
    //   console.log('else => ');
    //   this.router.navigate(['']);
    // }
  }

  ngOnInit() {

  }

}
