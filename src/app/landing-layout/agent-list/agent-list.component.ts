import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataShareService } from '../shared/data-share.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from '../shared/crud.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css']
})
export class AgentListComponent implements OnInit {

  public agentsList = [];
  public imageUrl = environment.imageUrl;
  // sum = 2;
  sum = 6;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 1;
  direction = '';
  lazyLoadArray = [];
  lat: number;
  lng: number;
  markers: Marker[] = [
    {
      lat: -33.8688197,
      lng: 151.2092955,
      label: 'Agent 1'
    },
    {
      lat: -33.8466668,
      lng: 151.072701,
      label: 'Agent 2'
    },
    {
      lat: -33.8465088,
      lng: 151.0722137,
      label: 'Agent 3'
    },
    {
      lat: -33.8692736,
      lng: 151.2043244,
      label: 'Agent 4'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CrudService,
    private dataShare: DataShareService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private titleService: Title
  ) {
    this.titleService.setTitle(this.route.snapshot.data['title']);
    window.scrollTo(0, 0);
    this.spinner.show('outer');
    // console.log('localStorage.getItem(`recentSearches`) => ', JSON.parse(localStorage.getItem('recentSearches')));
    const recentSearch = JSON.parse(localStorage.getItem('recentSearches'));
    // console.log('recentSearch[0]geometry 1=> ', recentSearch[0].geometry.location.lat);
    // console.log('recentSearch[0]geometry 2=> ', recentSearch[0].geometry.location.lng);
    // this.lat = recentSearch[0].geometry.location.lat;
    // this.lng = recentSearch[0].geometry.location.lng;


    // const agentRes = this.route.snapshot.data['agentList'];
    // if (agentRes.total_count > 0) {
    //   this.agentsList = this.route.snapshot.data['agentList']['data'];
    //   this.appendItems(0, this.sum);
    //   this.spinner.hide('outer');
    // } else {
    //   this.router.navigate(['trade']);
    //   this.toastr.error('No Record Found!');
    // }

  }

  ngOnInit() {
    this.dataShare.currentAgentsearchObj.subscribe(async agentSearchObj => {
      console.log('agentSearchObj => ', agentSearchObj);
      if (agentSearchObj) {
        this.agentsList = [];
        this.lazyLoadArray = [];
        console.log('if :: oninit => ');
        await this.service.post('agentsListWithSearch', agentSearchObj).subscribe(res => {
          console.log('res => ', res);
          if (res['total_count'] > 0) {
            this.agentsList = res['data'];
            this.appendItems(0, this.sum);
            // this.spinner.hide('outer');
            const recentSearch = JSON.parse(localStorage.getItem('recentSearches'));
            this.lat = recentSearch[0].geometry.location.lat;
            this.lng = recentSearch[0].geometry.location.lng;
          } else {
            this.spinner.hide('outer');
            this.router.navigate(['trade']);
            this.toastr.error('No Record Found!');
          }
        });
      } else {
        console.log('else :: oninit => ');
        const agentRes = this.route.snapshot.data['agentList'];
        if (agentRes.total_count > 0) {
          this.agentsList = this.route.snapshot.data['agentList']['data'];
          const recentSearch = JSON.parse(localStorage.getItem('recentSearches'));
          this.lat = recentSearch[0].geometry.location.lat;
          this.lng = recentSearch[0].geometry.location.lng;
          this.appendItems(0, this.sum);
          // this.spinner.hide('outer');
        } else {
          this.spinner.hide('outer');
          this.router.navigate(['trade']);
          this.toastr.error('No Record Found!');
        }
      }
    });
  }

  appendItems(startIndex, endIndex) {
    console.log('appendItems function => ');
    this.addItems(startIndex, endIndex, 'push');
    this.spinner.hide('outer');
  }

  addItems(startIndex, endIndex, _method) {
    for (let i = startIndex; i < endIndex; ++i) {
      if (this.lazyLoadArray.length < this.agentsList.length) {
        this.lazyLoadArray[_method](this.agentsList[i]);
      }
      // console.log('this.lazyLoadArray => ', this.lazyLoadArray);
    }
  }

  onScrollDown() {
    console.log('scroll down => ');
    // add another 6 items
    const start = this.sum;
    // this.sum += 2;
    this.sum += 6;
    this.appendItems(start, this.sum);
    this.direction = 'down';
  }

}

// Map type Interface
interface Marker {
  lat: number;
  lng: number;
  label?: string;
}
