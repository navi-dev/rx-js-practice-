import { ProductCategory } from './../model/product-category.model';
import { Product } from './../model/product.model';
import { CommonHttpServiceService } from './../../shared/service/common-http-service.service';
import { Injectable } from '@angular/core';
import { Observable, EMPTY, forkJoin, combineLatest } from 'rxjs';
import { finalize, catchError, map, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class ProductService {

  constructor(private commonHttpServiceService: CommonHttpServiceService) { }

  getProduct(): Observable<Array<Product>> {
    return this.commonHttpServiceService.get<Array<Product>>('product');
  }

  getProductCategories(): Observable<Array<ProductCategory>> {
    return this.commonHttpServiceService.get<Array<ProductCategory>>('productCategories');
  }


  /**
   * Fork join emits stream when all the streams are completed.
   */
  getproductCategoriesForkJoin(): Observable<Array<Product>> {
    const producateCategory$ = forkJoin(
      [
        this.getProduct(), // this.products$,
        this.getProductCategories(), // this.categories$
      ]
    ).pipe(map(([products, categories]) =>
      products.map((product) => {
        const category = categories.find(elem => elem.id === product.categoryId);
        console.log(category);
        const productVM: Product = {
          ...product,
          categoryName: category ? category.name : '',
        };

        return productVM;
      })
    ));

    return producateCategory$;
  }


  getProductCategoriesCombinLatest(): Observable<Array<Product>> {
    const products$ = this.getProduct();
    const categories$ = this.getProductCategories();
    return combineLatest([products$, categories$])
      .pipe(map(([products, categories]) => {
        return products.map((product) => {
          const category = categories.find(elem => elem.id === product.categoryId);
          const productVM: Product = {
            ...product,
            categoryName: category.name
          };

          return productVM;
        });
      }));
  }

  getProductCategoriesWithLatestFrom(): Observable<Array<Product>> {
    const products$ = this.getProduct();
    const categories$ = this.getProductCategories();
    return products$.pipe(
      withLatestFrom(categories$),
      map(([products, categories]) => {
        return products.map((product) => {
          const categoryVM = categories.find(elem => elem.id === product.categoryId);
          const productVM: Product = {
            ...product,
            categoryName: categoryVM.name
          };

          return productVM;
        });
      })
    );
  }
}
