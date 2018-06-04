import { Component } from '@angular/core';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { TranslateService } from '@ngx-translate/core';
import { DessertService } from "./main/content/services/dessert.service";
import { environment } from "../environments/environment";
@Component({
    selector: 'fuse-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    moc: string;
    constructor(/*fuseSplashScreen千万不能删除*/public fuseSplashScreen: FuseSplashScreenService, private translate: TranslateService, private dessertSrv: DessertService) {
        // Add languages
        this.translate.addLangs(['en', 'cn']);

        // Set the default language
        this.translate.setDefaultLang('en');

        // Use a language
        this.translate.use(environment.language);

        this.dessertSrv.restoreCache();

        //测试专用
        this.moc = environment.moc;
    }
}
