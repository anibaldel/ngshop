import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { CartItemDetailed } from '../../models/cart';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html'
})
export class CartPageComponent implements OnInit, OnDestroy {

  cartItemsDetailed: CartItemDetailed[] = [];
  cartCount = '0';
  endSubs$ : Subject<any> = new Subject();
  constructor(private router: Router,
              private cartService: CartService,
              private orderService: OrdersService) { }
  

  ngOnInit(): void {
    this._getCartDetails();
  }
  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getCartDetails() {
    this.cartService.cart$
    .pipe(takeUntil(this.endSubs$))
      .subscribe(respCart=> {
        this.cartItemsDetailed = [];
        this.cartCount = String(respCart.items?.length) ?? '0';
        respCart.items?.forEach((cartItem: any) => {
          this.orderService.getProduct(cartItem.productId)
            .subscribe(respProduct=>{
              this.cartItemsDetailed.push({
                product: respProduct,
                quantity: cartItem.quantity
              })
            })
        })
      })
  }

  backToShop() {
    this.router.navigate(['/products'])
  }

  deleteCartItem(cartItem: CartItemDetailed) {
    this.cartService.deleteCartItem(cartItem.product.id);

  }

  updatedCartItemQuantity(event: any, cartItem: CartItemDetailed) {
    this.cartService.setCartItem({
      productId: cartItem.product.id,
      quantity: event.value
    }, true)
  }

}
