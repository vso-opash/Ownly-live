import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { DataShareService } from '../shared/data-share.service';
import { PropertyService } from '../shared/property.service';
import { Subscriber } from 'rxjs';

@Injectable()
export class PropertyDetailsResolve implements Resolve<any> {
    public response = {};
    constructor(private propertyService: PropertyService, 
                private dataShare: DataShareService
                ) { }

    resolve(route: ActivatedRouteSnapshot) {
        const propertyId = route.params.id;
        console.log('\n in resolve : ', propertyId);
        return this.propertyService.getPropertyDetails(propertyId);
    }
}
