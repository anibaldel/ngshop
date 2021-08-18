import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '@anibal/orders';
import { CartItem } from '@anibal/orders';

@Component({
  selector: 'anibal-product-item',
  templateUrl: './product-item.component.html',
  styles: [
  ]
})
export class ProductItemComponent {

  @Input() product!: Product;

  constructor(private cartService: CartService,
              ) { }


  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: 1
    }
    this.cartService.setCartItem(cartItem);
    
  }

}
