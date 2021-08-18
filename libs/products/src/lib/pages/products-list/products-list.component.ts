import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'anibal-products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit {

  products: Product[] = []
  categories: Category[] = []
  isCategoryPage!: boolean;

  constructor(private productsService: ProductsService,
              private categoriesService: CategoriesService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params=> {
      params.categoryid ? this._getProducts([params.categoryid])
        : this._getProducts()
      params.categoryid ? this.isCategoryPage = true : this.isCategoryPage = false;
    })
    this._getCategories();
  }
  private _getProducts(categoriesFilter?: (string | undefined)[]) {
    this.productsService.getProducts(categoriesFilter)
      .subscribe(resProducts=> {
        this.products = resProducts;
      })
  }
  private _getCategories() {
    this.categoriesService.getCategories()
      .subscribe(resCats => {
        this.categories = resCats;
      })
  }

  categoryFilter() {
    const selectedCategories = this.categories.
        filter(category=> category.checked)
        .map(category=> category.id);
    this._getProducts(selectedCategories);
  }

}
