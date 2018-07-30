import { IListableService } from "../../../services/webapis/ilistableService";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { Ilistable } from "../../../models/ilistable";
import { DatePipe } from "@angular/common";
import { DataSource } from "@angular/cdk/table";
import { AsyncHandleService } from "../../../services/common/async-handle.service";

/**
 * 列表模板页启动器
 */
export abstract class PaginatorLaunch {
    abstract createdUrl: string;
    abstract titleIcon: string;
    abstract title: string;
    abstract apiSrv: IListableService<Ilistable>;
    refreshData$: Subject<void> = new Subject();
    notNeedCreate = false;//不需要前端创建数据
    displayMode: ListDisplayModeEnum = ListDisplayModeEnum.List;
    pageSizeOption = [25, 50, 100, 500];//默认分页按钮参数
    advanceMenuItems: Array<IAdvanceMenuItem> = [];
    itemManageMenu: IListableRecordMenu;
    columnDefs: Array<IListTableColumn<Ilistable>> = [
        { columnDef: 'icon', header: 'glossary.Icon', width: 0, cell: (data: Ilistable) => data.icon ? data.icon : '' }
        , { columnDef: 'name', header: 'glossary.Name', width: 180, cell: (data: Ilistable) => data.name ? data.name : '' }
        , { columnDef: 'description', header: 'glossary.Description', width: 0, cell: (data: Ilistable) => data.description ? data.description : '' }
        , { columnDef: 'createdTime', header: 'glossary.CreatedTime', width: 110, cell: (data: Ilistable) => this.datePipeTr.transform(data.createdTime, 'yyyy-MM-dd') }
    ];
    enableDisplayModes = [1, 2];//页面可用的展示模式
    createdAction: { icon?: string, title?: string, onClick: Function };
    showHideColumn$ = new BehaviorSubject<Array<string>>([]);//展示隐藏列
    constructor(protected datePipeTr: DatePipe, protected syncHandle: AsyncHandleService) {

    }//constructor


    /*************为了便利,提供一些常用的高级按钮******************/
    /**
     * 分享数据按钮
     */
    shareDataMenuItem: IAdvanceMenuItem = { icon: 'share', name: 'button.Share', needSelected: true, click: (ids: Array<string>) => { this._shares(ids); } };
    cancelShareDataMenuItem: IAdvanceMenuItem = { icon: 'share', name: 'button.CancelShare', needSelected: true, click: (ids: Array<string>) => { this._cancelShares(ids); } };

    /**
     * 分享数据
     */
    private _shares(ids: Array<string>) {
        let source$ = this.apiSrv.shareDatas(ids);
        this.syncHandle.asyncRequest(source$).subscribe(_ => {
            this.refreshData$.next();
        });
    }//shareSolutions

    /**
     * 取消分享
     * @param ids 
     */
    private _cancelShares(ids: Array<string>) {
        let source$ = this.apiSrv.cancelShareDatas(ids);
        this.syncHandle.asyncRequest(source$).subscribe(_ => {
            this.refreshData$.next();
        });
    }//shareSolutions

}

/**
 * 列表页面的显示模式
 */
export enum ListDisplayModeEnum {
    /**
     * 列
     */
    List = 1,
    /**
     * 缩略图
     */
    Litimg = 2,
    /**
     * 产品替换组特定card item
     */
    ProductReplaceGroup = 31
}


export interface IAdvanceMenuItem {
    icon: string;//icon name
    name: string;//按钮的名字 经过translate
    needSelected?: boolean;//按钮是否需要选中项
    needPermission?: boolean;//是否需要权限
    click: Function;
}

export interface IListTableColumn<TData> {
    _columnDef?: string;//用来排序的字段
    columnDef: string;
    header: string;
    width?: number;
    translate?: boolean;
    cell(data: TData): string;
    hide?: boolean;
}


export interface IListableRecordMenu {
    name?: string;
    icon?: string;
    items: Array<IListableRecordMenuItem>;
    handle?: any;
}

export interface IListableRecordMenuItem {
    name: string;
    icon: string;
    click: (data: Ilistable) => void;
}

export interface IPageChangeParam {
    length: number;
    pageIndex: number;
    pageSize: number;
}

export class CustomDataSource extends DataSource<any> {

    _dataSubject = new BehaviorSubject<Array<{ seqno: number }>>([]);

    connect(): Observable<Array<{ seqno: number }>> {
        return this._dataSubject;
    }

    disconnect() { }
}