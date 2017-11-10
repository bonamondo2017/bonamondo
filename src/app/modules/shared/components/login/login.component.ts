import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

/**Services */
import { AuthenticationService } from './../../services/firebase/authentication.service';

/**
 * Components
 */
import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';

@Component({
  selector: 'bonamondo-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  @Input() params;

  errors = [];
  loginForm: FormGroup;
  imageTitle: string;

  constructor(
    private authentication: AuthenticationService,
    public dialog: MatDialog,
    private matsnackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    if(this.params) {
      if(!this.params.routeAfterLoggedIn) {
        this.errors.push({
          cod: 'bonamondo-l-01',
          message: "Definir rota do login"
        });
      }
    } else {
      this.errors.push({
        cod: 'p-01',
        message: "Definir parâmetros mínimos do componente"
      });
    }

    this.loginForm = new FormGroup({
      'login': new FormControl(null, [Validators.required, Validators.email,Validators.maxLength(191)]),
      'password': new FormControl(null, [Validators.required,Validators.maxLength(191)])
    })
  }

  onForgotPassword = () => {
    //this.router.navigate(this.params.forgotPasswordRoute);
    let dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {      
      let array: any;
      let string: string;
    });
  }

  onSubmit = () => {
    this.params.login = this.loginForm.get('login');
    this.params.password = this.loginForm.get('password');
    
    this.authentication.login(this.params)
    .catch(error => {
      console.log(error)
    })
    .then(res => {
      let string = JSON.stringify(res);
      let json = JSON.parse(string);
      
      if(json.cod == "l-01") {
        this.matsnackbar.open(json.message, '', {
          duration: 2000
        });
        
        this.router.navigate(this.params.routeAfterLoggedIn);
      }

      if(json.cod == "le-01") {
        this.matsnackbar.open(json.message, '', {
          duration: 12000
        });
      }
    });
  }
}