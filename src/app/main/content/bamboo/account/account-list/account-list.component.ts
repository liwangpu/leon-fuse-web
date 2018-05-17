import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AccountDetailComponent } from "../account-detail/account-detail.component";
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { PaginatorStore } from "../../../../toolkit/common/classes/paginator-store";
import { Account } from "../../../../toolkit/models/account";
import { AccountService } from "../../../../toolkit/server/webapi/account.service";
import { MatSort } from '@angular/material';
import { DessertService } from "../../../services/dessert.service";
import { DialogService } from "../../../../toolkit/common/services/dialog.service";
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from "../../../../toolkit/common/services/snackbar.service";
import { AccountTypeEnums } from '../../../../toolkit/enums/enums';
import { AccountMdService } from '../account-md.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [AccountMdService]
})
export class AccountListComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('departmentIdFilter') departmentIdFilter: ElementRef;
  // @Input() departmentId: string;
  dataSource: PaginatorStore<Account> | null;
  displayedColumns = ['icon', 'name', 'phone', 'mail', 'buttons'];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  destroy$: Subject<boolean> = new Subject();
  constructor(private accountSrv: AccountService, public dialog: MatDialog, private dessertSrv: DessertService, private dialogSrv: DialogService, private transSrv: TranslateService, private snackBarSrv: SnackbarService, private accountMdSrv: AccountMdService) { }

  ngOnInit() {
    this.dataSource = new PaginatorStore({ service: this.accountSrv, sort: this.sort });

    this.accountMdSrv.afterDepartmentChange.takeUntil(this.destroy$).subscribe(depId => {
      this.dataSource.filter = depId;
    });
  }//ngOnInit

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

  }//ngOnDestroy

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['departmentId']) {
    //   console.log(111, 'depId', changes['departmentId']);
    // }
  }

  refresh() {
    this.dataSource.refresh();
  }

  editAccount(acc: Account) {
    this.accountSrv.getById(acc.id).first().subscribe(rdata => {
      rdata.organizationId = this.dessertSrv.organId;
      rdata.type = AccountTypeEnums.organMember;
      if (!rdata.id)
        rdata.name = '用户';
      let ndialog = this.dialog.open(AccountDetailComponent, {
        panelClass: 'contact-form-dialog',
        data: {
          account: rdata
        }
      });

      const onSaveDepartmetnObs = ndialog.componentInstance.onSave.first().subscribe(res => {
        this.dataSource.refresh();
      });

      ndialog.afterClosed().first().subscribe(() => {
        onSaveDepartmetnObs.unsubscribe();
      });
    });

  }//editAccount

  deleteAccount(acc: Account) {

    let confirmAsync = () => {
      return new Promise((resolve, reject) => {
        this.transSrv.get('message.DeleteConfirm', { value: acc.name }).subscribe((msg) => {
          let dial = this.dialogSrv.confirmDialog(msg);
          const obs = dial.componentInstance.onConfirm.subscribe(() => {
            resolve();
          });
          dial.afterClosed().subscribe(() => {
            obs.unsubscribe();
          });
        });
      });
    };//confirmAsync

    let deleteAsync = () => {
      return new Promise((resolve, reject) => {
        this.accountSrv.delete(acc.id).subscribe(() => {
          resolve();
        }, err => {
          reject(err);
        });
      });
    };//deleteAsync

    confirmAsync().then(deleteAsync).then(() => {
      this.transSrv.get('message.DeleteSuccessfully').subscribe(msg => {
        this.dataSource.refresh();
        this.snackBarSrv.simpleBar(msg);
      });
    }).catch(err => {
      this.transSrv.get('message.DeleteError', { value: err }).subscribe(msg => {
        this.snackBarSrv.simpleBar(msg);
      });
    });

  }//deleteAccount
}
