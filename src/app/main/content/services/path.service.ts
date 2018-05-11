import { Injectable } from '@angular/core';
import { ConfigService } from "../../toolkit/config/config.service";

/**
 * 资源路径帮助服务类
 */
@Injectable()
export class PathService {
    constructor(private cfgSrv: ConfigService) {

    }

    /**
     * 将资源文件路径指向服务器路径
     * @param url 
     */
    redirectServerUrl(url?: string): string {
        if (url) {
            let urlTrans = `/${url}`.replace(/\/+/g, '/');
            let path = this.cfgSrv.serverBase + urlTrans;
            return path;
        }
        return '';
    }

}