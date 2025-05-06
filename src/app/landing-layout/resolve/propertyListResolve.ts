import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { DataShareService } from '../shared/data-share.service';
import { PropertyService } from '../shared/property.service';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class PropertyListResolve implements Resolve<any> {
    public currentPage = '';
    constructor(private propertyService: PropertyService,
        private dataShare: DataShareService,
        private toastr: ToastrService,
        private router: Router) { }

    resolve() {
        this.dataShare.currentPage.subscribe(res => {
            this.currentPage = res;
        });
        let searchData = {};
        this.dataShare.currentsearchObj.subscribe((res) => {
            searchData = res;
        });
        let data = searchData ? searchData : JSON.parse(localStorage.getItem('search_obj'));

        if (!data) {
            this.toastr.info('Please Enter Keyword to Search', '');
            this.router.navigate(['/trade']);
            // this.router.navigate(['/buy']);
        } else {
            if (!data['locations'] || data['locations'] == undefined || data['locations'] == null) {
                this.toastr.info('Please Enter Keyword to Search', '');
                this.router.navigate(['/trade']);
                // this.router.navigate(['/buy']);
            } else {
                var searchObj = {
                    listingType: data ? data['listingType'] : 'Sale',
                    locations: data['locations'],
                    page: 1,
                    pageSize: 10,
                    type: 'PropertyListing'
                }
                localStorage.setItem('search_obj', JSON.stringify(searchObj));
                return this.propertyService.getProperties(searchObj);
            }
        }
    }
}
