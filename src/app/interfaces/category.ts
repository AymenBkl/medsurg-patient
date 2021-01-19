import { MainProduct } from './mainProduct';

export interface Category {
    _id: string;
    name: string;
    description: string;
    Admin: string;
    products: MainProduct[] | string[]
    imageUrl: string;
}
