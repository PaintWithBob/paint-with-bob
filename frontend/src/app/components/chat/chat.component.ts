import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

const CHAT_UPDATE_EVENT_ID = 'CHAT_MESSAGE';

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

    @Input() socket: any;
    @Input() user: any;
    @Input() messages: any[] = [];
    input: any;
    collapsed: boolean;

    constructor() {}

    sendMessage(form: NgForm) {
        if(form.valid) {
            this.socket.emit(CHAT_UPDATE_EVENT_ID, {
                user: this.user,
                message: this.input
            });
            this.input = '';
        }
    }

}
