import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  public paramsToUserRegister: any;

  constructor() { }

  ngOnInit() {
    this.paramsToUserRegister = {
      title: "Invite User",
      type: "invitation"
    }
  }

}
