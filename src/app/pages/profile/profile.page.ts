import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';
import { ProfileService } from '../../services/user/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public userProfile: any = {};

  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit() {
    this.profileService.getUserProfile()
      .then(userProfileSnapshot => {
        if (userProfileSnapshot.data()) {
          this.userProfile = userProfileSnapshot.data();
        }
      })
  }

  logout(): void {
    this.authService.logoutUser().then(()=> {
      this.router.navigateByUrl('login');
    })
  }

  async updateName(): Promise<void> {
    const alert = await this.alertCtrl.create({
      subHeader: 'Your first name and last name',
      inputs: [
        {
          type: 'text',
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName
        },
        {
          type: 'text',
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName
        }
      ],
      buttons: [
        {
          text: 'cancel'
        },
        {
          text: 'save',
          handler: data => {
            this.profileService.updateName(data.firstName, data.lastName)
          }
        }
      ]
    });
    await alert.present();
  }

  updateDOB(birthDate: string) {
    if (birthDate === undefined) {
      return;
    }
    this.profileService.updateDOB(birthDate);
  }

  async updateEmail(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        {
          type: 'text',
          name: 'newEmail',
          placeholder: 'Your new email'
        },
        {
          type: 'password',
          name: 'password',
          placeholder: 'Your password'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updateEmail(data.newEmail, data.password)
              .then(() => {
                console.log('Email changed successfully');
              })
              .catch(error => {
                console.log('Error: ' + error.message);
              })
          }
        }
      ]
    });
    alert.present();
  }

  async updatePassword(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'New password',
          type: 'password'
        },
        {
          name: 'oldPassword',
          placeholder: 'Old password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updatePassword(data.newPassword, data.oldPassword)
          }
        }
      ]
    })
    await alert.present();
  }

}
