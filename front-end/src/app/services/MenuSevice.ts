import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface MenuItem {
  label: string;
  icon?: string;
  route: string;
}

@Injectable({
  providedIn: "root",
})

export class MenuService {
  private apiUrl = "assets/services/menu-itens.json"; 

  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl);
  }
}
