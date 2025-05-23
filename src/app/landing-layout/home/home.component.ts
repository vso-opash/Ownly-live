import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd, NavigationStart } from '@angular/router';
import { DataShareService } from '../shared/data-share.service';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudService } from '../shared/crud.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import _ from 'underscore';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { EncrDecrService } from '../shared/EncrDecrService.service';
import { OwlOptions } from "ngx-owl-carousel-o";
import _replace from 'lodash/replace'
import _upperCase from 'lodash/upperCase'

const key = 'syncitt-2.0-public';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  // for page content
  public heading = `Australia's Ownly Search Platform`;
  public current_url = '/trade';
  public tradersList = [];
  public premiumTradersList = [];
  public tradersListData = [];
  public agentsList = [];
  public imageUrl = environment.imageUrl;
  public traderImageURL = environment.imageUrl + 'user_image';
  public selectedSuburbPostcode = '';
  public displayBlock = 'home';
  public selectedCategory = '';
  public tradePageHeading = '';
  inLocationName = 'Australia';
  public selectedCategoryId = '';
  public currentDate = new Date();
  public currentPage = '/trade';
  // public currentPage = '/buy';

  // for google autocomplete search object
  public search_obj = {
    pageSize: 10,
    page: 1,
    listingType: 'sale',
    type: 'PropertyListing'
  };
  public agentFilter = {};
  public options = {
    types: [],
    componentRestrictions: { country: 'au' }
  };
  public userSettings = {};
  public userSettings_traderHub = {};
  public userSettings1 = {};

  // for searvice request page searches
  public selectedProjects: string;
  public serviceRequestProject = {
    id: 'sr',
    title: 'Service Request',
    subprojects: []
  };
  public serviceCategoryProject = {
    id: 'sc',
    title: 'Service Category',
    subprojects: []
  };
  public businessProject = {
    id: 'b',
    title: 'Business Name',
    subprojects: []
  };
  public projects = [];
  public trade_address = {};

  // for service request form
  public form: FormGroup;
  public formData: any = {};
  public req_isFormSubmited;
  public req_selected_dueDate: Date;
  public req_address = {};
  public req_fileLimit = 3;
  public req_selected_files = [];
  public msgs = [];
  public req_imgForm: File[] = [];
  public serviceCategories = [];
  public loginUserData: any;

  public TraderID_for_send_request: any;

  // category page
  p: number = 1; // use with pagination

  // carousel settings
  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    autoplay: false,
    navSpeed: 700,
    navText: ["&#8249;", "&#8250;"],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  };

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dataShare: DataShareService,
    private spinner: NgxSpinnerService,
    private all: CrudService,
    private toastr: ToastrService,
    private titleService: Title,
    private EncrDecr: EncrDecrService,
  ) {
    console.log('this.router.url', this.router.url);
    this.current_url = this.router.url;
    console.log('current_url => ', this.current_url);
    console.log('home component => ');
    this.titleService.setTitle(this.route.snapshot.data['title']);
    // this.spinner.show('outer');
    this.getTradersList();
    this.getPremiumTraders();
    // let tData = this.route.snapshot.data['tradersList']['data'];
    // tData = this.sorting(tData, 1);
    // this.tradersList = tData.slice(0, 4);
    this.getAgentList();
    this.formData = {};

    // req form group
    this.req_isFormSubmited = false;
    const pattern = new RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,5})$');
    this.form = this.fb.group({
      category_id: new FormControl(''),
      budget: new FormControl('', Validators.pattern('[0-9]{2,9}')),
      due_date: new FormControl(''),
      request_overview: new FormControl('', Validators.compose([Validators.required, this.noWhitespaceValidator])),
      request_detail: new FormControl('', Validators.compose([Validators.required, this.noWhitespaceValidator])),
      firstname: new FormControl('', Validators.compose([Validators.required, this.noWhitespaceValidator])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(pattern)])),
      mobile_no: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)])),
      referralCode: new FormControl('')
    });
    // this.spinner.hide('outer');
  }

  ngOnInit() {
    console.log('On init => ');
    this.userSettings = {
      inputPlaceholderText: 'Search By Suburb',
      inputString: '',
      geoCountryRestriction: 'au',
      showSearchButton: false,
      noOfRecentSearchSave: 3,
      showCurrentLocation: false
    };

    this.userSettings_traderHub = {
      // removed for now
      // inputPlaceholderText: 'Suburb and Postcode',
      // removed for now
      inputPlaceholderText: 'Suburb',
      inputString: '',
      geoCountryRestriction: 'au',
      showSearchButton: false,
      noOfRecentSearchSave: 3,
      showCurrentLocation: false
    };

    this.userSettings1 = {
      inputPlaceholderText: 'Enter Address here..',
      geoCountryRestriction: 'au',
      inputString: '',
      showSearchButton: false,
      noOfRecentSearchSave: 3,
      showCurrentLocation: false
    };
    // this.route.paramMap.subscribe(param => {
    //   console.log('param => ', param);
    //   this.currentPage = `/${param.get('type')}`;
    //   if (this.currentPage.indexOf('buy') >= 0) {
    //     this.search_obj.listingType = 'sale';
    //   } else if (this.currentPage.indexOf('rent') >= 0) {
    //     this.search_obj.listingType = 'rent';
    //   } else if (this.currentPage.indexOf('trade') >= 0) {
    //     this.heading = 'Get Tradie Quotes Fast' || this.heading;
    //     const homeTab = document.getElementsByClassName('home-tabs');
    //     homeTab.item(0).classList.add('trade');
    //   }
    //   window.scrollTo(0, 0);
    //   this.spinner.hide('outer');
    //   console.log('currentPage => ', this.currentPage);
    // });
    // this.dataShare.currentPage.subscribe(pages => {
    this.currentPage = this.router.url.split('?')[0] ? this.router.url.split('?')[0] : this.router.url;
    // this.serviceCategories = this.route.snapshot.data[`serviceCategoryList`][`data`];
    // Get service categories
    this.ServiceCategoryList();



    this.router.events.subscribe((e: Event) => {
      console.log('e :: router event=> ', e);
      if (e instanceof NavigationStart) {
        this.spinner.show('outer');
      }

      if (e instanceof NavigationEnd) {
        if (this.route.snapshot.data[`serviceCategoryList`] !== undefined) {
          if (localStorage.getItem('catList') !== undefined
            && localStorage.getItem('catList') !== 'undefined'
            && localStorage.getItem('catList') != null) {
            this.serviceCategories = JSON.parse(localStorage.getItem('catList'));
          } else {
            // this.serviceCategories = this.route.snapshot.data[`serviceCategoryList`][`data`];
            this.ServiceCategoryList();
          }
        }
        // if (pages.length > 1) {
        this.currentPage = this.router.url.split('?')[0] ? this.router.url.split('?')[0] : this.router.url;
        this.currentPage = `/${this.currentPage.split('/')[1]}`;
        if (this.currentPage.indexOf('buy') >= 0) {
          this.search_obj.listingType = 'sale';
          // this.heading = `Australia's Ownly Search Platform`;
        } else if (this.currentPage.indexOf('rent') >= 0) {
          this.search_obj.listingType = 'rent';
          // this.heading = `Linking Properties to Trades`;
        } else if (this.currentPage.indexOf('trade') >= 0 || this.currentPage.indexOf('find') >= 0) {
          // this.heading = 'Get Tradie Quotes Fast';
          this.heading = 'Find your Ownly Tradie';
          // const homeTab = document.getElementsByClassName('home-tabs');
          // homeTab.item(0).classList.add('trade');
        }
        window.scrollTo(0, 0);
        this.spinner.hide('outer');
      }
    });



    this.route.paramMap.subscribe(async (param: any) => {
      this.currentPage = this.router.url.split('?')[0] ? this.router.url.split('?')[0] : this.router.url;
      this.currentPage = `/${this.currentPage.split('/')[1]}`;
      console.log('param => ', param);
      let state_;
      if (param.keys.length > 0 && this.currentPage === '/find') {
        // if (param.has('category')) {
        if (param.get('state') == 'nsw' || param.get('state') == 'NSW') {
          state_ = 'New South Wales';
        }
        const data = {
          // categories_id: '5d3eb671a4728c25432fea6c', // will replace with dynamic, if exist otherwise null/remove/undefined
          category_slug: _replace(param.get('category'), "_", " "),
          state: state_ ? state_ : param.get('state'),
          suburb: param.get('suburb'),
          postcode: param.get('suburb')
        };
        let docTitle = `Qualified `
        if (data.category_slug) {
          let catname = this.titleCase(data.category_slug)
          docTitle += `${catname} In `
        }
        if (data.suburb) {
          let catname = this.titleCase(data.suburb)
          docTitle += `${catname}, `
        }
        if (data.state) {
          let catname = _upperCase(data.state)
          docTitle += `${catname} `
        }
        docTitle += `AU | Ownly`
        document.title = docTitle
        let category_details;
        this.all.post('tradersList', data).subscribe(async (res: any) => {
          const tData = res.data;
          category_details = await res.category_details;
          if (category_details) {
            let location;
            if (param.get('suburb')) {
              location = param.get('suburb').charAt(0).toUpperCase() + param.get('suburb').substr(1).toLowerCase();
            }
            if (param.get('state')) {
              location = location + ' ' + param.get('state').charAt(0).toUpperCase() + param.get('state').substr(1).toLowerCase();
            }

            this.displayBlock = 'category';
            this.selectedCategory = `${category_details.name}`; // will replace with dynamic
            this.tradePageHeading = `Licensed ${category_details.name} in`;
            this.selectedCategoryId = `${category_details._id}`;
            this.selectedProjects = `category/${category_details.name}/${category_details._id}`;
            this.inLocationName = `${location ? location : 'Australia'}`;
            this.userSettings = { ...this.userSettings, inputString: `${location ? location : 'Australia'}` };
            // this.heading = 'Get Tradie Quotes Fast';
            this.heading = 'Find your Ownly Tradie';
          }
          this.tradersListData = this.sorting(tData, 1);
        });

        const searchObj = {
          search_text: ' ',
          suburb_postcode: ''
        };
        await this.getCategoriesBusinessnamesList(searchObj);
        // }
      }
    });

    if (this.currentPage.indexOf('buy') >= 0) {
      this.search_obj.listingType = 'sale';
    } else if (this.currentPage.indexOf('rent') >= 0) {
      this.search_obj.listingType = 'rent';
    } else if (this.currentPage.indexOf('trade') >= 0) {
      // this.heading = 'Get Tradie Quotes Fast' || this.heading;
      // const homeTab = document.getElementsByClassName('home-tabs');
      // homeTab.item(0).classList.add('trade');
    }

    this.route.queryParamMap.subscribe((param: any) => {
      if (param.keys.length > 0) {
        this.displayBlock = param.params.s;
        this.formData.trader_id = param.params.t;
        this.selectedCategoryId = (param.params.c !== '') ? param.params.c : this.serviceCategories[0]._id;
      }
      // set data after login for service request page
      if (localStorage.getItem('user')) {
        var decrypted = this.EncrDecr.getEncrypt(localStorage.getItem('user'));
        if (decrypted) {
          this.f.firstname.setValue(decrypted.data.name ? decrypted.data.name : '');
          this.f.email.setValue(decrypted.data.email);
          this.f.mobile_no.setValue(decrypted.data.mobile_no);
          this.userSettings1 = { ...this.userSettings1, inputString: `${decrypted.data.address ? decrypted.data.address : ''}` };
        }
      } else {
        this.dataShare.loginUser.subscribe((data) => {
          if (data) {
            var decrypted = JSON.parse(data);
            this.f.firstname.setValue(decrypted.data.name ? decrypted.data.name : '');
            this.f.email.setValue(decrypted.data.email);
            this.f.mobile_no.setValue(decrypted.data.mobile_no);
            this.userSettings1 = { ...this.userSettings1, inputString: `${decrypted.data.address ? decrypted.data.address : ''}` };
          }
        });
      }
    });
    this.spinner.hide('outer');
  }

  titleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  // Get Agent List
  getAgentList() {
    this.all.get('agentsList').subscribe(res => {
      let agentData = res['data'];
      agentData = this.sorting(agentData, 1);
      this.agentsList = agentData.slice(0, 3);
    }, err => {
      console.log('err => ', err);
      this.agentsList = [];
    });
  }


  // click on agent serach button
  searchAgent() {
    console.log('agentFilter => /', this.agentFilter);
    this.all.onSeachClearFilters();
    if (this.agentFilter[`city`]) {
      localStorage.setItem('agent_search_obj', JSON.stringify(this.agentFilter));
      this.dataShare.changeAgentSearchObj(this.agentFilter);
      this.router.navigate(['/agent_list']);
    } else {
      this.toastr.info('Please choose valid input!', '');
      this.userSettings = { ...this.userSettings, inputString: '' };
    }

  }

  // Trader List
  getTradersList() {
    this.all.get('tradersListPublic').subscribe(res => {
      console.log('res => ', res);
      if (res && res['data']) {
        // let tData = res['data'];
        // tData = this.sorting(tData, 1);
        // this.tradersList = tData.slice(0, 4);
        this.tradersList = res['data'].slice(0, 4);
      } else {
        this.tradersList = [];
      }
    }, err => {
      console.log('err => ', err);
      this.tradersList = [];
    });
  }

  // Premium Trader List
  getPremiumTraders() {
    this.all.post('premiumTradersList', {}).subscribe(res => {
      console.log('res => ', res);
      if (res && res['data']) {
        this.premiumTradersList = res['data'];
      } else {
        this.premiumTradersList = [];
      }
    }, err => {
      console.log('err => ', err);
      this.premiumTradersList = [];
    });
  }

  open(path) {
    document.getElementById('id01').setAttribute('style', 'display : block');
    document.getElementById('id01').removeAttribute('hidden');
    document.getElementById('vid').setAttribute('src', path);
    let ele = document.getElementById('id01')
    ele.style.display = "block"
  }

  close() {
    document.getElementById('id01').setAttribute('hidden', 'true');
    document.getElementById('id01').removeAttribute('style');
    document.getElementById('vid').setAttribute('src', '');
    document.getElementById('id01').setAttribute('style', 'display : none');
    let myVideo = document.querySelector('video');
    myVideo.pause();
    let ele = document.getElementById('id01')
    ele.style.display = "none"
  }
  // Get service categories
  ServiceCategoryList() {
    this.all.get('getServiceCategory').subscribe(res => {
      console.log('res:: service categories => ', res);
      if (res && res['data']) {
        let serviceCategoryList = JSON.parse(localStorage.getItem('service_cat')) ? localStorage.getItem('service_cat') : 'null'
        serviceCategoryList = JSON.stringify(res['data'])
        this.serviceCategories = res[`data`];
        localStorage.setItem('service_cat', serviceCategoryList)
      } else {
        this.serviceCategories = [];
      }
    }, err => {
      console.log('err => ', err);
      this.serviceCategories = [];
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

  // validation for integer number
  restrictAlphabets(e) {
    var x = e.which || e.keycode;
    if ((x >= 48 && x <= 57) || x === 8 ||
      (x >= 35 && x <= 40) || x === 46) {
      return true;
    } else {
      return false;
    }
  }

  // whitespace validator
  noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { required: true };
  }

  // fetch google autocomplete data
  autoCompleteCallback1(selectedData: any, type = 'global') {
    console.log('type => ', type);
    console.log('autoCompleteCallback1: selectedData => ', selectedData);
    this.dataShare.search_Title(selectedData.data.description);
    localStorage.setItem('searchTitle', selectedData.data.description);
    this.inLocationName = `${selectedData.data.address_components[0].short_name} ${selectedData.data.address_components[2]
      ? selectedData.data.address_components[2].short_name : ''}`;
    if (type === 'global') {
      const locationObj = {
        region: '',
        area: '',
        includeSurroundingSuburbs: false,
        postCode: '',
        state: '',
        suburb: ''
      };
      let suburbFlag = 0;
      let stateFlag = 0;
      let postCodeFlag = 0;
      if (selectedData.data && selectedData.data.address_components && selectedData.data.address_components.length > 0) {
        for (const i in selectedData.data.address_components) {
          if (i) {
            var addressType = selectedData.data.address_components[i].types;
            // console.log('addressType => ', addressType);
            if (addressType.indexOf('postal_code') >= 0) {
              var postal_code = selectedData.data.address_components[i].long_name;
              locationObj.postCode = postal_code;
              postCodeFlag = 1;
            }
            if (addressType.indexOf('administrative_area_level_1') >= 0) {
              var state = selectedData.data.address_components[i].short_name;
              locationObj.state = state;
              stateFlag = 1;
            }
            if (addressType.indexOf('locality') >= 0) {
              var city = selectedData.data.address_components[i].long_name;
              locationObj.suburb = city;
              suburbFlag = 1;
            }
          }
        }
      }
      if (suburbFlag === 0) {
        locationObj.suburb = '';
      }
      if (postCodeFlag === 0) {
        locationObj.postCode = '';
      }
      if (stateFlag === 0) {
        locationObj.state = '';
      }
      this.search_obj['locations'] = [locationObj];
      const searchbtn = document.getElementById('btnsearch');
      searchbtn.focus();
    } else if (type === 'sr_address') {
      if (selectedData.data) {
        this.req_address['lat'] = selectedData.data.geometry.location ? selectedData.data.geometry.location.lat : null;
        this.req_address['lng'] = selectedData.data.geometry.location ? selectedData.data.geometry.location.lng : null;
        this.req_address['address'] = selectedData.data.formatted_address ? selectedData.data.formatted_address : null;
      }
    } else if (type === 'trade') {
      if (selectedData.data) {
        this.trade_address['lat'] = selectedData.data.geometry.location ? selectedData.data.geometry.location.lat : null;
        this.trade_address['lng'] = selectedData.data.geometry.location ? selectedData.data.geometry.location.lng : null;
        this.trade_address['address'] = selectedData.data.formatted_address ? selectedData.data.formatted_address : null;
        const locationObj = {
          region: '',
          area: '',
          includeSurroundingSuburbs: false,
          postCode: '',
          state: '',
          suburb: ''
        };
        let suburbFlag = 0;
        let stateFlag = 0;
        let postCodeFlag = 0;
        if (selectedData.data && selectedData.data.address_components && selectedData.data.address_components.length > 0) {
          for (const i in selectedData.data.address_components) {
            if (i) {
              var addressType = selectedData.data.address_components[i].types;
              // console.log('addressType => ', addressType);
              if (addressType.indexOf('postal_code') >= 0) {
                var postal_code = selectedData.data.address_components[i].long_name;
                locationObj.postCode = postal_code;
                postCodeFlag = 1;
              }
              if (addressType.indexOf('administrative_area_level_1') >= 0) {
                var state = selectedData.data.address_components[i].short_name;
                locationObj.state = state;
                stateFlag = 1;
              }
              if (addressType.indexOf('locality') >= 0) {
                var city = selectedData.data.address_components[i].long_name;
                locationObj.suburb = city;
                suburbFlag = 1;
              }
            }
          }
        }
        if (suburbFlag === 0) {
          locationObj.suburb = '';
        }
        if (postCodeFlag === 0) {
          locationObj.postCode = '';
        }
        if (stateFlag === 0) {
          locationObj.state = '';
        }
        this.trade_address[`location`] = locationObj;
      }
      const searchbtn = document.getElementById('btnsearch');
      searchbtn.focus();
    } else if (type === 'agent') {
      console.log('agent => ');
      this.agentFilter = {
        city: ''
      };
      if (selectedData.data && selectedData.data.address_components && selectedData.data.address_components.length > 0) {
        for (const i in selectedData.data.address_components) {
          if (i) {
            const addressType = selectedData.data.address_components[i].types;
            // console.log('addressType => ', addressType);
            if (addressType.indexOf('locality') >= 0) {
              const subhurb = selectedData.data.address_components[i].long_name;
              this.agentFilter['city'] = subhurb;
            }
          }
        }
      }
      // this.search_obj['locations'] = [locationObj];
      const searchbtn = document.getElementById('btnsearch');
      searchbtn.focus();
    }

  }

  // click on search button
  search() {
    this.all.onSeachClearFilters();
    this.dataShare.changeSearchObj(this.search_obj);
    localStorage.setItem('search_obj', JSON.stringify(this.search_obj));
    // console.log('this.search_obj[`locations`]', this.search_obj[`locations`]);
    if (this.search_obj[`locations`]) {
      this.router.navigate(['/property_list']);
    } else {
      this.toastr.info('Please choose valid input!', '');
      this.userSettings = { ...this.userSettings, inputString: '' };
    }
  }

  // get Categories from API and set in dropdown
  async searchTradeHub(e) {
    let tradeSearchObj = {};
    if (e && e !== '') {
      tradeSearchObj['search_text'] = e;
    }
    if (this.selectedSuburbPostcode && this.selectedSuburbPostcode !== '') {
      tradeSearchObj = Object.assign(tradeSearchObj, { 'suburb_postcode': this.selectedSuburbPostcode });
    }
    await this.getCategoriesBusinessnamesList(tradeSearchObj);
  }

  getCategoriesBusinessnamesList = async (searchObj: any) => {
    await this.all.post('getCategoriesBusinessnamesList', searchObj).subscribe(res => {
      this.projects = [];
      const response = res['data'];
      const requestArray = [];
      const categoryArray = [];
      const businessArray = [];
      if (response.categories && response.categories.length > 0) {
        const catArr = response.categories;
        for (const cat of catArr) {
          const reqObj = { span: 'let us find you', title: cat.name, id: `request/${cat.name}/${cat._id}` };
          const catObj = { span: 'Browse', title: cat.name, id: `category/${cat.name}/${cat._id}` };
          requestArray.push(reqObj);
          categoryArray.push(catObj);
        }
        this.serviceCategoryProject.subprojects = categoryArray;
        this.serviceRequestProject.subprojects = requestArray;
        this.projects.push(this.serviceRequestProject);
        this.projects.push(this.serviceCategoryProject);
      }
      if (response.users && response.users.length > 0) {
        const businessArr = response.users;
        for (const bus of businessArr) {
          const busObj = { img: bus.image, title: bus.business_name, id: `business/${bus._id}` };
          businessArray.push(busObj);
        }
        this.businessProject.subprojects = businessArray;
        this.projects.push(this.businessProject);
      }
    });
    // console.log('this.projects => ', this.projects);
  }

  // select suburb and postal code
  selectedSuburbPostalcode(selectedSubUrb) {
    this.selectedSuburbPostcode = selectedSubUrb;
  }

  onSubmitTradHub() {
    const state = this.trade_address[`location`] ? (this.trade_address[`location`].state).toLowerCase() : '';
    const city = this.trade_address[`location`] ? (this.trade_address[`location`].suburb).toLowerCase() : '';
    // this.inLocationName = `${city} ${state}`;
    if (this.selectedProjects) {
      const selectedType = this.selectedProjects.split('/');
      this.heading = '';
      if (selectedType[0] === 'request') {
        this.displayBlock = selectedType[0];
        this.selectedCategory = selectedType[1];
        this.tradePageHeading = `We have ${selectedType[1]} ready to help you in`;
        this.selectedCategoryId = selectedType[2];
      } else if (selectedType[0] === 'business') {
        if (selectedType[1]) {
          this.router.navigate([`trader/${selectedType[1]}`]);
        }
      } else if (selectedType[0] === 'category') {
        const category = selectedType[1]
          .toLowerCase()
          .replace(/[^\w]/gi, '_');
        if (city === '' && state === '') {
          this.router.navigate([`/find/${category}`]);
        } else if (city === '') {
          this.router.navigate([`/find/${category}/${state}`]);
        } else {
          this.router.navigate([`/find/${category}/${state}/${city}`]);
        }
        // this.spinner.show("traderList");
        // if (selectedType[1]) {
        //   const data = {
        //     'categories_id': selectedType[2]
        //   }
        //   this.all.post('tradersList', data).subscribe(res => {
        //     let tData = res['data'];
        //     this.tradersListData = this.sorting(tData, 1);
        //   });
        //   // let tData = this.route.snapshot.data["tradersList"]["data"];
        //   // this.tradersList = this.sorting(tData, 1);
        //   this.displayBlock = selectedType[0];
        //   this.selectedCategory = selectedType[1];
        //   this.tradePageHeading = `Licensed ${selectedType[1]} in`;
        //   this.selectedCategoryId = selectedType[2];
        // }
      } else {
        console.log('\n in else');
      }
    } else {
      this.toastr.info('Please choose valid input!', '');
      this.userSettings_traderHub = { ...this.userSettings_traderHub, inputString: '' };
    }
  }

  get f() {
    return this.form.controls;
  }
  onFocus(e) {
    const dropdown = document.getElementsByClassName('ng-dropdown-panel');
    dropdown.length > 0 ? dropdown.item(0).classList.add('remove-dropdown') : '';
    // dropdown.item(0).setAttribute("style", "display:none;");
  }

  onSearch() {
    const dropdown = document.getElementsByClassName('ng-dropdown-panel');
    dropdown.item(0).classList.remove('remove-dropdown');
    // dropdown.item(0).removeAttribute("style");
  }

  // on click get quotes
  getQuoteClick(trader_id, categoriesList) {
    // this.serviceCategories = this.route.snapshot.data[`serviceCategoryList`][`data`];
    this.serviceCategories = (categoriesList && categoriesList.length > 0) ? categoriesList : this.serviceCategories;
    this.selectedCategoryId = this.serviceCategories[0] ? this.serviceCategories[0]._id : null;
    if (!this.serviceCategories[0]) {
      // this.serviceCategories = this.route.snapshot.data[`serviceCategoryList`][`data`];
      this.ServiceCategoryList();
    }
    this.formData.trader_id = trader_id;
    this.TraderID_for_send_request = trader_id;
    console.log('trader', trader_id);
    this.displayBlock = 'request';
    this.tradePageHeading = `We have ${this.selectedCategory} ready to help you in`;
  }


  // file select and validation on service request page
  onfileSelect(event) {
    // this.req_selected_files = [];
    this.req_imgForm = [];
    this.msgs = [];
    const filesLength = event.target.files ? event.target.files.length : 0;
    if (filesLength <= this.req_fileLimit) {
      const imgArray = event.target.files;
      for (let i = 0; i < filesLength; i++) {
        if (this.req_selected_files.length < this.req_fileLimit) {
          const obj = {};
          if (imgArray[i].size <= 12000000 && (((imgArray[i].type).substr(0, 5) === 'image') || imgArray[i].type === 'application/pdf')) {
            this.req_imgForm.push(imgArray[i]);
            obj['size'] = imgArray[i].size;
            obj['name'] = imgArray[i].name;
            var reader = new FileReader();
            reader.onload = (event: any) => {
              obj['url'] = event.target.result;
              this.req_selected_files.push(obj);
            }
            reader.readAsDataURL(event.target.files[i]);
          } else if (imgArray[i].size > 12000000) {
            this.msgs.push([{ severity: 'error', summary: '', detail: `${imgArray[i].name} has exceding file size.` }]);
          } else if ((imgArray[i].type).substr(0, 5) !== 'image' || imgArray[i].type !== 'application/pdf') {
            this.msgs.push([{ severity: 'error', summary: '', detail: `${imgArray[i].name} has not proper file format. ` }]);
          }
        }
        else {
          this.msgs.push([{ severity: 'error', summary: '', detail: `File size excced limit ${this.req_fileLimit}.` }]);
        }
      }
    } else {
      this.msgs.push([{ severity: 'error', summary: '', detail: `File size excced limit ${this.req_fileLimit}.` }]);
    }
  }

  // remove files from selected file on service request page
  remove(index) {
    this.req_selected_files.splice(index, 1);
  }

  // function for convert file size bytes to KB, MB, GB
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) { return '0 Bytes'; }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // submit serive request page
  submit(form) {
    this.req_isFormSubmited = true;
    this.formData = form.value;
    if (form.valid) {
      if (!this.req_address['address'] && !(this.req_address['lng'] || this.req_address['lat'])) {
        this.toastr.error('Please select an address before submitting.', 'Address Required');
        return;
      }
      this.spinner.show('outer');
      (this.formData.budget) ? this.formData.budget = parseInt(this.formData.budget) : this.formData.budget = parseInt('00');
      if (this.formData.due_date) {
        this.formData.due_date = moment(this.formData.due_date).format('YYYY-MM-DD HH:mm');
      }
      if (this.req_address['address']) {
        this.formData['address'] = this.req_address['address'];
        this.formData['longitude'] = this.req_address['lng'];
        this.formData['latitude'] = this.req_address['lat'];
      }
      if (this.TraderID_for_send_request) {
        // This trader ID will get when click on 'GET A QUOTE' button and send request to particular trader.
        this.formData['trader_id'] = this.TraderID_for_send_request;
      }

      if (this.route.snapshot.queryParams['t']) {
        // This trader ID will get when click on 'Request Maintainance' button and send request to particular trader.
        this.formData['trader_id'] = this.route.snapshot.queryParams['t'];
      }

      if (this.route.snapshot.queryParams['inviteBy']) {
        // This trader ID will get when click on 'Request Maintainance' button and send request to particular trader.
        this.formData['trader_id'] = this.route.snapshot.queryParams['inviteBy'];
      }

      this.all.post('addMR', this.formData).subscribe(async res => {
        if (res['code'] === 200) {
          if (this.req_selected_files.length > 0) {
            // call imag upload API
            const req_id = res['data'] ? res['data']['_id'] : null;
            if (req_id && req_id !== null) {
              const data: any = await this.fileUploads(this.req_imgForm, req_id);
              const q = [];
              data.map(d => {
                q.push(this.all.postFormData('uploadMaintenanceImages', d).toPromise());
              });
              await Promise.all(q);
            }
          }
          this.req_selected_files = [];
          this.req_isFormSubmited = false;
          this.req_address = {};
          this.msgs = [];
          this.req_imgForm = [];

          //Reset Data
          this.form.reset();
          this.userSettings1 = {
            inputPlaceholderText: 'Enter Address here..',
            geoCountryRestriction: 'au',
            inputString: '',
            showSearchButton: false,
            noOfRecentSearchSave: 3,
            showCurrentLocation: false
          };
          this.userSettings_traderHub = {
            // inputPlaceholderText: 'Suburb and Postcode',
            inputPlaceholderText: 'Suburb',
            inputString: '',
            geoCountryRestriction: 'au',
            showSearchButton: false,
            noOfRecentSearchSave: 3,
            showCurrentLocation: false
          };
          this.displayBlock = 'home';
          this.selectedProjects = null;
          this.toastr.success('Request Sent successfully!', 'Success!', { timeOut: 3000 });
          this.spinner.hide('outer');
          this.router.navigate(['/trade']);
          window.scrollTo(0, 0);
        } else {
          this.toastr.error('Something went wrong!', 'Error!', { timeOut: 3000 });
          this.spinner.hide('outer');
          // this.router.navigate(['/trade']);
        }
      });
      localStorage.removeItem('catList');
    }
  }

  fileUploads(data, reqId) {
    const promise = new Promise((resolve, reject) => {
      const fdata = []
      for (const img of data) {
        const imgForm = new FormData();
        imgForm.append('file', img);
        imgForm.append('_id', reqId);
        fdata.push(imgForm);
      }
      resolve(fdata);
    });

    return promise;
  }

  ngOnDestroy = () => {
    localStorage.removeItem('search_obj');
  }
}
