import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ListDisplayModeEnum } from '../../paginator-common-tpls.component';
import { PaginatorCommonMdService } from '../../paginator-common-md.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { IPageChangeParam } from '../../paging-bar/paging-bar.component';
import { Ilistable } from '../../../../../../toolkit/models/ilistable';
import { Router } from '@angular/router';
import { Sort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-commom-paging-table-list-content',
  templateUrl: './table-list-content.component.html',
  styleUrls: ['./table-list-content.component.scss']
})
export class TableListContentComponent implements OnInit {

  columnDefReady = false;
  selectedItem: Array<string> = [];
  allSelected = false;
  destroy$: Subject<boolean> = new Subject();


  // displayedColumns = [];
  // displayedColumns = this.columns.map(c => c.columnDef);
  // dataSource = new CustomDataSource();
  dataStore = new CustomDataSource();

  // get displayedColumns() {
  //   return this.mdSrv.columnDefs.map(x => x.columnDef).filter(x => x);
  // }\

  // displayedColumns = [
  //   // { columnDef: 'seqno', header: 'glossary.SeqNO', cell: (data) => { return `${data.seqno}`; } }
  //   , { columnDef: 'icon', header: '', cell: (data) => { return `${data.icon}`; } }
  //   , { columnDef: 'name', header: 'glossary.Name', cell: (data) => { return `${data.name}`; } }
  //   , { columnDef: 'description', header: 'glossary.Description', cell: (data) => { return `${data.description}`; } },
  //   , { columnDef: 'createdTime', header: 'glossary.CreatedTime', cell: (data) => { return `${data.createdTime}`; } }
  // ].map(x=>x.columnDef);
  // columns = [
  //   { columnDef: 'icon', header: 'No.', cell: (element: Ilistable) => `${element.icon}` },
  //   { columnDef: 'name', header: 'Name', cell: (element: Ilistable) => `${element.name}` },
  //   { columnDef: 'weight', header: 'Weight', cell: (element: Ilistable) => `${element.description}` },
  //   { columnDef: 'symbol', header: 'Symbol', cell: (element: Ilistable) => `${element.createdTime}` },
  // ];

  // displayedColumns = this.columns.map(c => c.columnDef);
  columns = [
    { columnDef: 'position', header: 'No.',    cell: (element: Element) => `${element.position}` },
    { columnDef: 'name',     header: 'Name',   cell: (element: Element) => `${element.name}`     },
    { columnDef: 'weight',   header: 'Weight', cell: (element: Element) => `${element.weight}`   },
    { columnDef: 'symbol',   header: 'Symbol', cell: (element: Element) => `${element.symbol}`   },
  ];

  displayedColumns = this.columns.map(c => c.columnDef);

  constructor(public mdSrv: PaginatorCommonMdService, public router: Router) {


    this.mdSrv.afterDataRefresh$.takeUntil(this.destroy$).subscribe(() => {
      this.columnDefReady = true;
      // this.dataStore._dataSubject.next(this.mdSrv.cacheData);
      this.dataStore._dataSubject.next(data);
      console.log('999000', this.mdSrv.cacheData);
    });
    // setTimeout(() => {
    // this.displayedColumns = this.columns.map(c => c.columnDef);
    // this.dataSource.mydata = data;
    // }, 2000);

    // this.dataSource._dataSubject.next(data);

    //订阅全选|反选事件
    this.mdSrv.allSelect$.takeUntil(this.destroy$).subscribe(select => {
      this.allSelected = select;
      if (select) {
        this.selectedItem = this.mdSrv.cacheData.map(x => x.id);
        this.mdSrv.selectedItems = this.selectedItem;
      }
      else {
        this.selectedItem = [];
        this.mdSrv.selectedItems = [];
      }
    });//
    //订阅查看|选择模式
    this.mdSrv.selectMode$.takeUntil(this.destroy$).subscribe(selectMode => {
      this.allSelected = !selectMode;
    });//
  }//constructor

  ngOnInit() {
    // console.log('999000', this.displayedColumns,this.mdSrv.cacheData);
    // this.columnDefReady = true;
    // setTimeout(() => {

    // }, 3000);
    // this.displayedColumns = this.mdSrv.columnDefs.map(x => x.columnDef);
    // console.log('table ', this.tableListCt);
    // this.tableListCt.addRowDef()

    //订阅选中项事件,因为有可能列表界面会删除选中项,删除后content如果不订阅,就会出现之前删除的项id又被拼接上来
    this.mdSrv.itemSelected$.takeUntil(this.destroy$).subscribe(arr => {
      this.selectedItem = arr;
    });//
  }//ngOnInit

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }//ngOnDestroy

  rowSelect(id: any) {
    // console.log('onCheckBoxSelect', row);
    if (this.mdSrv.selectMode)
      return;
    this.router.navigate([this.mdSrv.createdUrl, id]);
  }//rowSelect

  onCheckBoxSelect(checked: boolean, id: string) {
    let exist = this.selectedItem.some(x => x == id);
    if (checked) {
      if (!exist)
        this.selectedItem.push(id);
    }
    else {
      if (exist) {
        for (let idx = this.selectedItem.length - 1; idx >= 0; idx--) {
          if (this.selectedItem[idx] == id) {
            this.selectedItem[idx] = undefined;
          }
        }//for
      }//if
    }
    this.mdSrv.selectedItems = this.selectedItem;
  }//onCheckBoxSelect

  sortData(sort: Sort) {
    this.mdSrv.sortData = { orderBy: sort.active, desc: sort.direction === 'desc' };
  }//sortData
}

// export class CustomDataSource extends DataSource<any> {

//   _dataSubject = new BehaviorSubject<Array<Ilistable>>([]);

//   connect(): Observable<Ilistable[]> {
//     return this._dataSubject.map(rdata => {
//       return rdata;
//     });
//   }

//   disconnect() { }
// }

export class CustomDataSource extends DataSource<any> {

  _dataSubject = new BehaviorSubject<Array<Element>>([]);

  connect(): Observable<Array<Element>> {
    return this._dataSubject.map(rdata => {
      return rdata;
    });
  }

  disconnect() { }
}

class Element {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const data: Element[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  // { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  // { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  // { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  // { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  // { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  // { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  // { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  // { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  // { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  // { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  // { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  // { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  // { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  // { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  // { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  // { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  // { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  // { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];