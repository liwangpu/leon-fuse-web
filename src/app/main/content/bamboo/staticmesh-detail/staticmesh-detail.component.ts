import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { StaticmeshDetailMdService } from './staticmesh-detail-md.service';
import { StaticMesh } from '../../../toolkit/models/staticmesh';
import { ActivatedRoute } from '@angular/router';
import { PathService } from '../../services/path.service';

@Component({
  selector: 'app-staticmesh-detail',
  templateUrl: './staticmesh-detail.component.html',
  styleUrls: ['./staticmesh-detail.component.scss'],
  providers: [StaticmeshDetailMdService]
})
export class StaticmeshDetailComponent implements OnInit, OnDestroy {

  staticmeshName: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(public detailMdSrv: StaticmeshDetailMdService, public route: ActivatedRoute, public pathSrv: PathService) {
    let tmp = this.route.snapshot.data.entity;
    this.detailMdSrv.currentStaticMesh = tmp ? tmp : new StaticMesh();

    //订阅方案信息保存事件
    this.detailMdSrv.afterEdit$.takeUntil(this.destroy$).subscribe(() => {
      this.staticmeshName = this.detailMdSrv.currentStaticMesh.name;
    });
  }

  ngOnInit() {
    this.staticmeshName = this.detailMdSrv.currentStaticMesh.name;
  }//ngOnInit

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }//ngOnDestroy

}
