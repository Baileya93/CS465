import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { AuthenticationService } from '../services/authentication.service'; // Import AuthenticationService

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // Fixed styleUrls to be plural
})
export class NavbarComponent implements OnInit {
  
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router // Inject Router for navigation
  ) { }

  ngOnInit(): void { }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public onLogout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
