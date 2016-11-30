import { Component } from '@angular/core';
import { FingerprintAIO } from 'ionic-native';
import { NavController } from 'ionic-angular';
export var HomePage = (function () {
    function HomePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    HomePage.prototype.check = function () {
        console.log('check');
        FingerprintAIO.isAvailable().then(function (result) {
            alert(result);
        }).catch(function (err) {
            alert(err);
        });
    };
    HomePage.prototype.show = function () {
        console.log('show');
        FingerprintAIO.show().then(function (result) {
            alert(result);
        }).catch(function (err) {
            alert(err);
        });
    };
    HomePage.decorators = [
        { type: Component, args: [{
                    selector: 'page-home',
                    templateUrl: 'home.html'
                },] },
    ];
    /** @nocollapse */
    HomePage.ctorParameters = [
        { type: NavController, },
    ];
    return HomePage;
}());
//# sourceMappingURL=home.js.map