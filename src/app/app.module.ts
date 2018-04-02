import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import 'hammerjs';
import { SharedModule } from './core/modules/shared.module';
import { AppComponent } from './app.component';
import { ProjectModule } from './main/content/apps/dashboards/project/project.module';
import { FuseFakeDbService } from './fuse-fake-db/fuse-fake-db.service';
import { FuseMainModule } from './main/main.module';
import { PagesModule } from './main/content/pages/pages.module';
import { UIModule } from './main/content/ui/ui.module';
import { ComponentsModule } from './main/content/components/components.module';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { FuseConfigService } from './core/services/config.service';
import { FuseNavigationService } from './core/components/navigation/navigation.service';
import { ComponentsThirdPartyModule } from './main/content/components-third-party/components-third-party.module';
import { ServicesModule } from './main/content/services/services.module';
import { FuseAngularMaterialModule } from './main/content/components/angular-material/angular-material.module';
import { MarkdownModule } from 'angular2-markdown';
import { TranslateModule } from '@ngx-translate/core';
import { RouteGuardService } from './main/content/services/routeguard.service';
import { AuthService } from './main/content/services/auth.service';
import { ConfigService } from './main/content/services/config.service';
import { OmegaPagesModule } from './main/content/omegapages/omegapages.module';
import { BambooComponentsModule } from './main/content/bambooComponents/bambooComponents.module';
import { BambooPagesModule } from './main/content/bambooPages/bambooPages.module';
import { DataService } from './main/content/services/data.service';

const appRoutes: Routes = [
    {
        path        : 'apps/mail',
        loadChildren: './main/content/apps/mail/mail.module#FuseMailModule',
        canActivate: [RouteGuardService]
    },
    {
        path        : 'apps/chat',
        loadChildren: './main/content/apps/chat/chat.module#FuseChatModule',
        canActivate: [RouteGuardService]
    },
    {
        path        : 'apps/calendar',
        loadChildren: './main/content/apps/calendar/calendar.module#FuseCalendarModule',
        canActivate: [RouteGuardService]
    },
    {
        path        : 'apps/todo',
        loadChildren: './main/content/apps/todo/todo.module#FuseTodoModule',
        canActivate: [RouteGuardService]
    },
    {
        path        : 'apps/file-manager',
        loadChildren: './main/content/apps/file-manager/file-manager.module#FuseFileManagerModule',
        canActivate: [RouteGuardService]
    },
    {
        path        : 'apps/contacts',
        loadChildren: './main/content/apps/contacts/contacts.module#FuseContactsModule',
        canActivate: [RouteGuardService]
    },
    {
        path        : 'apps/scrumboard',
        loadChildren: './main/content/apps/scrumboard/scrumboard.module#FuseScrumboardModule',
        canActivate: [RouteGuardService]
    },
    {
        path      : '**',
        redirectTo: 'apps/dashboards/project'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, { enableTracing: false }),
        SharedModule,
        MarkdownModule.forRoot(),
        TranslateModule.forRoot(),

        InMemoryWebApiModule.forRoot(FuseFakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        FuseMainModule,

        ProjectModule,
        OmegaPagesModule,
        BambooComponentsModule,
        BambooPagesModule,

        PagesModule,
        UIModule,
        ServicesModule,
        ComponentsModule,
        FuseAngularMaterialModule,
        ComponentsThirdPartyModule
    ],
    providers   : [
        FuseSplashScreenService,
        FuseConfigService,
        FuseNavigationService,
        RouteGuardService,
        AuthService,
        ConfigService,
        DataService
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
