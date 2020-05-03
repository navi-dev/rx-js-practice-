import { Product } from './../model/product.model';
import { CommonHttpServiceService } from './../../shared/service/common-http-service.service';
import { ProductCategory } from './../model/product-category.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { pipe, EMPTY, Observable, forkJoin, combineLatest } from 'rxjs';
import { finalize, catchError, take, map } from 'rxjs/operators';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  displayedColumns: string[] = ['name', 'category', 'price'];
  spinner: boolean;
  productCategories$: Observable<Array<Product>>;
  categories$: Observable<Array<ProductCategory>>;
  searchFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.setSpinnerValue(true);
    this.createSearchForm();
    // this.searchProductsWithForJoin();
    // this.searchProductsWithCombineLatest();
    this.searchProductsWithWithLatestFrom();
  }

  createSearchForm() {
    this.searchFormGroup = this.formBuilder.group({
      name: [''],
      categoryId: [''],
      mobileNumber: [''],
    });
  }


  searchProductsWithForJoin() {
    this.setSpinnerValue(false);
    this.productCategories$ = this.productService.getproductCategoriesForkJoin()
      .pipe(finalize(() => {
        this.setSpinnerValue(false);
      }), catchError((error) => {
        this.setSpinnerValue(false);
        throw error;
      }));
  }

  searchProductsWithCombineLatest() {
    this.setSpinnerValue(false);
    this.productCategories$ = this.productService.getProductCategoriesCombinLatest()
      .pipe(finalize(() => {
        this.setSpinnerValue(false);
      }), catchError((error) => {
        this.setSpinnerValue(false);
        throw error;
      }));
  }


  searchProductsWithWithLatestFrom() {
    this.setSpinnerValue(false);
    this.productCategories$ = this.productService.getProductCategoriesWithLatestFrom()
      .pipe(finalize(() => {
        this.setSpinnerValue(false);
      }), catchError((error) => {
        this.setSpinnerValue(false);
        throw error;
      }));
  }

  showSpinner(): boolean {
    return this.spinner;
  }

  setSpinnerValue(show: boolean) {
    this.spinner = show;
  }
}
