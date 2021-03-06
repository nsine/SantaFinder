import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { OrdersService } from '../../data-services/orders.service';
import { OrderLocationInfo } from '../../data-services/view-models/orders-on-map/order-location-info';
import { SelectOrderService } from './services/select-order.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationType } from "../../shared/notifications/notification-type.enum";

@Component({
    selector: 'santa-home',
    templateUrl: './santa-home.html',
    styleUrls: ['./santa-home.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [SelectOrderService]
})
export class SantaHomeComponent implements OnInit {
    selectedOrderIndex: number = -1;
    orders: OrderLocationInfo[] = [];

    constructor(
        private ordersService: OrdersService,
        private selectOrderService: SelectOrderService,
        private notificationsService: NotificationsService
    ) { }

    ngOnInit() {
        this.ordersService.getOrderLocations().subscribe(res => {
            this.orders = res.json();
        }, console.log);

        this.selectOrderService.selectedOrder$.subscribe(id => {
            let orderIndex = this.orders.findIndex(o => o.id === id);
            this.selectedOrderIndex = orderIndex;
        });
    }

    onOrderItemClick(orderId: number, index: number) {
        this.selectedOrderIndex = index;
        this.selectOrderService.selectOrder(orderId);
    }

    getOrderDetails(id: number) {
        return this.ordersService.getOrderFullInfo(id);
    }

    takeOrder(id: number) {
        this.ordersService.takeOrder(id).subscribe(success => {
            if (success) {
                this.notificationsService.notify({
                    type: NotificationType.success,
                    content: `You have successfully accepted the order #${id}.
                        Click [here](/santa/myorders) for details`
                });
                let orderIndex = this.orders.findIndex(o => o.id === id);
                this.orders.splice(orderIndex, 1);
            } else {
                this.notificationsService.notify({
                    type: NotificationType.error,
                    content: `An error occurred while taking order. Please try again later`
                });
            }
        });
    }
}