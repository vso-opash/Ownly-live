import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CrudService } from '../shared/crud.service';
import { async } from '@angular/core/testing';

@Injectable()
export class TraderProfileResolve implements Resolve<any> {

    constructor(private service: CrudService) { }

    resolve(route: ActivatedRouteSnapshot) {
        let data = [];
        data['ProfileData'] = this.service.traderProfile('getUserDetails', route.params.trader_id);
        data['UserReview'] = this.service.get(`getUserReview/${route.params.trader_id}`);
        data['AllReview'] = this.service.get(`getTraderAllReviews/${route.params.trader_id}`);
        data['JobHistory'] = this.service.post(`tradersJobHistory`, { trader_id: route.params.trader_id });
        return data;
    }
}
