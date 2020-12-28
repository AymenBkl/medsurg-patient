import { Injectable } from '@angular/core';
import { CartProduct } from '../interfaces/cartProduct';
import { MainProduct } from '../interfaces/mainProduct';
import { Product } from '../interfaces/product';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async storeUser(user: User) {
    console.log(user);
    await localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User  {
    const  user  = JSON.parse(localStorage.getItem('user'));
    if (user && user != null){
      return user;
    }
    else {
      return null;
    }
  }

  getToken(): string {
    const  user: User  = JSON.parse(localStorage.getItem('user'));
    if (user && user != null){
      return user.token;
    }
    else {
      return '';
    }
  }

  removeUser() {
    localStorage.removeItem('user');
  }

  async getAllCartProduct(){
    return await JSON.parse(localStorage.getItem('cartProducts'))
  }

  async addToCart(products: {}){
    await localStorage.setItem('cartProducts',JSON.stringify(products));
  }

  async quntityModifiedCart(products: {}){
    await localStorage.setItem('cartProducts',JSON.stringify(products));
  }

  async removeMedecin(cartProducts: {},selectedProduct: CartProduct){
    delete cartProducts[selectedProduct.mainProduct._id];
    await localStorage.setItem('cartProducts',JSON.stringify(cartProducts));
  }

  async clearProductCart(){
    await localStorage.removeItem('cartProducts');

  }

}
