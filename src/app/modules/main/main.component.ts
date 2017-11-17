import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  paramsToLogout: any;
  paramsToMenuSidenav: any;

  constructor() { }

  ngOnInit() {
    this.paramsToMenuSidenav = {
      menuSettings: [{
        description: "Língua",
        route: ['/main/language']
      }, {
        description: "Tipo de Companhia",
        route: ['/main/company-type']
      }, {
        description: "Companhia",
        route: ['/main/company']
      }, {
        description: "Produto",
        route: ['/main/product']
      }], paramsToLogout: {
        routeAfterLogout: ['/login']
      }
    };
  }

}
