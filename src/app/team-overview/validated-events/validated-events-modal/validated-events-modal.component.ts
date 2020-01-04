import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-validated-events-modal',
  templateUrl: './validated-events-modal.component.html',
  styleUrls: ['./validated-events-modal.component.scss']
})
export class ValidatedEventsModalComponent {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, title: string, modalData?: any }
  ){}

  onCancel() {
    this.dialogRef.close();
  }
}
