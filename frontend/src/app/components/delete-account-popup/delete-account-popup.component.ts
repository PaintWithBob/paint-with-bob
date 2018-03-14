import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'delete-account-popup',
  templateUrl: './delete-account-popup.component.html',
  styleUrls: ['./delete-account-popup.component.scss']
})
export class DeleteAccountPopupComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal

  ) {}

  ngOnInit() {
  }

  close() {
      this.activeModal.close();
  }

  nukeAccount() {
    console.log("ACCOUNT SHOULD NOW BE NUKED");

  }

}
