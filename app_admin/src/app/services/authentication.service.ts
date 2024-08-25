import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:3000'; // Update with your API URL
  authResp: AuthResponse = new AuthResponse();

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private http: HttpClient,
    private tripDataService: TripDataService
  ) {}

  // Get our token from Storage
  public getToken(): string {
    return this.storage.getItem('travlr-token') || '';
  }

  // Save our token to Storage
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Logout and remove the JWT from Storage
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // Check if logged in and token is valid
  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    }
    return false;
  }

  // Retrieve the current user
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  // Login method
  public login(user: User, passwd: string): void {
    this.tripDataService.login(user, passwd)
      .subscribe({
        next: (response: AuthResponse) => {
          console.log('Login Response:', response);
          this.authResp = response;
          this.saveToken(this.authResp.token);
        },
        error: (error: any) => {
          console.error('Login Error:', error);
        }
      });
  }

  // Register method
  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd)
      .subscribe({
        next: (response: AuthResponse) => {
          console.log('Registration Response:', response);
          this.authResp = response;
          this.saveToken(this.authResp.token);
        },
        error: (error: any) => {
          console.error('Registration Error:', error);
        }
      });
  }
}
