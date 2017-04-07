import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import * as moment from 'moment/moment';
import { OrdersService } from '../../core/data-services';
import { NotificationsService, NotificationType } from '../../core/notifications';
import { NewOrder } from './new-order.model';

@Component({
    selector: 'client-order',
    templateUrl: './client-order.html',
    styleUrls: ['../shared/styles/order-form.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ClientOrderComponent implements OnInit {
    orderForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private ordersService: OrdersService,
        private notificationsService: NotificationsService
    ) { }

    ngOnInit() {
        this.orderForm = this.formBuilder.group({
            address: this.formBuilder.group({
                useDefaultAddress: [true],
                customAddress: this.formBuilder.group({
                    city: [''],
                    street: [''],
                    house: [''],
                    apartment: ['']
                })
            }),
            childrenNames: [''],
            datetime: ['', Validators.required],
            presents: this.formBuilder.array([
                this.initNewPresent()
            ]),
            comments: ['']
        });

        const addressGroup = this.orderForm.get('address');
        addressGroup.get('useDefaultAddress').valueChanges.subscribe(value => {
            const customAddressGroup = addressGroup.get('customAddress');
            const fieldNames = ['city', 'street', 'house', 'apartment'];
            if (value) {
                for (const fieldName of fieldNames) {
                    customAddressGroup.get(fieldName).clearValidators();
                    customAddressGroup.get(fieldName).updateValueAndValidity();
                }
            } else {
                for (const fieldName of fieldNames) {
                    customAddressGroup.get(fieldName).setValidators(Validators.required);
                    customAddressGroup.get(fieldName).updateValueAndValidity();
                }
            }
        });
    }

    initNewPresent() {
        return this.formBuilder.group({
            name: ['', Validators.required],
            buyBySanta: [false]
        });
    }

    addPresent() {
        const presentsControl = <FormArray>this.orderForm.get('presents');
        presentsControl.push(this.initNewPresent());
    }

    removePresent(i: number) {
        const control = <FormArray>this.orderForm.controls['presents'];
        control.removeAt(i);
    }

    onSubmitClick({ value }: { value: NewOrder }) {
        const datetime = moment(value.datetime);
        value.datetime = datetime.toJSON();

        this.ordersService.createOrder(value).subscribe(orderId => {
            const redirectUrl = `/client/orderinfo/${orderId}`;
            this.notificationsService.notify({
                type: NotificationType.success,
                content: `New order successfully created.
                    Click [here](${redirectUrl}) for more details`
            });
            this.router.navigate(['/client']);
        }, err => {
            this.notificationsService.notify({
                type: NotificationType.error,
                content: err
            });
        });
    }
}
