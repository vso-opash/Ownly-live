import { Component, OnInit, ElementRef, Renderer, AfterViewChecked } from '@angular/core';
import { DataShareService } from '../shared/data-share.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'underscore';
import { Router, NavigationEnd, Event } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CrudService } from '../shared/crud.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { EncrDecrService } from '../shared/EncrDecrService.service';
import { FacebookLoginProvider, GoogleLoginProvider, AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, AfterViewChecked {
  public currentPage = '/home';
  public activeType = '';
  public search_obj;
  public selectedMinLandArea = 0;
  public selectedMaxLandArea = 0;
  public LandAreaErrorMsg = '';
  public LandError = false;
  public selectedKeyword = '';
  public isSubmit = false;
  roles: any = [];
  defaultRole: any = { description: 'Owner' };
  public userSettings = {};
  public is_open = false;
  parentExample = false;
  env = environment;
  user: any = {};

  // price range
  public minPriceRange = { sale: 0, rent: 0 };
  public maxPriceRange = { sale: 12000000, rent: 5000 };
  public rangeValues: number[] = [0, 5000000];

  // configuration for propertyTypes
  public propertyOptionsArray = [
    { label: 'House', checked: false, value: 'House' },
    { label: 'Apartments', checked: false, value: 'ApartmentUnitFlat' },
    { label: 'Townhouse', checked: false, value: 'Townhouse' },
    { label: 'Studio', checked: false, value: 'Studio' },
    { label: 'Rural', checked: false, value: 'Rural' },
  ];
  public selectedPropertyTypes = [];

  locationOptionsArray = [
    { label: 'Search Nearby suburbs', checked: false, value: 'SearchNearbySuburbs' },
  ];

  // configuration for features
  public featureOptionsArray = [
    { label: 'Pets allowed', checked: false, value: 'PetsAllowed' },
    { label: 'Built in wardrobes', checked: false, value: 'BuiltInWardrobes' },
    { label: 'Gas', checked: false, value: 'Gas' },
    { label: 'Garden / courtyard', checked: false, value: 'GardenCourtyard' },
    { label: 'Balcony / deck', checked: false, value: 'BalconyDeck' },
    { label: 'Internal laundry', checked: false, value: 'InternalLaundry' },
    { label: 'Study', checked: false, value: 'Study' },
    { label: 'Swimming pool', checked: false, value: 'SwimmingPool' },
    { label: 'Air conditioning', checked: false, value: 'AirConditioning' },
  ];
  public selectedFeatures = [];

  // configuration for newEstablishedTypes
  public newEstablishedArray = [
    { label: 'Any', value: 'Any' },
    { label: 'New Constructions', value: 'New' },
    { label: 'Established Properties', value: 'Established' },
  ];
  public selectedPropertyEstablishedType = 'Any';

  // configuration for bedrooms, bathrooms and carparkings
  public radioOptions = [
    { id: 0, label: 'Any' },
    { id: 1, label: '1+' },
    { id: 2, label: '2+' },
    { id: 3, label: '3+' },
    { id: 4, label: '4+' },
    { id: 5, label: '5+' }
  ];
  public radioOptionsAprray = ['minBedrooms', 'minBathrooms', 'minCarspaces', 'minLandArea', 'maxLandArea'];
  public selectedBedrooms = 0;
  public selectedBathrooms = 0;
  public selectedParkings = 0;

  // more options configuration
  public moreOptionsObj = {
    minLandArea: 0,
    maxLandArea: 0,
    propertyEstablishedType: '',
    propertyFeatures: [],
    keywords: [],
    locations: [
      {
        region: '',
        area: '',
        includeSurroundingSuburbs: false,
        postCode: '',
        state: '',
        suburb: ''
      }
    ]
  };

  // Use for display label dynamically
  public moreOptions_Obj = [
    { label: 'minLandArea', value: [] },
    { label: 'propertyEstablishedType', value: [] },
    { label: 'propertyFeatures', value: [] },
    { label: 'keywords', value: [] }
  ];

  // Use for display label dynamically
  public labelswithvalue = [
    { label: 'Price', value: [] },
    { label: 'Property Type', value: [] },
    { label: 'Bedrooms', value: '' },
    { label: 'Bathrooms', value: '' },
    { label: 'Parkings', value: '' },
    { label: 'More options', value: [] }
  ];

  // Signup form
  public signupForm: FormGroup;
  form_validation: boolean = false;
  disableSubmit = false;
  signupData: any = {};
  public clickSignup = false;
  public displayLinks = true;
  clickTerms = false;
  clickPrivacy = false;
  public dashboardURL = environment.portalURL;
  public portalLoginURL = environment.portalURL + '#!/login';
  public portalSignUpURL = environment.portalURL + '#!/signup';
  isDisplayImage = false;

  constructor(
    private dataShare: DataShareService,
    private EncrDecr: EncrDecrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private service: CrudService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private datashare: DataShareService,
    private authService: AuthService
  ) {
    console.log('dashboardURL => ', this.dashboardURL);
    this.search_obj = JSON.parse(localStorage.getItem('search_obj'));
    this.service.invokeSigninComponentFunction.subscribe(() => {
      this.clickOnSignup();
    });
    localStorage.getItem('user') ? this.displayLinks = false : this.displayLinks = true;
    this.dataShare.loginUser.subscribe((data) => {
      if (data) {
        console.log('1 => ');
        this.displayLinks = false;
        this.user = localStorage.getItem('user') ? this.EncrDecr.getEncrypt(localStorage.getItem('user')) : null;
        console.log('this.user :: 1 => ', this.user);
        if (this.user && this.user.data && this.user.data.image) {
          this.isDisplayImage = true;
        }
      } else if (!this.displayLinks) {
        console.log('2 => ');
        this.user = localStorage.getItem('user') ? this.EncrDecr.getEncrypt(localStorage.getItem('user')) : null;
        if (this.user && this.user.data && this.user.data.image) {
          this.isDisplayImage = true;
        }
      }
    });
  }

  open(path) {
    document.getElementById('id01').setAttribute('style', 'display : block');
    document.getElementById('id01').removeAttribute('hidden');
    document.getElementById('vid').setAttribute('src', path);
  }

  close() {
    document.getElementById('id01').setAttribute('hidden', 'true');
    document.getElementById('id01').removeAttribute('style');
    document.getElementById('vid').setAttribute('src', '');
  }

  // validation for integer number
  restrictAlphabets(e) {
    const x = e.which || e.keycode;
    if ((x >= 48 && x <= 57) || x === 8 ||
      (x >= 35 && x <= 40) || x === 46) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {
    // this.dataShare.currentsearchObj.subscribe(s_obj => {
    //   console.log('s_obj => ', s_obj);
    //   if (s_obj) {
    //     this.activeType = s_obj['listingType'];
    //   } else {
    //     this.activeType = (this.search_obj && this.search_obj['listingType']) ? this.search_obj['listingType'] : '';
    //   }
    //   if (s_obj && !s_obj.maxPrice) {
    //     this.rangeValues = [
    //       0,
    //       this.activeType === 'sale' ? 5000000 : 1000
    //     ];
    //   }
    // });


    // console.log('activeType => ', this.activeType);
    // this.rangeValues = [
    //   0,
    //   this.activeType === 'sale' ? 5000000 : 1000
    // ];
    this.userSettings = {
      inputPlaceholderText: 'Suburb',
      geoCountryRestriction: 'au',
      showSearchButton: false,
      noOfRecentSearchSave: 3,
      showCurrentLocation: false
    };
    this.currentPage = `/${(this.router.url).split('/')[1]}`;
    this.dataShare.currentsearchTitle.subscribe((message) => {
      console.log('message => ', message);
      if (message) {
        this.userSettings = { ...this.userSettings, inputString: `${message ? message : ''}` };
      } else {
        const title = localStorage.getItem('searchTitle');
        this.userSettings = { ...this.userSettings, inputString: `${title ? title : ''}` }
      }
    });

    this.router.events.subscribe((e: Event) => {
      const currentPage = `/${(this.router.url).split('/')[1]}`;
      if (e instanceof NavigationEnd) {
        console.log('currentPage => ', currentPage);
        if (currentPage === '/property_list' || currentPage === '/agent_list' || currentPage === '/property'
          || currentPage === '/trader' || currentPage === '/agent_profile' || currentPage === '/about_us' || currentPage === '/contact_us'
          || currentPage === '/privacy_policy' || currentPage === '/feature') {
          this.currentPage = currentPage;
        } else {
          this.currentPage = '/home';
        }
      }
    });

    console.log('this.currentPage => ', this.currentPage);
    if (this.currentPage === '/property_list' || this.currentPage === '/agent_list' || this.currentPage === '/property'
      || this.currentPage === '/trader' || this.currentPage === '/agent_profile' || this.currentPage === '/about_us' || this.currentPage === '/contact_us'
      || this.currentPage === '/privacy_policy' || this.currentPage === '/feature') {
      this.currentPage = this.currentPage;
    } else {
      this.currentPage = '/home';
    }
    const pattern = new RegExp('(?=.*[a-z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{8,}');
    // Signup form
    this.signupForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}')]],
      mobile_no: ['', [Validators.required]],
      agreement: ['', [Validators.required]],
      password: ['', [Validators.required,
      Validators.pattern('(?=.*[a-z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{8,}')
        // Validators.pattern('^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#$%^&+=])[a-zA-Z0-9@#!$%^&+=]*$')
      ]],
      conf: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });

    // Clear Filter data using Emit
    this.service.clearFilters.subscribe(() => {
      this.clearFilter();
    });
    this.getUserRoles();
  }

  getApp = () => {
    document.getElementById('footer').scrollIntoView({ behavior: 'smooth' });
  }

  getUserRoles = () => {
    this.service.get('roles').subscribe((res: any) => {
      this.roles = res.data;
      this.defaultRole = this.roles.find(role => role.description === this.defaultRole.description);
    });
  }

  // Check Confirm password
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('conf').value ? null : g.get('conf').setErrors({ 'mismatch': true });
  }

  ngAfterViewChecked() {
    this.customHeaderHandler();
  }

  // change search obj according to filter
  changeSearchObj(obj) {
    // Reasign for clear the data.
    const that = this;
    let search_obj = JSON.parse(localStorage.getItem('search_obj'));
    let flag = 0;
    if (obj && obj.length > 0) {
      for (const o of obj) {
        if (search_obj.hasOwnProperty(o['type'])) {
          if (Array.isArray(o['value'])) {
            if (!(_.isEqual(search_obj[o['type']].sort(), o['value'].sort()))) {
              search_obj[o['type']] = o['value'];
              flag = 1;
            }
          } else if (search_obj[o['type']] !== o['value']) {
            if (that.radioOptionsAprray.indexOf(o['type']) !== -1 && o['value'] === 0) {
              delete search_obj[o['type']];
            } else {
              search_obj[o['type']] = o['value'];
            }
            flag = 1;
          }
        } else {
          if (that.radioOptionsAprray.indexOf(o['type']) !== -1 && o['value'] === 0) {
            search_obj[o['type']] = o['value'];
          } else if (that.radioOptionsAprray.indexOf(o['type']) == -1) {
            search_obj[o['type']] = o['value'];
          } else {
            search_obj[o['type']] = o['value'];
          }
          flag = 1;
        }
      }
      setTimeout(function () {
        if (flag === 1) {
          that.spinner.show('outer');
          that.dataShare.changeSearchObj(search_obj);
          localStorage.setItem('search_obj', JSON.stringify(search_obj));
        }
      }, 1000);
    }
  }

  // fetch search listing type object
  searchType(type: string) {
    this.rangeValues = [
      0,
      type === 'sale' ? 5000000 : 1000
    ];
    this.activeType = type;
    const type_obj = [{ type: 'listingType', value: type }];
    this.changeSearchObj(type_obj);
  }

  // fetch search price obj on slide event
  searchPrice() {
    const that = this;
    const price_obj = [{ type: 'minPrice', value: this.rangeValues[0] }, { type: 'maxPrice', value: this.rangeValues[1] }];
    that.changeLabels('Price', price_obj);
    setTimeout(() => {
      that.changeSearchObj(price_obj);
    }, 500);
  }

  // fetch search price obj on click event
  searchPriceOnClick(e) {
    if (e.event.type === 'click') {
      this.searchPrice();
    }
  }

  // fetch search bedrooms obj
  selectBedrooms(id: number) {
    const that = this;
    this.selectedBedrooms = id;
    const bedrooms_obj = [{ type: 'minBedrooms', value: this.selectedBedrooms }];
    that.changeLabels('Bedrooms', this.selectedBedrooms);
    setTimeout(() => {
      that.changeSearchObj(bedrooms_obj);
    }, 300);

  }

  // fetch search bathrooms obj
  selectBathrooms(id: number) {
    const that = this;
    this.selectedBathrooms = id;
    const bathrooms_obj = [{ type: 'minBathrooms', value: this.selectedBathrooms }];
    that.changeLabels('Bathrooms', this.selectedBathrooms);
    setTimeout(() => {
      that.changeSearchObj(bathrooms_obj);
    }, 300);
  }

  // fetch search parking obj
  selectParkings(id: number) {
    const that = this;
    this.selectedParkings = id;
    const parkings_obj = [{ type: 'minCarspaces', value: this.selectedParkings }];
    that.changeLabels('Parkings', this.selectedParkings);
    setTimeout(() => {
      that.changeSearchObj(parkings_obj);
    }, 300);
  }

  selectPropertyType(e, value: string) {
    const that = this;
    let search_obj = JSON.parse(localStorage.getItem('search_obj'));
    if (e.target.checked) {
      if (value === 'Any') {
        this.selectedPropertyTypes = this.propertyOptionsArray.map((res) => {
          let obj = res.value;
          return obj;
        });
        this.propertyOptionsArray = this.propertyOptionsArray.filter((res) => {
          res.checked = true;
          return res;
        });
      } else {
        if (this.selectedPropertyTypes.indexOf(value) === -1) {
          this.selectedPropertyTypes.push(value);
          this.propertyOptionsArray = this.propertyOptionsArray.map((res) => {
            if (res.value === value) {
              res.checked = true;
            }
            return res;
          });
        }
      }
    } else {
      if (value === 'Any') {
        this.selectedPropertyTypes = [];
        this.propertyOptionsArray = this.propertyOptionsArray.filter((res) => {
          res.checked = false;
          return res;
        });
      } else {
        this.selectedPropertyTypes = this.selectedPropertyTypes.filter(item => item !== value);
        this.propertyOptionsArray = this.propertyOptionsArray.map((res) => {
          if (res.value === value) {
            res.checked = false;
          }
          return res;
        });
      }
    }

    that.changeLabels('Property Type', that.selectedPropertyTypes);
    setTimeout(function () {
      search_obj['propertyTypes'] = that.selectedPropertyTypes;
      that.spinner.show('outer');
      that.dataShare.changeSearchObj(search_obj);
      localStorage.setItem('search_obj', JSON.stringify(search_obj));
    }, 1000);
  }

  // *********************** More option **********************/

  // fetch minimum land area 
  selectminLandArea(minLandVal) {
    this.selectedMinLandArea = (minLandVal !== '' || minLandVal === '0') ? parseInt(minLandVal) : 0;
    this.moreOptionsObj['minLandArea'] = this.selectedMinLandArea;
    if (this.selectedMinLandArea !== 0) {
      if (this.selectedMaxLandArea !== 0 && (this.selectedMaxLandArea < this.selectedMinLandArea)) {
        this.LandAreaErrorMsg = 'value must be less then max area';
        this.LandError = true;
        this.isSubmit = false;
      } else {
        this.LandAreaErrorMsg = '';
        this.LandError = false;
        this.isSubmit = true;
      }
    } else {
      this.LandError = false;
      this.isSubmit = true;
    }
    // this.changeLabels('More Options', this.moreOptionsObj);
    this.changeLabelsOfMoredetails('minLandArea', minLandVal);
  }

  // fetch maximum lan area
  selectmaxLandArea(maxLandVal) {
    this.selectedMaxLandArea = (maxLandVal !== '' || maxLandVal === '0') ? parseInt(maxLandVal) : 0;
    this.moreOptionsObj['maxLandArea'] = this.selectedMaxLandArea;
    if (this.selectedMaxLandArea !== 0) {
      if (this.selectedMinLandArea !== 0 && (this.selectedMinLandArea > this.selectedMaxLandArea)) {
        this.LandAreaErrorMsg = 'value must be greater then min area';
        this.LandError = true;
        this.isSubmit = false;
      } else {
        this.LandAreaErrorMsg = '';
        this.LandError = false;
        this.isSubmit = true;
      }
    } else {
      this.LandError = false;
      this.isSubmit = true;
    }
    this.changeLabelsOfMoredetails('minLandArea', maxLandVal);
  }

  // fetch search new/estabished options
  searchNewEstablished(e) {
    this.moreOptionsObj['propertyEstablishedType'] = e ? e : '';
    this.changeLabelsOfMoredetails('propertyEstablishedType', e);
    this.isSubmit = true;
  }

  selectOtherOptions = (e, value: string) => {
    console.log('checked => ', e.target.checked, value);

    this.locationOptionsArray = this.locationOptionsArray.map((res) => {
      if (res.value === value) {
        res.checked = true;
      }
      return res;
    });

    setTimeout(() => {
      const locations = this.search_obj[`locations`];
      locations[0].includeSurroundingSuburbs = e.target.checked;
      console.log('locations => ', locations);
      this.moreOptionsObj[`locations`] = locations;
      // this.changeLabelsOfMoredetails('propertyFeatures', this.selectedFeatures);
      this.isSubmit = true;
    }, 1000);

  }

  // fetch search features option
  selectFeatureType(e, value: string) {
    // this.selectedFeatures = [];
    const that = this;
    if (e.target.checked) {
      if (this.selectedFeatures.indexOf(value) === -1) {
        this.selectedFeatures.push(value);
        this.featureOptionsArray = this.featureOptionsArray.map((res) => {
          if (res.value === value) {
            res.checked = true;
          }
          return res;
        });
      }
    } else {
      this.selectedFeatures = this.selectedFeatures.filter(item => item !== value);
      this.featureOptionsArray = this.featureOptionsArray.map((res) => {
        if (res.value === value) {
          res.checked = false;
        }
        return res;
      });
    }
    setTimeout(function () {
      that.moreOptionsObj['propertyFeatures'] = that.selectedFeatures;
      that.changeLabelsOfMoredetails('propertyFeatures', that.selectedFeatures);
      that.isSubmit = true;
    }, 1000);
  }

  // fetch search keyword 
  selectKeyword(keyword: string) {
    this.moreOptionsObj['keywords'] = [keyword];
    this.changeLabelsOfMoredetails('keywords', keyword);
    this.isSubmit = true;
  }


  // sub mit more option button
  confirmMoreOptions() {
    const that = this;
    const obj = [
      { type: 'propertyFeatures', value: this.moreOptionsObj['propertyFeatures'] },
      { type: 'propertyEstablishedType', value: this.moreOptionsObj['propertyEstablishedType'] },
      { type: 'minLandArea', value: this.moreOptionsObj['minLandArea'] },
      { type: 'maxLandArea', value: this.moreOptionsObj['maxLandArea'] },
      { type: 'keywords', value: this.moreOptionsObj['keywords'] },
      { type: 'locations', value: this.moreOptionsObj[`locations`] },
    ];
    setTimeout(() => {
      that.changeSearchObj(obj);
      that.isSubmit = false;
    }, 500);
  }

  // for google autocomplete
  autoCompleteCallback1(selectedData: any) {
    const that = this;
    let locationObj = {
      region: '',
      area: '',
      includeSurroundingSuburbs: this.locationOptionsArray.find((e) => e.value === 'SearchNearbySuburbs').checked,
      postCode: '',
      state: '',
      suburb: ''
    };
    let suburbFlag = 0;
    let stateFlag = 0;
    let postCodeFlag = 0;
    if (selectedData.data && selectedData.data.address_components && selectedData.data.address_components.length > 0) {
      for (var i = 0; i < selectedData.data.address_components.length; i++) {
        var addressType = selectedData.data.address_components[i].types[0];
        if (addressType === 'postal_code') {
          var postal_code = selectedData.data.address_components[i].long_name;
          locationObj.postCode = postal_code;
          postCodeFlag = 1;
        }
        if (addressType === 'administrative_area_level_1') {
          var state = selectedData.data.address_components[i].short_name;
          locationObj.state = state;
          stateFlag = 1;
        }
        if (addressType === 'locality') {
          var city = selectedData.data.address_components[i].long_name;
          locationObj.suburb = city;
          suburbFlag = 1;
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
    setTimeout(() => {
      const searchObj = {
        listingType: that.activeType ? that.activeType : 'sale',
        locations: [locationObj],
        page: 1,
        pageSize: 10,
        type: 'PropertyListing'
      };
      that.spinner.show('outer');
      that.dataShare.changeSearchObj(searchObj);
      localStorage.setItem('search_obj', JSON.stringify(searchObj));
      if (this.currentPage !== '/property_list') {
        this.router.navigate(['/property_list']);
      }
    }, 1000);
  }

  // For Agent Listing
  autoCompleteCallback(selectedData: any) {
    const that = this;
    const agentFilter = {
      city: ''
    };
    if (selectedData && selectedData.data) {
      this.dataShare.search_Title(selectedData.data.description);
      localStorage.setItem('searchTitle', selectedData.data.description);
    }
    if (selectedData.data && selectedData.data.address_components && selectedData.data.address_components.length > 0) {
      for (const i in selectedData.data.address_components) {
        if (i) {
          const addressType = selectedData.data.address_components[i].types;
          // console.log('addressType => ', addressType);
          if (addressType.indexOf('locality') >= 0) {
            const subhurb = selectedData.data.address_components[i].long_name;
            agentFilter['city'] = subhurb;
          }
        }
      }
    }
    setTimeout(() => {
      that.spinner.show('outer');
      that.dataShare.changeAgentSearchObj(agentFilter);
      localStorage.setItem('agent_search_obj', JSON.stringify(agentFilter));
      if (this.currentPage !== '/agent_list') {
        this.router.navigate(['/agent_list']);
        // that.spinner.hide('outer');
        console.log('if => ');
      }
    }, 1000);
  }

  // for set body padding-top accroding to header
  customHeaderHandler = () => {
    let headerElement = document.getElementById('p-header');
    if (headerElement) {
      let headerHeight = headerElement.offsetHeight;
      document
        .getElementsByTagName('body')
        .item(0)
        .setAttribute('style', `padding-top:${headerHeight}px`);
    } else {
      document
        .getElementsByTagName('body')
        .item(0)
        .removeAttribute('style');
    }
  }

  // add class on filter option in responsive
  addClass() {
    if (this.is_open) {
      this.is_open = false;
      document.getElementById('filter-l').setAttribute('class', `filter-l`);
    } else {
      this.is_open = true;
      document.getElementById('filter-l').setAttribute('class', `filter-l open`);
    }
  }

  // Use for set labels when select value for filtering
  changeLabels(label, value) {
    let labels = [];
    this.labelswithvalue.map((res) => {
      if (res.label === label) {
        res.value = value;
      }
      labels.push(res);
    });
    this.labelswithvalue = labels;
  }

  changeLabelsOfMoredetails(label, value) {
    let labels = [];
    this.moreOptions_Obj.map((res) => {
      if (res.label === label) {
        res.value = value;
      }
      if (res.value.length > 0) {
        labels.push(res);
      }
    });
    this.changeLabels('More options', labels);
  }

  // Click on Tems and conditions
  onClickTerms() {
    this.clickTerms = true;
  }

  // Click on Tems and conditions
  onClickPrivacy() {
    this.clickPrivacy = true;
  }

  clickOnlogin() {
    this.clickSignup = false;
    this.service.onloginClick();
  }

  // Click on sign up form link
  clickOnSignup() {
    this.clickSignup = true;
  }

  // Click on sign up form link
  clickOnLogout() {
    this.toastr.success('Logout Successfully!', 'Success!', {
      timeOut: 3000
    });
    localStorage.removeItem("user");
    this.dataShare.getLoginUser(null);
    this.router.navigate(['/trade']);
    // this.router.navigate(['/buy']);
    this.displayLinks = true;
  }

  // use for sign up form
  clickOnFormSubmit(flag: boolean) {
    console.log('signupForm => ', this.signupForm.controls.password);
    this.form_validation = !flag;
    if (flag) {
      if (this.signupData['agreement'] == true) {
        let email = this.signupData.email;
        this.disableSubmit = true;
        const u_data = this.signupData;
        this.service.post('userRegister', {
          role_id: this.defaultRole._id,
          firstname: u_data.firstname,
          lastname: u_data.lastname,
          mobile_no: u_data.mobile_no,
          email: u_data.email,
          password: u_data.password,
          confirmPassword: u_data.conf,
          checkedStatus: true
        }).subscribe(
          response => {
            this.signupData['conf'] =
              this.signupData['agreement'] =
              this.signupData['firstname'] =
              this.signupData['lastname'] =
              this.signupData['mobile_no'] =
              this.signupData['email'] =
              this.signupData['password'] = '';
            var message = '';
            if (response) {
              if (response['code'] == 200) {
                if (!response['data']) {
                  var message = 'Unauthorised Access!';
                  this.toastr.error(message, 'Error!', { timeOut: 3000 });
                  this.disableSubmit = false;
                } else {
                  this.clickSignup = false;
                  this.toastr.success(response['message'], 'Success!', {
                    timeOut: 3000
                  });
                  // this.router.navigate(["/"]);
                  this.router.navigate(["/thank-you"]);
                }
              } else if (response['code'] == '406') {
                console.log('406 => ');
                this.toastr.warning(
                  'Congrats! Your email is already registered with us.' +
                  ' To complete registration simply Click Here to receive activation email.',
                  'Warning!', {
                  timeOut: 12000,
                  progressBar: true,
                }).onTap
                  .subscribe(() => this.toasterClickedHandler(email));

              } else {
                // message = "Something went wrong, Please try again later!";
                this.toastr.error(response['message'], 'Error!', { timeOut: 3000 });
              }
            } else {
              message = 'Something went wrong, Please try again later!';
              this.toastr.error(message, 'Error!', { timeOut: 3000 });
            }
          },
          err => {
            if (err.status == 500) {
              var message = 'Something went wrong, Please try again later!';
              if (err.error.message) {
                message = err.error.description;
              }
              this.toastr.error(message, 'Error!', { timeOut: 3000 });
              this.disableSubmit = false;
            } else if (err.status == 401 || err.status == 400) {
              var message = 'Something went wrong, Please try again later!';
              if (err.error.message) {
                message = err.error.description;
              }
              if (err.status == 400) {
                message = err.error.message;
              }
              this.toastr.error(message, 'Error!', { timeOut: 3000 });
              this.disableSubmit = false;
            } else {
              this.toastr.error('Something went wrong, Please try again later!', 'Error!', { timeOut: 3000 });
              this.disableSubmit = false;
            }
          },
          () => {
            this.disableSubmit = false;
          }
        );
      }
    }
  }

  toasterClickedHandler(value) {
    console.log('Toastr clicked');
    console.log('this.signupData[email] ==>', this.signupData['email']);
    this.service.post('resend_account_activation_mail', {
      email: value
    }).subscribe(res => {
      console.log('res => ', res);
      this.toastr.success(res['message'], 'Success!', {
        timeOut: 3000
      });
    }, err => {
      console.log('err => ', err);
      this.toastr.error(err['message'], 'Error!', { timeOut: 3000 });
    });
  }

  // Social Login
  socialLogin(socialProvider) {
    console.log('socialProvider => ', socialProvider);
    let socialPlatformProvider;
    if (socialProvider === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    if (socialPlatformProvider) {
      this.authService.signIn(socialPlatformProvider).then(
        (data) => {
          console.log('data => ', data);
          const userInfo = {
            social_provider: data.provider,
            photoUrl: data.photoUrl,
            firstname: data.firstName,
            lastname: data.lastName,
            email: data.email,
            social_token: data.authToken,
            social_id: data.id,
            role_id: this.defaultRole._id,
            name: data.name
          };
          this.service.post('socialLogin', userInfo).subscribe(response => {
            console.log('res :: socialLogin api response => ', response);
            let message = '';
            if (response) {
              if (response['code'] === 200) {
                if (!response['data']) {
                  message = 'Unauthorised Access!';
                  this.toastr.error(message, 'Error!', { timeOut: 3000 });
                } else {
                  this.clickSignup = false;
                  let loginData = {
                    data: response['data']['data'],
                    token: response['data'][`token`],
                  };
                  localStorage.setItem('user', this.EncrDecr.setEncrypt(loginData));
                  this.datashare.getLoginUser(JSON.stringify(loginData));
                  this.toastr.success('Login Successfully!', 'Success!', {
                    timeOut: 3000
                  });
                  this.router.navigate(["/thank-you"]);
                }
              } else {
                // message = "Something went wrong, Please try again later!";
                this.toastr.error(response['message'], 'Error!', { timeOut: 3000 });
              }
            } else {
              message = 'Something went wrong, Please try again later!';
              this.toastr.error(message, 'Error!', { timeOut: 3000 });
            }

          }, err => {
            console.log('err => ', err);
          });
        });
    }
  }

  onChange($event) {
    this.signupData['agreement'] = $event.target.checked;
  }

  // Use for Clear the filter data
  clearFilter() {
    this.rangeValues = [0, 5000000];
    this.labelswithvalue = [
      { label: 'Price', value: [] },
      { label: 'Property Type', value: [] },
      { label: 'Bedrooms', value: '' },
      { label: 'Bathrooms', value: '' },
      { label: 'Parkings', value: '' },
      { label: 'More options', value: [] }
    ];

    // configuration for propertyTypes
    this.propertyOptionsArray = [
      { label: 'House', checked: false, value: 'House' },
      { label: 'Apartments', checked: false, value: 'ApartmentUnitFlat' },
      { label: 'Townhouse', checked: false, value: 'Townhouse' },
      { label: 'Studio', checked: false, value: 'Studio' },
      { label: 'Rural', checked: false, value: 'Rural' },
    ];
    this.selectedPropertyTypes = [];

    this.locationOptionsArray = [
      { label: 'Search Nearby suburbs', checked: false, value: 'SearchNearbySuburbs' },
    ];

    // configuration for features
    this.featureOptionsArray = [
      { label: 'Pets allowed', checked: false, value: 'PetsAllowed' },
      { label: 'Built in wardrobes', checked: false, value: 'BuiltInWardrobes' },
      { label: 'Gas', checked: false, value: 'Gas' },
      { label: 'Garden / courtyard', checked: false, value: 'GardenCourtyard' },
      { label: 'Balcony / deck', checked: false, value: 'BalconyDeck' },
      { label: 'Internal laundry', checked: false, value: 'InternalLaundry' },
      { label: 'Study', checked: false, value: 'Study' },
      { label: 'Swimming pool', checked: false, value: 'SwimmingPool' },
      { label: 'Air conditioning', checked: false, value: 'AirConditioning' },
    ];
    this.selectedFeatures = [];

    // configuration for newEstablishedTypes
    this.newEstablishedArray = [
      { label: 'Any', value: 'Any' },
      { label: 'New Constructions', value: 'New' },
      { label: 'Established Properties', value: 'Established' },
    ];
    this.selectedPropertyEstablishedType = 'Any';

    // configuration for bedrooms, bathrooms and carparkings
    this.radioOptions = [
      { id: 0, label: 'Any' },
      { id: 1, label: '1+' },
      { id: 2, label: '2+' },
      { id: 3, label: '3+' },
      { id: 4, label: '4+' },
      { id: 5, label: '5+' }
    ];
    this.radioOptionsAprray = ['minBedrooms', 'minBathrooms', 'minCarspaces', 'minLandArea', 'maxLandArea'];
    this.selectedBedrooms = 0;
    this.selectedBathrooms = 0;
    this.selectedParkings = 0;

    // more options configuration
    this.moreOptionsObj = {
      minLandArea: 0,
      maxLandArea: 0,
      propertyEstablishedType: '',
      propertyFeatures: [],
      keywords: [],
      locations: [
        {
          region: '',
          area: '',
          includeSurroundingSuburbs: false,
          postCode: '',
          state: '',
          suburb: ''
        }
      ]
    };

    // Use for display label dynamically
    this.moreOptions_Obj = [
      { label: 'minLandArea', value: [] },
      { label: 'propertyEstablishedType', value: [] },
      { label: 'propertyFeatures', value: [] },
      { label: 'keywords', value: [] }
    ];
  }
}
