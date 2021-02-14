import { Injectable } from '@angular/core';
import firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getUser(): firebase.User {
    const user = firebase.auth().currentUser;
    if (user) {
      return user;
    } else {
      console.error('no user')
    }
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

}
