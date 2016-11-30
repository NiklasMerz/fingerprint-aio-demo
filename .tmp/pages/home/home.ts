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
    console.log('check');
    FingerprintAIO.isAvailable().then(result =>{
      alert(result);
    }).catch(err => {
      alert(err);
    });
  }

  show(){
    console.log('show');
    FingerprintAIO.show().then(result => {
      alert(result);
    }).catch(err => {
      alert(err);
    });
  }

}
