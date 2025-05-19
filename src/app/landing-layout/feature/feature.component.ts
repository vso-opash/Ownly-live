import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit {

  public dashboardURL = environment.portalURL;
  public portalLoginURL = environment.portalURL + '#!/login';
  public portalSignUpURL = environment.portalURL + '#!/signup';

  constructor(
    private route: ActivatedRoute,
    private titleService: Title
  ) { this.titleService.setTitle(this.route.snapshot.data['title']); }

  ngOnInit() {
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  portalSignUp() {
    window.open(this.portalSignUpURL, '_blank');
  }
}
