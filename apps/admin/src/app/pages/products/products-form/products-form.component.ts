import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category, ProductsService, Product  } from '@anibal/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit {

  editmode = false;
  form!: FormGroup;
  isSubmitted= false;
  categories: Category[] = [];
  imageDisplay!: string | ArrayBuffer | undefined | null;
  currentProductId!: string;

  get productForm() {
    return this.form.controls;
  }
  constructor(private formBuilder: FormBuilder,
              private categoriesService: CategoriesService,
              private productsService: ProductsService,
              private messageService: MessageService,
              private location: Location,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false]
    });
  }
  _getCategories() {
    this.categoriesService.getCategories()
      .subscribe(categories=> {
        this.categories = categories;
      })

  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.form.invalid) return;
    const productFormData = new FormData();
    Object.keys(this.productForm).map((key)=> {
      
      productFormData.append(key, this.productForm[key].value);
    });
    if(this.editmode) {
      this._updateProduct(productFormData)
    } else {
      this._addProduct(productFormData);
    }

  }
  private _addProduct(productData: FormData) {
    this.productsService.createProduct(productData)
      .subscribe((product: Product) => {
        this.messageService.add({
          severity:'success', 
          summary:'Exito!', 
          detail:`Producto ${product.name} creado`
        });
        timer(2000).toPromise().then(()=> {
          this.location.back();
        })
      },
      ()=> {
        this.messageService.add({
          severity:'error', 
          summary:'Error!', 
          detail:'El producto no se pudo crear'
        });
      });
  }
  private _updateProduct(productData: FormData) {
    this.productsService.updateProduct(productData,this.currentProductId)
      .subscribe((product: Product) => {
        this.messageService.add({
          severity:'success', 
          summary:'Exito!', 
          detail:`Producto ${product.name} actualizado`
        });
        timer(2000).toPromise().then(()=> {
          this.location.back();
        })
      },
      ()=> {
        this.messageService.add({
          severity:'error', 
          summary:'Error!', 
          detail:'El producto no se pudo actualizar'
        });
      });

  }
  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editmode = true;
        this.currentProductId = params.id;
        this.productsService.getProduct(params.id).subscribe((product) => {
          this.productForm.name.setValue(product.name);
          this.productForm.category.setValue(product.category?.id);
          this.productForm.brand.setValue(product.brand);
          this.productForm.price.setValue(product.price);
          this.productForm.countInStock.setValue(product.countInStock);
          this.productForm.isFeatured.setValue(product.isFeatured);
          this.productForm.description.setValue(product.description);
          this.productForm.richDescription.setValue(product.richDescription);
          this.imageDisplay = product.image;
          this.productForm.image.setValidators([]);
          this.productForm.image.updateValueAndValidity();
        });
      }
    });

  }
  onCancel() {
    this.location.back();
  }
  onImageUpload(event: any) {

    const file = event.target.files[0];
    if(file) {
      this.form.patchValue({image: file});
      this.form.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result
      }
      fileReader.readAsDataURL(file);
    }
    
  }

}
