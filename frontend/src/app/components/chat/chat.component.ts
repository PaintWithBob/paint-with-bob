import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';

const CHAT_UPDATE_EVENT_ID = 'CHAT_MESSAGE';

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnChanges {

    @Input() socket: any;
    @Input() user: any;
    @Input() messages: any[] = [];
    newMessages: boolean = false;
    input: any;
    collapsed: boolean = true;

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {

      if (changes.messages) {

        // Set that we have new messages
        if(changes.messages && !changes.messages.firstChange && this.collapsed) {
          this.newMessages = true;
        }

        // Scroll back to the bottom of the view
        let scrollableMessages = document.querySelector('#chat .messages');
        if(scrollableMessages) {
          // Timeout to allow Dom Changes
          setTimeout(() => {
            scrollableMessages.scrollTop = scrollableMessages.scrollHeight;
          }, 100)
        }
      }
    }

    handleHeaderClick() {
      this.newMessages = false;
      this.collapsed = !this.collapsed;
    }

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
