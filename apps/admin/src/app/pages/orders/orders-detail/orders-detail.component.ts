import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order ,OrdersService, ORDER_STATUS } from "@anibal/orders";
import { MessageService } from 'primeng/api';
@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: [
  ]
})
export class OrdersDetailComponent implements OnInit {

  order!: Order;
  orderItems: any;
  orderStatus: any;
  selectedStatuses:any;
  

  constructor(private ordersService: OrdersService,
              private route: ActivatedRoute,
              private messageService: MessageService,) {;
               }

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrder();
  }

  private _mapOrderStatus() {
    this.orderStatus = Object.keys(ORDER_STATUS).map((key) => {
      return {
        id: key,
        name: ORDER_STATUS[key].label
      }
    })
  }


  private _getOrder() {
    this.route.params.subscribe(params=> {
      if(params.id) {
        this.ordersService.getOrder(params.id)
          .subscribe(order => {
            this.order = order;
            this.orderItems  = order.orderItems;
            this.selectedStatuses = String(order.status);
            console.log(this.selectedStatuses);
          })
      }
    })
  }

  onStatusChange(event: any) {
    this.ordersService.updateOrder({status: event.value}, this.order.id)
      .subscribe(()=> {
        this.messageService.add({
          severity:'success', 
          summary:'Exito!', 
          detail:`Orden Actualizada`
        });
      },
      ()=> {
        this.messageService.add({
          severity:'error', 
          summary:'Error!', 
          detail:'Orden no Actualizada!'
        });
      })
  }

}
