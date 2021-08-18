import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CartService, CartItem } from '@anibal/orders';

@Component({
  selector: 'anibal-product-page',
  templateUrl: './product-page.component.html',
  styles: [
  ]
})
export class ProductPageComponent implements OnInit, OnDestroy {

  product!: Product;
  endSubs$: Subject<any> = new Subject();
  quantity = 1;

  constructor(private productsService: ProductsService,
              private route: ActivatedRoute,
              private cartService: CartService
              ) { }
  

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params.productid) {
        this._getProduct(params.productid);
      }
    })
  }
  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  addProductToCart() {
    const cartItem : CartItem = {
      productId: this.product.id,
      quantity: this.quantity
    }

    this.cartService.setCartItem(cartItem);
    /*this.messageService.add({
      severity:'success', 
      summary:'Exito!', 
      detail:`Agregado al carrito`
    });*/
  }

  _getProduct(id: string) {
    this.productsService.getProduct(id)
    .pipe(takeUntil(this.endSubs$))
      .subscribe(resProduct => {
        this.product = resProduct;
      })
  } 

}
