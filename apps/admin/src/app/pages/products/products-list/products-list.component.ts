import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService, Product } from '@anibal/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(private productsService: ProductsService,
              private router: Router,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this._getProducts();
  }
  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private _getProducts() {
    this.productsService.getProducts()
    .pipe(takeUntil(this.endsubs$))
      .subscribe(products=> {
        this.products = products;
      })
  }

  updateProduct(productId: string) {
    this.router.navigateByUrl(`products/form/${productId}`);

  }
  
  deleteProduct(productId: string) {
    this.confirmationService.confirm({
      message: 'Estas seguro que quires eliminar este producto?',
      header: 'Eliminar producto',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService.deleteProduct(productId).subscribe(
          () => {
            this._getProducts();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Producto eliminado!'
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Producto no eliminado!'
            });
          }
        );
      }
    });
  }
 

}
