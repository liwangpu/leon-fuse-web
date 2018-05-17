import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StaticmeshDetailMdService } from '../staticmesh-detail-md.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StaticmeshService } from '../../../../toolkit/server/webapi/staticmesh.service';
import { SnackbarService } from '../../../../toolkit/common/services/snackbar.service';
import { FileAsset } from '../../../../toolkit/models/fileasset';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-static-mesh-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {

  iconUploadUrl: string;
  detailForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private formBuilder: FormBuilder, public detaiMdSrv: StaticmeshDetailMdService, private staticMeshSrv: StaticmeshService, private tranSrv: TranslateService, private snackBarSrv: SnackbarService, public pathSrv: PathService) {
    this.detailForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.maxLength(200)]]
    });
    this.iconUploadUrl = this.staticMeshSrv.uri + '/changeICon';
  }//constructor

  ngOnInit() {
    this.detailForm.patchValue(this.detaiMdSrv.currentStaticMesh);
  }//ngOnInit

  submit() {
    let saveProdAsync = () => {
      return new Promise((resolve) => {
        let vl = this.detailForm.value;
        vl.iconAssetId = this.detaiMdSrv.currentStaticMesh.iconAssetId;
        this.staticMeshSrv.update(this.detailForm.value).first().subscribe(resOrder => {
          this.detaiMdSrv.currentStaticMesh = resOrder;
          this.detaiMdSrv.afterEdit$.next();
          this.detailForm.patchValue({ id: resOrder.id });
          resolve({ k: 'message.SaveSuccessfully' });
        }, err => {
          resolve({ k: 'message.OperationError', v: { value: err } });
        });
      });//promise
    };//saveProdAsync

    let transAsync = (mobj: { k: string, v: any }) => {
      return new Promise((resolve) => {
        this.tranSrv.get(mobj.k, mobj.v).first().subscribe(msg => {
          resolve(msg);
        });
      });//promise
    };//transAsync

    saveProdAsync().then(transAsync).then(msg => {
      this.snackBarSrv.simpleBar(msg as string);
    });

  }//submit

  afterIConChange(ass: FileAsset) {
    this.detaiMdSrv.currentStaticMesh.icon = ass.url;
    this.detaiMdSrv.currentStaticMesh.iconAssetId = ass.id;
  }//afterIConChange
}
