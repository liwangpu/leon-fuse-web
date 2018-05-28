import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FuseConfigService } from '../../core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from "../toolkit/server/webapi/auth.service";
import { FuseNavigationService } from "../../core/components/navigation/navigation.service";
import { DessertService } from "../content/services/dessert.service";
import { GlobalCommonService } from '../service/global-common.service';
import { Subject } from 'rxjs';
@Component({
    selector: 'fuse-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})

export class FuseToolbarComponent implements OnInit, OnDestroy {

    userStatusOptions: any[];
    languages: any;
    selectedLanguage: any;
    showLoadingBar: boolean;
    horizontalNav: boolean;
    nickName: string;
    destroy$: Subject<boolean> = new Subject();
    constructor(private router: Router, private fuseConfig: FuseConfigService, private translate: TranslateService, private auth: AuthService, private navi: FuseNavigationService, private dessertSrv: DessertService, private globalSrv: GlobalCommonService) {
        this.nickName = this.dessertSrv.nickName ? this.dessertSrv.nickName : '用户';

        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon': 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon': 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon': 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                'id': 'cn',
                'title': '简体中文',
                'flag': 'cn'
            },
            {
                'id': 'en',
                'title': 'English',
                'flag': 'us'
            }   
        ];

        this.selectedLanguage = this.languages[0];

        router.events.subscribe(
            (event) => {
                if (event instanceof NavigationStart) {
                    this.showLoadingBar = true;
                }
                if (event instanceof NavigationEnd) {
                    this.showLoadingBar = false;
                }
            });

        this.fuseConfig.onSettingsChanged.subscribe((settings) => {
            this.horizontalNav = settings.layout.navigation === 'top';
        });

    }//constructor

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }//ngOnDestroy

    ngOnInit(): void {

    }//ngOnInit

    search(value: string) {
        this.globalSrv.keyworkSearch$.next(value);
    }

    setLanguage(lang) {
        // Set the selected language for toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this.translate.use(lang.id);
        // this.config.language = lang.id;
        // this.config.save();
        this.dessertSrv.language = lang.id;
    }

    logout() {
        this.dessertSrv.clear();
        this.auth.logout();
        this.navi.setNavigationModel({});

        if (this.dessertSrv.loginStyle == 1) {
            this.router.navigateByUrl('/app/login');
        }
        else {
            this.router.navigateByUrl('/app/login2');
        }
    }
}
