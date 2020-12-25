import { MainProduct } from "./mainProduct";

export interface CartProduct {
    mainProduct: MainProduct;
    quantity: number;
}