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
        description: "Teste 1",
        route: ['/main/topic']
      }, {
        description: "Teste 2",
        route: ['/main/delegation']
      }, {
        description: "Teste 3",
        route: ['/main/occupation-group']
      }, {
        description: "Teste 4",
        route: ['/main/institution']
      }, {
        description: "Teste 5",
        route: ['/main/occupation']
      }], paramsToLogout: {
        routeAfterLogout: ['/login']
      }
    };
  }

}
