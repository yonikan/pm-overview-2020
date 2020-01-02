import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { enumToString } from 'src/app/core/helpers/helper-functions';
import { teamEvents } from 'src/app/core/enums/team-events.enum';
import * as moment from 'moment';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  @Input() eventIndex: number;
  @Input() eventData: any;
  @Output() confirmSessionEmitter = new EventEmitter<any>();
  @Output() convertSessionEmitter = new EventEmitter<string>();
  @Output() editSessionEmitter = new EventEmitter<any>();
  @Output() deleteSessionEmitter = new EventEmitter<string>();
  isValidated = false;
  teamEventTypeString;
  startTimeHoursFormatted;
  endTimeHoursFormatted;
  durationTimeAgo;
  duration;

  constructor() { }

  ngOnInit() {
    // console.log(this.eventData);
    this.teamEventTypeString = enumToString(teamEvents, this.eventData.type);
    this.startTimeHoursFormatted = moment(this.eventData.startTime).format('hh:mm');
    this.endTimeHoursFormatted = moment(this.eventData.endTime).format('hh:mm');
    this.durationTimeAgo = moment(new Date()).from(moment(this.eventData.startTime));
    // this.duration = null;
  }

  confirmSession() {
    const event = {
      teamEventId: this.eventData.id,
      teamEventType: this.eventData.type
    };
    this.confirmSessionEmitter.emit(event);
  }

  convertSession(eventId) {
    this.convertSessionEmitter.emit(eventId);
  }

  editSession() {
    const event = {
      teamEventId: this.eventData.id,
      teamEventType: this.eventData.type
    };
    this.editSessionEmitter.emit(event);
  }

  deleteSession(eventId) {
    this.deleteSessionEmitter.emit(eventId);
  }
}
