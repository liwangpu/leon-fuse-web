import { OnInit, OnDestroy } from "../../../../../../../node_modules/@angular/core";
import { IEntity } from "../../../../models/ientity";
import { Observable, Subject, of } from "../../../../../../../node_modules/rxjs";
import { V1ListPageScheduleService } from "../v1-list-page-schedule.service";

export class OContentBase implements OnInit, OnDestroy {

    datas: Observable<Array<IEntity>>;
    destroy$ = new Subject<boolean>();
    constructor(protected scheduleSrv: V1ListPageScheduleService) {

    }//constructor

    ngOnInit(): void {
        //订阅列表数据更新
        this.scheduleSrv.datas$.subscribe(datas => {
            this.datas = of(datas.data) as Observable<Array<IEntity>>;
        });
    }//ngOnInit

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }//ngOnDestroy
}