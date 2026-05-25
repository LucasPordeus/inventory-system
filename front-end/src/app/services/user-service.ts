import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface User {
  name: string;
  allowedMenus: string[];
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "assets/services/users.json";

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
