import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from '../../../services/crm/category.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {

  categories: Category[];
  sliderConfig = {
    slidesPerView: 2.2,
    spaceBetween: 0
  };
  constructor(private categoryService: CategoryService,
    private router: Router) {
  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    setTimeout(() => {
      this.categoryService.getAllCategories()
      .then((result: any) => {
        if (result && result !== false) {
          this.categories = result;
        }
        else {
          this.categories = [];
        }
      })
      .catch(err => {
        this.categories = [];
      });
    },3000)
    
  }


  goToSearchCategory(selectedCategory: string) {
    let navigationExtras: NavigationExtras = { state: { categorieId: selectedCategory } };
    this.router.navigate(['/tabs/tab4/search-categorie'], navigationExtras);
  }



}
