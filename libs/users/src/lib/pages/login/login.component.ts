import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginFormGroup!: FormGroup;
  isSubmitted = false
  authError = false;
  authMessage = 'Email o password incorrectos';
  
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private localstorageService: LocalstorageService,
              private router: Router) { }

  ngOnInit(): void {
    this._initLoginForm();
  }

  get loginForm(){
    return this.loginFormGroup.controls;
  }


  private _initLoginForm() {
    this.loginFormGroup = this.formBuilder.group({
      email: ['luis@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', Validators.required]
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    this.authService.login(this.loginForm.email.value, this.loginForm.password.value)
      .subscribe(user=> {
        this.authError = false;
        this.localstorageService.setToken(user.token);
        this.router.navigate(['/']);
      },(error: HttpErrorResponse)=> {
        console.log(error);
        this.authError = true
        if(error.status !== 400) {
          this.authMessage = 'Error en el servidor, profavor intentelo mas tarde'
        }
      })
  }

}
