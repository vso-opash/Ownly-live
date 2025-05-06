import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Page Modules
import { LandingLayoutComponent } from './landing-layout.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { PropertiesListComponent } from './properties-list/properties-list.component';
import { PropertyListDetailsComponent } from './property-list-details/property-list-details.component';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { TraderProfileComponent } from './trader-profile/trader-profile.component';

// Third Party Modules
import { LandingLayoutRoutingModule } from './landing-layout-routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SliderModule } from 'primeng/slider';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
//import { AgmCoreModule } from '@agm/core';
import { LightboxModule } from 'primeng/lightbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TabViewModule } from 'primeng/tabview';
import { RatingModule } from 'ng-starrating';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';

import { TooltipModule } from 'primeng/tooltip';
import { LightboxModule as ngxlightbox } from 'ngx-lightbox';

//Services
import { CrudService } from './shared/crud.service';
import { DataShareService } from './shared/data-share.service';
import { EncrDecrService } from './shared/EncrDecrService.service';

//Resolves
import { TraderListResolve } from './resolve/traderListResolve';
import { PropertyListResolve } from './resolve/propertyListResolve';
import { PropertyDetailsResolve } from './resolve/propertyDetailsResolve';
import { TraderProfileResolve } from './resolve/traderProfileResolve';
import { FooterComponent } from './footer/footer.component';
import { ServiceCategoryResolve } from './resolve/serviceCategoryResolve';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TraderLandingComponent } from './trader-landing/trader-landing.component';
import { FeatureComponent } from './feature/feature.component';
import { TemsAndConditionComponent } from './tems-and-condition/tems-and-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { AgentListResolve } from './resolve/agentListResolve';
import { AgentProfileComponent } from './agent-profile/agent-profile.component';
import { AgentProfileResolve } from './resolve/agentProfileResolve';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { AgentLandingComponent } from './agent-landing/agent-landing.component';



@NgModule({
  declarations: [
    LandingLayoutComponent,
    HeaderComponent,
    HomeComponent,
    PropertiesListComponent,
    PropertyListDetailsComponent,
    AccountActivationComponent,
    FooterComponent,
    TraderProfileComponent,
    LoginComponent,
    SearchComponent,
    AboutUsComponent,
    ContactUsComponent,
    TraderLandingComponent,
    FeatureComponent,
    TemsAndConditionComponent,
    PrivacyPolicyComponent,
    AgentListComponent,
    AgentProfileComponent,
    ThankyouComponent,
    AgentLandingComponent
  ],
  imports: [
    CommonModule,
    LandingLayoutRoutingModule,
    HttpClientModule,
    CarouselModule,
    SliderModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    DialogModule,
    ToastModule,
    LightboxModule,
    ngxlightbox,
    CheckboxModule,
    AutoCompleteModule,
    CalendarModule,
    FileUploadModule,
    MessageModule,
    TabViewModule,
    MessagesModule,
    TooltipModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset // <-- tell LazyLoadImage that you want to use IntersectionObserver
    }),
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyB_L4pPNYwWjRXJM_lFvRfKWCNK2L3oNDs',
    //   libraries: ['places']
    // }),
    Ng4GeoautocompleteModule.forRoot(),
    RatingModule,
    NgxPaginationModule,
    BrowserAnimationsModule
  ],
  providers: [
    TraderListResolve,
    AgentListResolve,
    PropertyListResolve,
    PropertyDetailsResolve,
    TraderProfileResolve,
    AgentProfileResolve,
    ServiceCategoryResolve,
    CrudService,
    DataShareService,
    CookieService,
    EncrDecrService
  ]
})
export class LandingLayoutModule { }
