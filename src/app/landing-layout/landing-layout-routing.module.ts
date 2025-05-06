import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingLayoutComponent } from './landing-layout.component';
import { HomeComponent } from './home/home.component';
import { PropertiesListComponent } from './properties-list/properties-list.component';

//Resolves
// import { PropertyListResolve } from './resolve/propertyListResolve';
import { TraderListResolve } from './resolve/traderListResolve';
import { PropertyListResolve } from './resolve/propertyListResolve';
import { TraderProfileResolve } from './resolve/traderProfileResolve';
import { PropertyListDetailsComponent } from './property-list-details/property-list-details.component';
import { PropertyDetailsResolve } from './resolve/propertyDetailsResolve';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { TraderProfileComponent } from './trader-profile/trader-profile.component';
import { ServiceCategoryResolve } from './resolve/serviceCategoryResolve';
import { SearchComponent } from './search/search.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TraderLandingComponent } from './trader-landing/trader-landing.component';
import { FeatureComponent } from './feature/feature.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { AgentListResolve } from './resolve/agentListResolve';
import { AgentProfileComponent } from './agent-profile/agent-profile.component';
import { AgentProfileResolve } from './resolve/agentProfileResolve';

import { ThankyouComponent } from './thankyou/thankyou.component';
import { AgentLandingComponent } from './agent-landing/agent-landing.component';
const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      {
        path: '',
        // component: TraderLandingComponent,
        // data: { title: 'Ownly | Trader' }
        redirectTo: '/trade',
        pathMatch: 'full',
      },
      {
        path: 'about_us',
        component: AboutUsComponent,
        data: { title: 'Ownly | About Us' }
      },
      {
        path: 'contact_us',
        component: ContactUsComponent,
        data: { title: 'Ownly | Contact Us' }
      },
      {
        path: 'privacy_policy',
        component: PrivacyPolicyComponent,
        data: { title: 'Ownly | Privacy Policy' }
      },
      {
        path: 'trader_signup',
        component: TraderLandingComponent,
        pathMatch: 'full',
        data: { title: 'Ownly | Trader' }
      },
      {
        path: 'agent_signup',
        component: AgentLandingComponent,
        pathMatch: 'full',
        data: { title: 'Ownly | Agent' }
      },
      {
        path: 'feature',
        component: FeatureComponent,
        pathMatch: 'full',
        data: { title: 'Ownly | Feature' }
      },
      {
        path: 'thank-you',
        component: ThankyouComponent,
        pathMatch: 'full',
        data: { title: 'Ownly | thank-you' }
      },
      // {
      //   path: 'buy', component: HomeComponent,
      //   resolve: {
      //     'tradersList': TraderListResolve,
      //     'serviceCategoryList': ServiceCategoryResolve
      //   },
      //   data: { title: 'Ownly | Buy' }
      // },
      // {
      //   path: 'rent', component: HomeComponent,
      //   resolve: {
      //     'tradersList': TraderListResolve,
      //     'serviceCategoryList': ServiceCategoryResolve
      //   },
      //   data: { title: 'Ownly | Rent' }
      // },
      {
        path: 'trade', component: HomeComponent,
        // resolve: {
        //   'tradersList': TraderListResolve,
        //   'serviceCategoryList': ServiceCategoryResolve
        // },
        data: { title: 'Ownly | TradeHub' }
      },
      {
        path: 'agent', component: HomeComponent,
        resolve: {
          tradersList: TraderListResolve,
          serviceCategoryList: ServiceCategoryResolve
        },
        data: { title: 'Ownly | Agent' }
      },
      {
        path: 'find',
        component: SearchComponent,
        children: [
          {
            path: ':category/:state/:suburb',
            component: HomeComponent,
            pathMatch: 'full',
            resolve: {
              tradersList: TraderListResolve,
              serviceCategoryList: ServiceCategoryResolve
            },
            data: { title: 'Ownly | TradeHub' }
          },
          {
            path: ':category/:state',
            component: HomeComponent,
            pathMatch: 'full',
            resolve: {
              tradersList: TraderListResolve,
              serviceCategoryList: ServiceCategoryResolve
            },
            data: { title: 'Ownly | TradeHub' }
          },
          {
            path: ':category',
            component: HomeComponent,
            pathMatch: 'full',
            resolve: {
              tradersList: TraderListResolve,
              serviceCategoryList: ServiceCategoryResolve
            },
            data: { title: 'Ownly | TradeHub' }
          }
        ]
      },
      // {
      //   path: 'property_list', component: PropertiesListComponent,
      //   resolve: {
      //     'propertyList': PropertyListResolve
      //   },
      //   data: { title: 'Ownly | Property List' }
      // },
      {
        path: 'agent_list', component: AgentListComponent,
        resolve: {
          agentList: AgentListResolve
        },
        data: { title: 'Ownly | Agent List' }
      },
      {
        path: 'agent_profile/:agent_id', component: AgentProfileComponent,
        // resolve: {
        //   agentData: AgentProfileResolve,
        // },
        data: { title: 'Ownly | Agent Profile' }
      },
      {
        path: 'search',
        component: SearchComponent,
        children: [
          {
            path: ':type/:category/:suburb',
            component: HomeComponent,
            resolve: {
              tradersList: TraderListResolve,
              serviceCategoryList: ServiceCategoryResolve
            },
            data: { title: 'Ownly | Rent' }
          }
        ]
      },
      {
        path: 'trader/:trader_id', component: TraderProfileComponent,
        resolve: {
          traderData: TraderProfileResolve,
        },
        data: { title: 'Ownly | Trader Profile' }
      },
      // {
      //   path: 'property/:id', component: PropertyListDetailsComponent,
      //   resolve: {
      //     'propertyDetail': PropertyDetailsResolve,
      //     'similarProperties': PropertyListResolve
      //   },
      //   data: { title: 'Ownly | Property Details' }
      // },
      {
        path: 'trader_account_activation/:token/:mrid', component: AccountActivationComponent,
        data: { title: 'Ownly | Trader Account Activation' }
      },
      {
        path: 'consumer_account_activation/:token/:mrid', component: AccountActivationComponent,
        data: { title: 'Ownly | Consumer Account Activation' }
      },
      {
        path: 'trader_account_activation/:token', component: AccountActivationComponent,
        data: { title: 'Ownly | Trader Account Activation' }
      },
      // {
      //   path: ':type',
      //   component: HomeComponent,
      //   resolve: {
      //     tradersList: TraderListResolve,
      //     serviceCategoryList: ServiceCategoryResolve
      //   },
      //   data: { title: 'Ownly | TradeHub' }
      // },
      {
        path: '**',
        redirectTo: '/trade'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    TraderListResolve
  ]
})
export class LandingLayoutRoutingModule { }
