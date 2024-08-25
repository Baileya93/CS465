import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formError: string = '';
  submitted = false;
  credentials = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password || !this.credentials.name) {
      this.formError = 'All fields are required, please try again';
      this.router.navigateByUrl('#'); // Return to login page
    } else {
      this.doLogin();
    }
  }

  private doLogin(): void {
    let newUser = {
      name: this.credentials.name,
      email: this.credentials.email
    } as User;

    // Call the login method from AuthenticationService
    this.authenticationService.login(newUser, this.credentials.password).subscribe({
      next: () => {
        if (this.authenticationService.isLoggedIn()) {
          // Redirect to the trip-list page if login is successful
          this.router.navigate(['']);
        } else {
          // Wait and try again if login is not successful
          setTimeout(() => {
            if (this.authenticationService.isLoggedIn()) {
              this.router.navigate(['']);
            }
          }, 3000);
        }
      },
      error: (err) => {
        this.formError = 'Login failed. Please try again.';
      }
    });
  }
}
