import { MainProduct } from "./mainProduct";

export interface Product {
    _id: string;
    description: string;
    price: number;
    imageUrl: string;
    mainProduct : MainProduct;
    quantity: number;
}
