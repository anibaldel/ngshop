import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { CartService } from '../../services/cart.service';
import { take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'orders-order-summary',
  templateUrl: './order-summary.component.html',
  styles: [
  ]
})
export class OrderSummaryComponent implements OnInit, OnDestroy {

  endSubs$: Subject<any> = new Subject();
  totalPrice!: number;
  isCheckout = false;

  constructor(private ordersService: OrdersService,
              private cartService: CartService,
              private router: Router) {
    this.router.url.includes('checkout') ? this.isCheckout= true
                : this.isCheckout = false;
  }

  ngOnInit(): void {
    this._getOrderSumary();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  _getOrderSumary() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$))
      .subscribe(cart => {
        this.totalPrice = 0;
        cart.items?.map((item:any)=> {
          this.ordersService.getProduct(item.productId)
            .pipe(take(1))
            .subscribe((product)=> {
              this.totalPrice += product.price * item.quantity;
            })
        })
      })
  }
  navigateToCheckout() {
    this.router.navigate(['/checkout']);
  }

}
