import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UsersService } from '@anibal/users';
import { OrderItem } from '../../models/order-item';
import { Order } from '../../models/order';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html',
  styles: [
  ]
})
export class CheckoutPageComponent implements OnInit {

  checkFormGroup!: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  userId= '609d65943373711346c5e950';
  countries: any = [];

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private usersService: UsersService,
              private cartService: CartService,
              private orderService: OrdersService) { }

  ngOnInit(): void {
    this._initCheckForm();
    this._getCartItems();
    this._getCountries();
  }

  get checkForm() {
    return this.checkFormGroup.controls;
  }

  private _initCheckForm() {
    this.checkFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: ['BO']
    });
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  backToCart() {
    this.router.navigate(['/cart'])
  }

  placeOrder() {
    this.isSubmitted = true
    if(this.checkFormGroup.invalid) {
      return;
    }
    const order: Order = {
      orderItems: this.orderItems,
      shippingAddress1: this.checkForm.street.value,
      shippingAddress2: this.checkForm.apartment.value,
      city: this.checkForm.city.value,
      zip: this.checkForm.zip.value,
      country: this.checkForm.country.value,
      phone: this.checkForm.phone.value,
      status: 0,
      user: this.userId,
      dateOrdered:  `${Date.now()}`,
    }
    this.orderService.createOrder(order)
      .subscribe(()=> {
        // redirecttopayament
        this.cartService.emptyCart();
        this.router.navigate(['/success']);
      },()=> {
        // displayn some error to user
      })
  }
  private _getCartItems() {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items?.map(item=> {
      return {
        product: item.productId,
        quantity: item.quantity
      }
    });
    
  }

}
