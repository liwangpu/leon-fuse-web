import { Component, OnInit, Input, Output, AfterViewInit, ViewChildren, QueryList, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ProductCategory } from "../../../../toolkit/models/productcategory";
import { CategoryItemDirective } from "./category-item.directive";
import { Subject } from 'rxjs';
import { MathexService } from '../../../../toolkit/common/services/mathex.service';
import { ProductCategoryService } from '../../../../toolkit/server/webapi/productcategory.service';
import { DialogService } from '../../../../toolkit/common/services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '../../../../toolkit/common/services/snackbar.service';
import { MatDialog } from '@angular/material';
import { CategoryFormComponent } from "../category-form/category-form.component";
import { CategoryMdService } from '../category-md.service';
@Component({
  selector: 'app-product-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  @Input() organizationId: string;
  @Input() parentId: string;
  @Input() type: string;
  @Input() title: string;
  @Input() closable: boolean;
  @Input() brief: boolean;
  @Input() categories: Array<ProductCategory>;
  @Output() onClose: EventEmitter<void> = new EventEmitter();
  @Output() onCategorySelected: EventEmitter<string> = new EventEmitter();
  @Output() afterCategoryDeleted: EventEmitter<string> = new EventEmitter();
  @ViewChildren(CategoryItemDirective) categoryItems: QueryList<CategoryItemDirective>;
  private destroy$: Subject<boolean> = new Subject();
  private selectedCategory: ProductCategory;
  private minIdx = 0;//最小展示序号
  private maxIdx = 0;//最大展示序号
  constructor(private mathexSrv: MathexService, private categorySrv: ProductCategoryService, private dialogSrv: DialogService, private tranSrv: TranslateService, private snackbarSrv: SnackbarService, private dialog: MatDialog, private categoryMdSrv: CategoryMdService) {
  }

  ngOnInit() {

  }//ngOnInit

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }//ngOnDestroy

  ngAfterViewInit(): void {

  }//ngAfterViewInit

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] && changes['categories'].currentValue && changes['categories'].currentValue.length) {
      let idss = changes['categories'].currentValue.map(x => x.displayIndex);
      this.minIdx = this.mathexSrv.arrayMin(idss);
      this.maxIdx = this.mathexSrv.arrayMax(idss);
    }
  }//ngOnChanges

  trackByCategory(index: number, cate: ProductCategory): number {
    return - cate.displayIndex;
  }

  onItemSelected(id: string) {
    this.categoryItems.forEach(it => {
      if (it.id !== id)
        it.reset();
    });
    this.onCategorySelected.next(id);
    this.selectedCategory = this.categories.filter(x => x.id === id)[0];
    this.categoryMdSrv.afterCategorySelect$.next(this.selectedCategory);
  }//onItemSelected

  selectedItem(id: string) {
    this.categoryItems.forEach(it => {
      if (it.id === id)
        it.select();
      else
        it.reset();
    });
  }

  onClear() {
    this.categoryItems.forEach(it => {
      it.reset();
      this.selectedCategory = null;
    });
  }//onClear


  onMoveUp() {
    if (this.selectedCategory.displayIndex > this.minIdx) {
      this.categorySrv.moveUpProductCategory(this.selectedCategory).first().subscribe(resCate => {
        this.categories = resCate.children;
        setTimeout(() => {
          this.selectedItem(this.selectedCategory.id);
        }, 200);
      });
    }
  }//onMoveUp

  onMoveDown() {
    if (this.selectedCategory.displayIndex < this.maxIdx) {
      this.categorySrv.moveDownProductCategory(this.selectedCategory).first().subscribe(resCate => {
        this.categories = resCate.children;
        setTimeout(() => {
          this.selectedItem(this.selectedCategory.id);
        }, 200);

      });
    }
  }//onMoveDown

  onRemove() {
    if (!this.selectedCategory)
      return;

    let getTranAsync = () => {
      return new Promise(resole => {
        let obs = this.tranSrv.get('message.DeleteConfirm', { value: this.selectedCategory.name }).subscribe(msg => {

          resole(msg);
          obs.unsubscribe();
        });
      });//Promise
    };//getTranAsync

    let confirmAsync = (msg) => {
      return new Promise(resole => {
        let dialog = this.dialogSrv.confirmDialog(msg);
        let obs = dialog.componentInstance.onConfirm.subscribe(() => {

          resole();
          obs.unsubscribe();
        });
      });//Promise
    };//confirmAsync

    let deleteCategoryAsync = () => {
      let obs = this.categorySrv.deleteProductCategory(this.selectedCategory.id).subscribe(() => {
        this.snackbarSrv.simpleBar('message.DeleteSuccessfully');
        this.afterCategoryDeleted.next(this.selectedCategory.id);
        // this.categories = this.categories.filter(x => x.id !== this.selectedCategory.id);
        this.selectedCategory = undefined;
        obs.unsubscribe();
      });
    };

    getTranAsync().then(confirmAsync).then(deleteCategoryAsync);
  }//onDeleteCategory

  onEdit(type?: string) {
    if (type === 'edit' && !this.selectedCategory)
      return;

    let defaultCate: ProductCategory;
    if (type === 'new') {
      defaultCate = new ProductCategory();
      defaultCate.type = this.type;
      defaultCate.organizationId = this.organizationId;
      defaultCate.parentId = this.parentId;
      defaultCate.displayIndex = 0;
    }

    let dialogObj = this.dialog.open(CategoryFormComponent, {
      width: '400px',
      height: '450px',
      data: { category: type === 'edit' ? this.selectedCategory : defaultCate }
    });//

    let dialogDestroy = new Subject<boolean>();
    dialogObj.afterClosed().first().subscribe(() => {
      dialogDestroy.next(true);
    });
    dialogObj.componentInstance.afterCategorySubmit.takeUntil(dialogDestroy).subscribe(resCate => {
      let isExist = this.categories.some(x => x.id === resCate.id);
      if (isExist) {
        for (let idx = this.categories.length - 1; idx >= 0; idx--) {
          if (this.categories[idx].id === resCate.id) {
            this.categories[idx] = resCate;
            break;
          }
        }//for
      }
      else {
        this.categories.push(resCate);
      }
    });//subscribe

  }//onEdit

  close() {
    this.onClose.next();
  }//close


}
