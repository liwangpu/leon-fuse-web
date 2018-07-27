import { Injectable } from '@angular/core';
import { PaginatorLaunch, IListTableColumn, IAdvanceMenuItem } from '../../share/common/page-tpls/paginator-page-tpls/paginator-refers';
import { Product } from '../../share/models/product';
import { DatePipe } from '@angular/common';
import { ProductService } from '../../share/services/webapis/product.service';
import { DialogFactoryService } from '../../share/common/factories/dialog-factory.service';
import { TranslateService } from '@ngx-translate/core';
import { AsyncHandleService } from '../../share/services/common/async-handle.service';
import { ProductLeftCategoryLaunchService } from './product-left-category-launch.service';
import { SimpleCategoryPanelComponent } from '../../share/common/factories/dialog-template/simple-category-panel/simple-category-panel.component';
import { AccountService } from '../../share/services/webapis/account.service';


@Injectable()
export class ProductPaginatorLaunchService extends PaginatorLaunch {

  createdUrl = 'app/product-detail';
  titleIcon = 'shopping_basket';
  title = 'glossary.Product';
  columnDefs: Array<IListTableColumn<Product>> = [
    { columnDef: 'icon', header: 'glossary.Icon', width: 0, cell: (data: Product) => data.icon ? data.icon : '' }
    , { columnDef: 'name', header: 'glossary.Name', width: 180, cell: (data: Product) => data.name ? data.name : '' }
    , { columnDef: 'description', header: 'glossary.Description', width: 0, cell: (data: Product) => data.description ? data.description : '' }
    , { columnDef: 'purchasePrice', header: 'glossary.PurchasePrice', width: 65, cell: (data: Product) => data.purchasePrice ? data.purchasePrice + '' : '0', hide: true }
    , { columnDef: 'partnerPrice', header: 'glossary.PartnerPrice', width: 65, cell: (data: Product) => data.partnerPrice ? data.partnerPrice + '' : '0', hide: true }
    , { columnDef: 'price', header: 'glossary.RetailPrice', width: 65, cell: (data: Product) => data.price ? data.price + '' : '0' }
    , { columnDef: 'categoryName', _columnDef: 'categoryId', header: 'glossary.Category', width: 80, cell: (data: Product) => data.categoryName ? data.categoryName : '' }
    , { columnDef: 'createdTime', header: 'glossary.CreatedTime', width: 110, cell: (data: Product) => this.datePipeTr.transform(data.createdTime, 'yyyy-MM-dd') }
  ];
  constructor(protected datePipe: DatePipe, public apiSrv: ProductService, protected dialogFac: DialogFactoryService, protected tranSrv: TranslateService, protected syncHandle: AsyncHandleService, protected leftCategorySrv: ProductLeftCategoryLaunchService, protected accountSrv: AccountService) {
    super(datePipe, syncHandle);



    let changeCategoryMenuItem: IAdvanceMenuItem = {
      icon: 'swap_horiz', name: 'button.ChangeCategory', needSelected: true, click: (selectedIds: Array<string>) => {
        let idsStr = selectedIds.join(',');
        let dialog = this.dialogFac.simpleCategorySelect(leftCategorySrv);

        dialog.afterOpen().subscribe(() => {
          let ins: SimpleCategoryPanelComponent = dialog.componentInstance.componentIns;
          ins.afterConfirm.subscribe(() => {
            let source$ = this.apiSrv.bulkChangeCategory(idsStr, ins.selectedCategoryId);
            this.syncHandle.asyncRequest(source$).subscribe(() => {
              ins.doneAsync.next();
              this.refreshData$.next();
              ins.closeDialog.next();
            }, err => {
              ins.doneAsync.next();
            });
          });
        });//afterOpen
      }
    };
    this.advanceMenuItems.push(changeCategoryMenuItem);


    // let uploadCategoryMenuItem: IAdvanceMenuItem = {
    //   icon: 'swap_vert', name: 'button.BulkCategory', click: () => {

    //     let dialogTransAsync = () => {
    //       return new Promise((resolve) => {
    //         this.tranSrv.get('tips.UploadCategoryByCSV').subscribe(msg => {
    //           resolve(msg);
    //         });
    //       });//promise
    //     };//dialogTransAsync

    //     let showDialogAsync = (title) => {
    //       return new Promise((resolve) => {
    //         let dialog = this.dialogFac.simpleCsvUpload(title, { width: '450px', height: '550px', uploadUrl: 'products/ImportProductAndCategory', templateCsvUrl: 'products/ProductAndCategoryImportTemplate' });
    //         dialog.afterOpen().first().subscribe(() => {
    //           let ins = (dialog.componentInstance.componentIns as SimpleCsvUploadComponent);
    //           ins.doneAsync.subscribe((state) => {
    //             if (state) {
    //               ins.closeDialog.next();
    //             }
    //           });
    //         });
    //       });//promise
    //     };//showDialogAsync

    //     dialogTransAsync().then(showDialogAsync);

    //   }
    // };
    // this.advanceMenuItems.push(uploadCategoryMenuItem);



  }//constructor

}
