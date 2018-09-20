import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { DrawerService } from '../../share/services/common/drawer.service';
import { MediaService } from '../../share/services/common/media.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navs',
  templateUrl: './navs.component.html',
  styleUrls: ['./navs.component.scss']
})
export class NavsComponent implements OnInit, OnDestroy, AfterViewInit {


  destroy$ = new Subject<boolean>();
  @ViewChild('nav') navEl: ElementRef;
  constructor(protected drawerSrv: DrawerService, protected mediaSrv: MediaService, protected renderer2: Renderer2) {

  }//constructor

  private _bMiniMode = false;

  ngOnInit() {
    this.mediaSrv._mqAlia$.pipe(takeUntil(this.destroy$)).subscribe(alia => {
      if (alia == 'md') {
        this._bMiniMode = true;
        this.renderer2.addClass(this.navEl.nativeElement, 'mini');
      }
      else {
        this._bMiniMode = false;
        this.renderer2.removeClass(this.navEl.nativeElement, 'mini');
      }
    });
  }//ngOnInit

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }//ngOnDestroy

  ngAfterViewInit(): void {

  }//ngAfterViewInit

  toggleSideNavMiniMode() {
    this._bMiniMode = !this._bMiniMode;
    if (this._bMiniMode)
      this.renderer2.addClass(this.navEl.nativeElement, 'mini');
    else
      this.renderer2.removeClass(this.navEl.nativeElement, 'mini');
  }

  closeSideNav() {
    this.drawerSrv.toggle();
  }//closeSideNav

  onMouseEnterSideNav() {
    if (!this._bMiniMode) return;
    this.renderer2.addClass(this.navEl.nativeElement, 'actived');
  }//onMouseEnterSideNav

  onMouseLeaveSideNav() {
    if (!this._bMiniMode) return;
    this.renderer2.removeClass(this.navEl.nativeElement, 'actived');
  }//onMouseLeaveSideNav
}
