import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public eventListRef: firebase.firestore.CollectionReference;

  constructor(private authService: AuthService) { }

  async createEvent(
      eventName: string,
      eventDate: string,
      eventPrice: number,
      eventCost: number
  ): Promise<firebase.firestore.DocumentReference> {
    const user: firebase.User = await this.authService.getUser();
    const evenListRef = firebase
                        .firestore()
                        .collection(`userProfile/${user.uid}/eventList`);
    return this.eventListRef.add({
      name: eventName,
      date: eventDate,
      price: eventPrice * 1,
      cost: eventCost * 1,
      revenue: eventCost * -1
    });
  }

  async getEventList(): Promise<firebase.firestore.QuerySnapshot> {
    const user: firebase.User = await this.authService.getUser();
    this.eventListRef = firebase
                          .firestore()
                          .collection(`userProfile/${user.uid}/eventList`);
    return 
    this.eventListRef.get()
  }

  async getEventDetail(eventId: string): Promise <firebase.firestore.DocumentSnapshot> {
    const user: firebase.User = this.authService.getUser();
    this.eventListRef = firebase
                          .firestore()
                          .collection(`userProfile/${user.uid}/eventList`);
    return this.eventListRef.doc(eventId).get();
  }

  async addGuest(guestName: string, eventId: string, eventPrice: number, guestPicture: string = null): Promise<void> {
   
      return this.eventListRef
        .doc(eventId)
        .collection('guestList')
        .add({guestName})
        .then(() => {
          return firebase.firestore().runTransaction(
            transaction => {
              return transaction.get(this.eventListRef.doc(eventId))
                .then(eventDoc => {
                  const newRevenue = eventDoc.data().revenue + eventPrice;
                  transaction.update(this.eventListRef.doc(eventId), { revenue: newRevenue});
                });
            }
            
          );
        });
  }

}

