import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event/event.service';
import { Plugins, CameraResultType } from '@capacitor/core';

const { Camera } = Plugins;

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  public currentEvent: any = {};
  public guestName = '';
  public guestPicture: string = null;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const eventId: string = this.route.snapshot.paramMap.get('id');
    this.eventService.getEventDetail(eventId)
      .then(eventSnapshot => {
        this.currentEvent = eventSnapshot.data();
        this.currentEvent.id = eventSnapshot.id;
      })
  }

  addGuest(guestName): void {
    this.eventService
      .addGuest(guestName,
          this.currentEvent.id,
          this.currentEvent.price,
          this.guestPicture)
      .then(() => {
        this.guestName = '';
        this.guestPicture = null;
      });
  }

  async takePicture(): Promise<void> {
    try {
      const profilePicture = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      })
    } catch (error) {
      console.error(error);
    }
  }
}
