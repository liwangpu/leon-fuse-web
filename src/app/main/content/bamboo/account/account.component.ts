import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '../../../../core/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { AccountDetailComponent } from "./account-detail/account-detail.component";
import { Account } from "../../../toolkit/models/account";
import { AccountTypeEnums } from '../../../toolkit/enums/enums';
import { DessertService } from "../../services/dessert.service";
import { MomentService } from "../../../toolkit/common/services/moment.service";
import { AccountListComponent } from "./account-list/account-list.component";
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AccountComponent implements OnInit {
  dialogRef: any;
  selectedDepId = 'all';
  @ViewChild('accList') accList: AccountListComponent;
  constructor(public dialog: MatDialog, private dessertSrv: DessertService, private momentSrv: MomentService) { }

  ngOnInit() {
  }

  newAccount() {
    let account = new Account();
    account.organizationId = this.dessertSrv.organId;
    account.type = AccountTypeEnums.organMember;
    account.name = '用户';
    account.activationTime = this.momentSrv.addDaysTransform(new Date(), -1, 'yyyy-MM-dd');
    account.expireTime = this.momentSrv.addYearsTransform(new Date(), 10, 'yyyy-MM-dd');
    let dial = this.dialog.open(AccountDetailComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        account: account
      }
    });

    const obs = dial.componentInstance.onSave.subscribe((res) => {
      // this.dataSource.refresh();
      this.accList.refresh();
    });
    dial.afterClosed().subscribe(() => {
      obs.unsubscribe();
    });
  }//newAccount


}
