import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from "../../../../toolkit/models/account";
import { AccountService } from "../../../../toolkit/server/webapi/account.service";
import { SnackbarService } from "../../../../toolkit/common/services/snackbar.service";
import { DepartmentService } from "../../../../toolkit/server/webapi/department.service";
import { Department } from "../../../../toolkit/models/department";
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {
  onSave: EventEmitter<Account> = new EventEmitter();
  event: CalendarEvent;
  dialogTitle: string;
  accountForm: FormGroup;
  account: Account;
  hidePassword = true;
  hideDepartment: boolean;
  departments: Array<Department> = [];
  constructor(private departmentSrv: DepartmentService, public dialogRef: MatDialogRef<AccountDetailComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private formBuilder: FormBuilder, private accountSrv: AccountService, private snackBarSrv: SnackbarService, private tranSrv: TranslateService) {
    this.account = this.data.account;
    this.accountForm = this.createAccountForm();
    this.getDepartment();
  }

  ngOnInit() {
    this.accountForm.patchValue(this.account);
  }

  getDepartment() {
    this.departmentSrv.getByOrgan(this.account.organizationId).subscribe(res => {
      this.departments = res;
    });
  }//getDepartment

  createAccountForm() {
    return this.formBuilder.group({
      id: [''],
      organizationId: [''],
      departmentId: [''],
      type: [''],
      name: [''],
      mail: ['', [Validators.required]],
      phone: [''],
      password: [''],
      location: [''],
      expireTime: [new Date(), [Validators.required]],
      activationTime: [new Date(), [Validators.required]]
    });
  }//createAccountForm

  onSubmit() {
    let acc = this.accountForm.value;
    let saveAccountAsync = () => {
      return new Promise((resolve, reject) => {
        this.accountSrv.update(acc).subscribe(resAccount => {
          resAccount.password = acc.password;
          resAccount.departmentId = acc.departmentId;
          this.accountForm.patchValue(resAccount);
          this.onSave.next(resAccount);
          resolve({ k: 'message.SaveSuccessfully' });
        }, err => {
          resolve({ k: 'message.OperationError', v: { value: err } });
        });
      });//promise
    };//saveAccountAsync

    let tranAsync = (msgObj: { k: string, v: any }) => {
      return new Promise((resolve, reject) => {
        this.tranSrv.get(msgObj.k, msgObj.v).subscribe(resMsg => {
          resolve(resMsg);
        });
      });//promise
    };//tranAsync


    saveAccountAsync().then(tranAsync).then((msg: string) => {
      this.snackBarSrv.simpleBar(msg);
    });
  }//onSubmit


}
