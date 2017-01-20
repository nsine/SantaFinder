import { Component, OnInit, Input, EventEmitter, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { SebmGoogleMapMarker, SebmGoogleMapInfoWindow, MarkerManager, GoogleMapsAPIWrapper, } from 'angular2-google-maps/core';

import { OrderLocationInfo } from '../../../data-services/view-models/orders-on-map/order-location-info';
import { Location } from '../../../shared/models/location';
import { LocationService } from '../../../shared/services/location.service';
import { GeocodingService } from '../../../shared/services/geocoding.service';
import { SelectOrderService } from '../services/select-order.service';


@Component({
    selector: 'map',
    templateUrl: 'map.html',
    styleUrls: ['./map.scss'],
    providers: [MarkerManager, GoogleMapsAPIWrapper]
})
export class MapComponent implements OnInit {
    @Input() orders: OrderLocationInfo[];

    @ViewChildren('orderMarker') markers: QueryList<SebmGoogleMapMarker>;
    @ViewChildren('orderInfoWindow') infoWindows: QueryList<SebmGoogleMapInfoWindow>;

    myLocation: Location = {
        latitude: 0,
        longitude: 0
    };

    constructor(
        private locationService: LocationService,
        private geo: GeocodingService,
        private selectOrderService: SelectOrderService,
        private mman: MarkerManager
    ) { }

    ngOnInit() {
        this.locationService.getCurrentLocation().then(location => {
            this.locationChanged(location);
        });

        this.selectOrderService.selectedOrder$.subscribe(id => {
            this.infoWindows.forEach(window => {
                window.close();
            });

            if (id === -1) {
                return;
            }

            let windowIndex = this.orders.findIndex(o => o.id === id);
            this.infoWindows.find((w, i) => i === windowIndex).open();
        });
    }

    onMarkerClick(markerIndex: number, orderId: number) {
        this.selectOrderService.selectOrder(orderId);
    }

    onWindowClosed() {
        // TODO change selectOrderIndex in service to -1
        // but this event fires on each window.close(), not only on user click
    }

    private locationChanged(loc: Location) {
        this.myLocation.latitude = loc.latitude;
        this.myLocation.longitude = loc.longitude;
    }
}