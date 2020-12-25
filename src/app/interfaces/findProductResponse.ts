import { Product } from './product';
export interface FindProductResponse {
    err: string;
    success: boolean;
    token: string;
    msg: string;
    status: number;
    product: [Product];
}
