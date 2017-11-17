import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

/*Firebase*/
import { fbAuth } from './../../../../../environments/firebase-auth-config';
import { fbDatabase } from './../../../../../environments/firebase-database-config';

import { environment } from './../../../../../environments/environment';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticationService {
  auth: any;
  headersToAuth: Headers;
  name: any;
  optionsToAuth: RequestOptions;
  originalUsername: string;
  url = environment.urlToOauthToken;
  urlToApi = environment.urlToApi;
  
  constructor(private http: Http) { }
  
  login = (params) => new Promise((resolve, reject) => {
    let login = params.login.value;
    let password = params.password.value;
    
    switch(params.loginMode) {
      case 'emailAndPassword':
        fbAuth.signInWithEmailAndPassword(login, password)
        .then(res => {
          if(fbAuth.currentUser.emailVerified) {
            let email = fbAuth.currentUser.email;
            let uid = fbAuth.currentUser.uid;

            let that = this;
            fbDatabase.ref('/users/' + uid)
            .once('value')
            .then(function(snapshot) {
              that.name = snapshot.val().username;
            });
            
            resolve({
              cod: "l-01",
              message: "Login successful"
            });
          } else {
            resolve({
              cod: "l-02",
              message: "Authentication not validated."
            })
          }
        })
        .catch(rej => {
          reject({
            cod: "l-03",
            message: rej
          })
        })
      break;

      default:
        console.log("Escolher loginMode")
    }
  })

  logout = () => new Promise((resolve, reject) => {  
    fbAuth.signOut()
    .then(res => {
      resolve({
        cod: "lo-01",
        message: res
      })
    })
    .catch(rej => {
      reject({
        cod: "lo-02",
        message: rej
      })
    })
  })
  
  recoverPasswordEmail = (email) => new Promise((resolve, reject) => {
    fbAuth.fetchProvidersForEmail(email)
    .then(res => {
      if(res.length > 0) {
        fbAuth.sendPasswordResetEmail(email);

        resolve({
          cod: "rpe-01",
          message: "E-mail enviado. Cheque e finalize o processo."
        })
      } else {
        resolve({
          cod: "rpe-02",
          message: "E-mail não cadastrado."
        })
      }
    });
  })

  signup = (params) => new Promise((resolve, reject) => {
    if(!params) {
      return {
        cod: "s-01",
        message: "No params"
      }
    } else {
      if(!params.email) {
        return {
          cod: "s-02",
          message: "Email needed - e.g.: email<string>"
        }
      }
      
      if(!params.repeatEmail) {
        return {
          cod: "s-03",
          message: "Repeat email needed - e.g.: repeatEmail<string>"
        }
      }

      if(!params.type) {
        return {
          cod: "s-04",
          message: "Type needed - e.g.: type<string>"
        }
      }

      if(!params.password) {
        if(!params.type) {
          return {
            cod: "s-04",
            message: "Password needed - e.g.: password<string>"
          }
        } else {
          if(params.type === "invitation") {
            params.password = "*}$#@$tk$tk$c@#<@#}{r@#32131@#(@c#r@";
          } else {
            return {
              cod: "s-05",
              message: "Password needed - e.g.: password<string>"
            }
          }
        }
      }
    }
    let username;
    let emailToUsername;
    let newUsername;
    let res;
    
    if(params.email === params.repeatEmail) {
      //Checking if signing up email is already registered
      fbDatabase.ref('/users')
      .orderByChild('email')
      .equalTo(params.email)
      .once('value')
      .then(snap => {
        if(snap.val() != null) {
          resolve("E-mail registered yet");
        } else {
          if(params.firstUsername === "") {
            emailToUsername = params.email.split('@');
            username = emailToUsername[0];
          } else {
            username = params.firstUsername;
          }
          
          //Checking if signing up username exists
          fbDatabase.ref('/users')
          .orderByChild('username')
          .equalTo(username)
          .once('value')
          .then(snap => {
            if(snap.val() != null) {
              this.originalUsername = username;
              this.signupCheckingUsername(params.email, params.password, params.type, username, 0);
            } else {
              fbAuth.createUserWithEmailAndPassword(params.email, params.password)
              .then(check => {
                let uid = fbAuth.currentUser.uid;

                fbDatabase.ref('users').child(uid).set({
                  email: params.email,
                  username: username
                })

                fbAuth.sendPasswordResetEmail(params.email)
                .then(res => {
                  resolve({
                    cod: "s-01",
                    message: res
                  });
                })
              })
              .catch(rej => {
                reject({
                  cod: "s-02",
                  message: rej
                });
              })
            }
          })
        }
      })
    } else {
      resolve("Email was not repeated correctly");
    }
  })
  
  signupCheckingUsername = (email, password, type, username, number) => new Promise((resolve, reject) => {
    let newUsername;
    let newNumber;
    
    fbDatabase.ref('/users')
    .orderByChild('username')
    .equalTo(username)
    .once('value')
    .then(snap => {
      if(snap.val() != null) {
        newNumber = number + 1;
        newUsername = this.originalUsername + newNumber;
        
        this.signupCheckingUsername(email, password, type, newUsername, newNumber);
      } else {
        let params = {
          email: email,
          repeatEmail: email,
          password: password,
          firstUsername: username,
          type: type
        }
        this.signup(params)
      }
    })
  })
}
