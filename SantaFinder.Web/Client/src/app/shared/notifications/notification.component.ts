import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationType } from './notification-type.enum';

@Component({
    selector: 'sf-notification',
    templateUrl: 'notification.html',
    styleUrls: ['./notification.scss']
})
export class NotificationComponent implements OnInit {
    @Input() type: NotificationType;
    @Input() content: string = "";
    @Output() close: EventEmitter<void> = new EventEmitter<void>();
    @Output() mouseover: EventEmitter<void> = new EventEmitter<void>();
    @Output() mouseleave: EventEmitter<void> = new EventEmitter<void>();

    constructor() { }

    ngOnInit() { }

    getTypeClassName() {
        return `sf-notification_${NotificationType[this.type]}`;
    }

    onCloseButtonClick() {
        this.close.emit();
    }

    onMouseOver() {
        this.mouseover.emit();
    }

    onMouseLeave() {
        this.mouseleave.emit();
    }
}