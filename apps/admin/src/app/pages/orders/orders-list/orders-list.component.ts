import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order ,OrdersService, ORDER_STATUS } from "@anibal/orders";
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
  orderStatus:any = ORDER_STATUS;
  endsubs$: Subject<any> = new Subject();

  constructor(private ordersService: OrdersService,
              private router: Router,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this._getOrders();
    
  }
  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private _getOrders() {
    this.ordersService.getOrders()
    .pipe(takeUntil(this.endsubs$))
      .subscribe(orders=> {
        this.orders = orders;
      })
  }

  deleteOrder(orderId: string) {
    this.confirmationService.confirm({
      message: 'Estas seguro que quieres eliminar esta orden?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.deleteOrder(orderId)
        .subscribe(()=> {
          this._getOrders();
          this.messageService.add({
            severity:'success', 
            summary:'Exito!', 
            detail:'Orden eliminada'
          });
        },
        ()=> {
          this.messageService.add({
            severity:'error', 
            summary:'Error!', 
            detail:'La orden no se pudo eliminar'
          });
        });
      },
    });
    

  }
  showOrder(orderId: string) {
    this.router.navigateByUrl(`orders/${orderId}`);
  }

}
