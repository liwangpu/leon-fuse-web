import { Injectable } from '@angular/core';
import { ApiService, Paging, IQuery } from './api.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../config/config.service';
import { Organization } from '../../models/organization';
import { Observable } from 'rxjs/Observable';
import { Account } from "../../models/account";
@Injectable()
export class OrganService extends ApiService<Organization> {
    constructor(private http: HttpClient, private config: ConfigService) {
        super(http, config);
        this.uriPart = 'organ';
    }

    /**
     * 根据id获取组织信息
     * @param id 
     */
    getById(id: string | number): Observable<Organization> {
        if (!id)
            return Observable.of(new Organization());
        return super.getEntity(id);
    }

    getOwner(id: string | number): Observable<Account> {
        if (!id)
            return Observable.of(new Account());
        return this.http.get<Account>(`${this.uri}/owner?organId=${id}`, { headers: this.header });
    }

    /**
     * 创建组织信息
     * @param entity 
     */
    create(entity: Organization): Observable<Organization> {
        return super.createEntity(entity);
    }

    /**
     * 更新组织信息
     * @param entity 
     */
    update(entity: Organization): Observable<Organization> {
        return super.updateEntity(entity);
    }

    /**
     * 查询组织信息
     * @param query 
     */
    query(query: IQuery): Observable<Paging<Organization>> {
        return super.queryEntities(query);
    }


}