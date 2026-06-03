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

export class Login implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(){
    // 
  }

  login(): void {
    this.userService.login(this.email, this.password).subscribe({
      next: (user: User) => {
        console.log('Logged in user:', user);
        console.log('Allowed menu items for user:', user.screens);
        this.router.navigate(['/menu']);
      },
      error: (err: any) => {
        console.error('Login error:', err);
      }
    });
  }
}
