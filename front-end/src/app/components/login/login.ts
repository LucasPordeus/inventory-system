import { AuthService } from './../../services/auth';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { UserService, User } from "../../services/user-service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./login.html",
  styleUrls: ["./login.scss"],
})

export class Login{
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router, private AuthService: AuthService) {}

  login(): void {
    this.userService.login(this.email, this.password).subscribe({
      next: (user: User) => {
        localStorage.setItem('token', user.token);
        this.AuthService.setLoggedIn(true);

        console.log('Logged in user:', user);
        console.log('Allowed menu items for user:', user.screens);
        
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('Login error:', err);
      }
    });
  }
}
