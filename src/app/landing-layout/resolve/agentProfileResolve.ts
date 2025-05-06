import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CrudService } from '../shared/crud.service';
import { async } from '@angular/core/testing';

@Injectable()
export class AgentProfileResolve implements Resolve<any> {

    constructor(private service: CrudService) { }

    resolve(route: ActivatedRouteSnapshot) {
        let data = [];
        data['ProfileData'] = this.service.agentProfile('getAgentProfile', route.params.agent_id);
        data['UserReview'] = this.service.get(`getUserReview/${route.params.agent_id}`);
        data['AllReview'] = this.service.get(`getTraderAllReviews/${route.params.agent_id}`);
        // data['JobHistory'] = this.service.post(`tradersJobHistory`, { agent_id: route.params.agent_id });
        return data;
    }
}
