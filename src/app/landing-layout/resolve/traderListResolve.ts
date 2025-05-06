import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CrudService } from '../shared/crud.service';

@Injectable()
export class TraderListResolve implements Resolve<any> {

    constructor(private service: CrudService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.service.post('tradersList', {});
    }
}
