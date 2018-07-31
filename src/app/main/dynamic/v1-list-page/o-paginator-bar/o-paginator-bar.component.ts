import { Component, OnInit, OnDestroy } from '@angular/core';
import { V1ListPageScheduleService } from '../v1-list-page-schedule.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-v1-list-page-o-paginator-bar',
  templateUrl: './o-paginator-bar.component.html',
  styleUrls: ['./o-paginator-bar.component.scss']
})
export class OPaginatorBarComponent implements OnInit, OnDestroy {

  datasTotal = 0;
  pageSize = 0;
  pageSizeOptions: Array<number>;
  destroy$ = new Subject<boolean>();
  constructor(public scheduleSrv: V1ListPageScheduleService) { }

  ngOnInit() {
    //订阅分页选项改变事件
    this.scheduleSrv.pageSizeOptions$.pipe(takeUntil(this.destroy$)).subscribe(opt => {
      this.pageSizeOptions = opt;
      if (opt.length > 0)
        this.pageSize = opt[0];
    });
    //订阅分页数据改变事件
    this.scheduleSrv.datas$.pipe(takeUntil(this.destroy$)).subscribe(datas => {
      this.datasTotal = datas.total;
    });
  }//ngOnInit

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }//ngOnDestroy

  pageChange(param: PageEvent) {
    this.scheduleSrv.pageParam = param;
  }//pageChange
}
