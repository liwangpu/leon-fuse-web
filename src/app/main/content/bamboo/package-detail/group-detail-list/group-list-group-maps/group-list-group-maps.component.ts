import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PackageService } from '../../../../../toolkit/server/webapi/package.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ProductGroup } from '../../../../../toolkit/models/product-group';
import { Package } from '../../../../../toolkit/models/package';
import { PackageDetailMdService } from '../../package-detail-md.service';
import { DialogFactoryService } from '../../../../../toolkit/common/factory/dialog-factory.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '../../../../../toolkit/common/services/snackbar.service';
import { SimpleMessageContentComponent } from '../../../../../toolkit/common/factory/dialog-template/simple-message-content/simple-message-content.component';
import { merge } from 'rxjs/observable/merge';
import { last, map, distinctUntilChanged } from 'rxjs/operators';
import { concat } from 'rxjs/observable/concat';
@Component({
  selector: 'app-package-detail-group-list-group-maps',
  templateUrl: './group-list-group-maps.component.html',
  styleUrls: ['./group-list-group-maps.component.scss']
})
export class GroupListGroupMapsComponent implements OnInit, OnDestroy {

  groupDatas$ = new BehaviorSubject<Array<ProductGroup>>([]);
  productGroups: Observable<Array<ProductGroup>>;
  @Input() areaId: string;
  destroy$ = new Subject<boolean>();
  constructor(protected packageSrv: PackageService, protected mdSrv: PackageDetailMdService, protected dialogFac: DialogFactoryService, private tranSrv: TranslateService, private snackBarSrv: SnackbarService) {
    this.productGroups = this.groupDatas$.takeUntil(this.destroy$);
  }//constructor

  ngOnInit() {

    //订阅区域面板区域切换事件
    let obs1 = this.mdSrv.afterAreaSelected$.takeUntil(this.destroy$).pipe(map(x => {
      let pck = this.packageSrv.editData$.getValue() as Package;
      let areas = pck.contentIns ? pck.contentIns.areas : [];
      let area = areas.filter(n => n.id == this.mdSrv.afterAreaSelected$.getValue())[0];
      return area && area.groupsMapIns ? area.groupsMapIns : [];
    }));
    // //订阅套餐基本信息修改后更新事件
    let obs2 = this.packageSrv.editData$.takeUntil(this.destroy$).pipe(map(x => {
      let pck = this.packageSrv.editData$.getValue() as Package;
      let areas = pck.contentIns ? pck.contentIns.areas : [];
      let area = areas.filter(n => n.id == this.mdSrv.afterAreaSelected$.getValue())[0];
      return area && area.groupsMapIns ? area.groupsMapIns : [];
    }));
    merge(obs1, obs2).pipe(distinctUntilChanged()).subscribe(datas => {
      this.groupDatas$.next(datas);
    });
  }//ngOnInit

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }//ngOnDestroy


  trackProductGroup(data?: ProductGroup): string | undefined {
    return data ? data.id : '';
  }//

  deleteGroup(data: { id: string, name: string }) {
    this.tranSrv.get('message.DeleteConfirm', { value: data.name }).subscribe(tips => {
      let dialog = this.dialogFac.simpleConfirm(tips);
      dialog.afterOpen().subscribe(_ => {
        let ins = dialog.componentInstance.componentIns as SimpleMessageContentComponent;
        ins.afterConfirm.subscribe(_ => {
          let model = { areaId: this.mdSrv.afterAreaSelected$.getValue(), packageId: this.packageSrv.editData$.getValue().id, productGroupId: data.id };
          //
          this.packageSrv.deleteProductGroup(model).subscribe(_ => {
            this.tranSrv.get('message.SaveSuccessfully').subscribe(msg => {
              this.snackBarSrv.simpleBar(msg);
            });
          }, err => {
            this.tranSrv.get('message.OperationError', { value: err }).subscribe(msg => {
              this.snackBarSrv.simpleBar(msg);
            });
          }, () => {
            ins.doneAsync.next();
            ins.closeDialog.next();
          });
        });
      });//afterOpen
    });//get
  }//deleteGroup

}
