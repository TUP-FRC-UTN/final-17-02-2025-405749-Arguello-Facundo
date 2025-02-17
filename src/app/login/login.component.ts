import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        (response) => {
          if (response) {
            // Store token and role in localStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('username', username);
            localStorage.setItem('role', response.role); // Assuming the response contains the role
            this.router.navigate([`/game`]); // Redirect to game page
          } else {
            this.loginError = 'Credenciales incorrectas. Por favor, inténtelo de nuevo.';
          }
        },
        (error) => {
          this.loginError = 'Error en el inicio de sesión. Por favor, inténtelo de nuevo.';
        }
      );
    }
  }
}