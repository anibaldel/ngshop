import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { Observable } from 'rxjs';
import { environment } from "@env/environment";
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  
  apiURLcategories = environment.apiUrl + 'categories';

  constructor(private http: HttpClient) {

  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiURLcategories)
  }
  getCategory(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiURLcategories}/${categoryId}`)
  }
  createCategory(category: Category) : Observable<Category> {
    return this.http.post<Category>(this.apiURLcategories,category)
  }
  updateCategory(category: Category) : Observable<Category> {
    return this.http.put<Category>(`${this.apiURLcategories}/${category.id}` ,category)
  }

  deleteCategory(categoryId: string) : Observable<any> {
    return this.http.delete<any>(`${this.apiURLcategories}/${categoryId}`)
  }


}
