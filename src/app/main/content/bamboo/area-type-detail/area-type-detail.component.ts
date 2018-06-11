import { Component, OnInit } from '@angular/core';
import { AreaTypeService } from '../../../toolkit/server/webapi/area-type.service';

@Component({
  selector: 'app-area-type-detail',
  templateUrl: './area-type-detail.component.html',
  styleUrls: ['./area-type-detail.component.scss']
})
export class AreaTypeDetailComponent implements OnInit {

  constructor(public apiSrv: AreaTypeService) { }

  ngOnInit() {
  }

}
