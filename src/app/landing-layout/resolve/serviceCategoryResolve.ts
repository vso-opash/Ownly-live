import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CrudService } from '../shared/crud.service';


@Injectable()
export class ServiceCategoryResolve implements Resolve<any> {
    public response = {};
    constructor(private all: CrudService) { }

    resolve() {
        return this.all.get('getServiceCategory');
    }
}
