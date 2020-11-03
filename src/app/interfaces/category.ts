import { Product } from './product';

export interface Category {
    _id: string;
    name: string;
    description: string;
    pharmacy: string;
    imageUrl: string;
    products: {
        product_id: {
            product: Product;
        };
    };
}
