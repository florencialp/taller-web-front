import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})

export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  public message: any;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['',
        [
          Validators.required,
          Validators.email
        ]],
      password: ['',
        [
          Validators.required,
          Validators.minLength(6)
        ]]
    });
  }

  async onGoogleLogin() {
    try {
      this.authService.loginGoogle();
      this.router.navigate(['/home']);
    } catch (error) {
      this.message = error;
    }
  }

  async onLogin() {
    const { email, password } = this.loginForm.value;
    try {
      const user = await this.authService.login(email, password);
      if (user && user.user.emailVerified) {
        this.router.navigate(['/home']);
      }
      else if (user) {
        this.router.navigate(['/validar-email']);
      }
      else {
        this.router.navigate(['/register']);
      }
    } catch (error) {
      this.message = "Email y/o contraseña incorrecta";
    }
  }
}
