import { Injectable } from '@angular/core';

const TOKEN = 'jwToken'
@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {


  setToken(data: any) {
    localStorage.setItem(TOKEN, data)
  }

  getToken() {
    return localStorage.getItem(TOKEN)
  }

  removeToken() {
    localStorage.removeItem(TOKEN)
  }
}
