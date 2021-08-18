import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@anibal/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(private categoriesService: CategoriesService, 
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private router: Router) { }

  ngOnInit(): void {
    this._getCategories();
  }
  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Estas seguro que quieres eliminar esta categoria?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService.deleteCategory(categoryId)
        .subscribe(()=> {
          this._getCategories();
          this.messageService.add({
            severity:'success', 
            summary:'Exito!', 
            detail:'Categoria eliminada'
          });
        },
        ()=> {
          this.messageService.add({
            severity:'error', 
            summary:'Error!', 
            detail:'La categoria no se pudo eliminar'
          });
        });
      },
  });
    
  }

  updateCategory(categoryId: string) {
    this.router.navigateByUrl(`categories/form/${categoryId}`);

  }
  private _getCategories() {
    this.categoriesService.getCategories()
    .pipe(takeUntil(this.endsubs$))
      .subscribe(cats => {
        this.categories = cats;
      })
  }



}
