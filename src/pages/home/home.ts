import { Component } from '@angular/core';
import { FingerprintAIO } from 'ionic-native'

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  check(){
    FingerprintAIO.isAvailable().then(result =>{
      alert(result);
    }).catch(err => {
      alert(err);
    });
  }

  show(){
    FingerprintAIO.show().then(result => {
      alert(result);
    }).catch(err => {
      alert(err);
    });
  }

}
