import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { AuthenticationService } from './../../services/firebase/authentication.service';


@Component({
  selector: 'bonamondo-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  @Input() params;

  errors: any = [];

  userRegisterForm: FormGroup;
  paramsToTableData: any;
  title: string;

  constructor(
    private authentication: AuthenticationService,
    public matsnackbar: MatSnackBar,
    private router: Router
  ) { }

  /**
   * Cycle hook actions start
   */
  ngOnInit() {
    if(!this.params) {
      this.errors.push({
        cod: 'ur-01',
        message: 'Definir parâmetros mínimos do componente'
      })
    } else {
      if(!this.params.type) {
        this.errors.push({
          cod: 'ur-02',
          message: 'Definir forma pela qual o usuário será cadastrado - ex. : type: "invite"'
        })
      }

      if(!this.params.title) {
        this.params.title = "Register New User"
      }

      if(!this.params.subtitle) {
        this.params.subtitle = ""
      }
    }

    this.title = this.params.title;

    this.userRegisterForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'repeatEmail': new FormControl(null, Validators.required)
    })

    this.makeList();
  }
  /**
   * Cycle hook actions end
   */

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Users list",
        delete: [{
          routeAfterDelete: '/main/userRegister',
          routeToApi: 'users',
          fieldToDelete: '__key'
        }],
        search: true
      },
      list: {
        route: "users",
        show: ['email'],
        header: ['Email'],
        order: ['email', 'desc'],
        page: 1
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }

  onUserRegisterFormSubmit = () => {
    if(this.params.type === "invitation") {
      let params = {
        email: this.userRegisterForm.get('email').value,
        repeatEmail: this.userRegisterForm.get('repeatEmail').value
      }

      this.authentication.signup(params)
      .then(res => {
          this.matsnackbar.open(res['message'], '', {
            duration: 2000
          })
        }, rej => {
          this.matsnackbar.open(rej['message'], '', {
            duration: 3000
          })
        })
    
        this.userRegisterForm.patchValue(this.userRegisterForm.value);
    
        this.makeList();
      }
    }
}
