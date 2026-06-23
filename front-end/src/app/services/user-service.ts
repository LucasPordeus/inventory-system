import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface User {
  token: string;
  user: {
    user_id: number;
    name: string;
    email: string;
  };
  screens: {
    screen_id: number;
    name: string;
    icon: string;
    redirect: string;
  }[];
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  
  private apiUrl = "http://localhost:3000/api/auth/login";

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.apiUrl, { 
      email, 
      password 
    });
  }
}
