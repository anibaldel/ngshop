import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService,Category } from '@anibal/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit {

  form!: FormGroup;
  isSubmited= false;
  editMode = false;
  currentCategoryId! : string;

  get categoryForm() {
    return this.form.controls;
  }

  constructor(private formBuilder: FormBuilder,
              private categoriesService: CategoriesService,
              private messageService: MessageService,
              private location: Location,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#fff']
    });

    this._checkEditMode();
  }
  onCancel() {
    this.location.back();
  }

  onSubmit() {
    this.isSubmited = true;
    if(this.form.invalid) {
      return;
    }
    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm.name.value,
      icon: this.categoryForm.icon.value,
      color: this.categoryForm.color.value
    }
    if(this.editMode) {
      this._updateCategory(category);
    } else {
      this._addCategory(category);
    }
    
  }

  private _addCategory(category: Category) {
    this.categoriesService.createCategory(category)
      .subscribe((category:Category) => {
        this.messageService.add({
          severity:'success', 
          summary:'Exito!', 
          detail:`Categoria ${category.name} creada`
        });
        timer(2000).toPromise().then(()=> {
          this.location.back();
        })
      },
      ()=> {
        this.messageService.add({
          severity:'error', 
          summary:'Error!', 
          detail:'La categoria no se pudo crear'
        });
      });
  }
  private _updateCategory(category: Category) {
    this.categoriesService.updateCategory(category)
      .subscribe(() => {
        this.messageService.add({
          severity:'success', 
          summary:'Exito!', 
          detail:'Categoria actualizada'
        });
        timer(2000).toPromise().then(()=> {
          this.location.back();
        })
      },
      ()=> {
        this.messageService.add({
          severity:'error', 
          summary:'Error!', 
          detail:'La categoria no se pudo actualizar'
        });
      });
  }

  private _checkEditMode() {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.editMode = true;
        this.currentCategoryId = params.id;
        this.categoriesService.getCategory(params.id)
          .subscribe(category=> {
            this.categoryForm.name.setValue(category.name);
            this.categoryForm.icon.setValue(category.icon);
            this.categoryForm.color.setValue(category.color);
          })
      }
    })

  }

}
