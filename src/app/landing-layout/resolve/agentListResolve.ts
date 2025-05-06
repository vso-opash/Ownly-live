import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { CrudService } from '../shared/crud.service';
import { DataShareService } from '../shared/data-share.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AgentListResolve implements Resolve<any> {

    constructor(
        private service: CrudService,
        private dataShare: DataShareService,
        private toastr: ToastrService,
        private router: Router
    ) { }

    resolve() {
        let searchData = {};
        this.dataShare.currentAgentsearchObj.subscribe((res) => {
            console.log('res :: agentResolve=> ', res);
            searchData = res;
        });
        let data = searchData ? searchData : JSON.parse(localStorage.getItem('agent_search_obj'));
        console.log('data => ', data);
        if (!data) {
            this.toastr.info('Please Enter Keyword to Search', '');
            this.router.navigate(['/trade']);
        } else {
            if (!data['city'] || data['city'] == undefined || data['city'] == null) {
                this.toastr.info('Please Enter Keyword to Search', '');
                this.router.navigate(['/trade']);
            } else {
                localStorage.setItem('agent_search_obj', JSON.stringify(data));
                return this.service.post('agentsListWithSearch', data);
            }
        }
    }
}
