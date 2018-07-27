import { Injectable } from '@angular/core';
import { MapService } from '../../share/services/webapis/map.service';
import { DatePipe } from '@angular/common';
import { AsyncHandleService } from '../../share/services/common/async-handle.service';
import { PaginatorLaunch } from '../../share/common/page-tpls/paginator-page-tpls/paginator-refers';

@Injectable()
export class MapPaginatorLaunchService extends PaginatorLaunch {

  createdUrl = 'app/map-detail';
  titleIcon = 'map';
  title = 'glossary.Map';
  constructor(public apiSrv: MapService, protected datePipe: DatePipe, protected syncHandle: AsyncHandleService) {
    super(datePipe, syncHandle);
  }//constructor
}
