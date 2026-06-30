import { AuthService } from './../../services/auth';
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { UserService, User } from "../../services/user-service";
import { MenuService } from "../../services/menu-service";

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
  submitted: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private AuthService: AuthService,
    private menuService: MenuService
  ) {}

  login(form: NgForm): void {
    this.submitted = true;
    if (form.invalid) return;

    this.userService.login(this.email, this.password).subscribe({
      next: (user: User) => {
        localStorage.setItem('token', user.token);
        
        if (user.screens && user.screens.length > 0) {
          localStorage.setItem('menuItems', JSON.stringify(user.screens));
          this.menuService.setMenuItems(user.screens);
        }

        this.AuthService.setLoggedIn(true);
        this.router.navigate(['/products']);
      },
      error: (err: any) => {
        console.error('Login error:', err);
      }
    });
  }
}
