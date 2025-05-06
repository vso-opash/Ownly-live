import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
  ) {
    this.titleService.setTitle(this.route.snapshot.data['title']);
  }

  ngOnInit() {
    console.log('about Us => ');
  }

}
