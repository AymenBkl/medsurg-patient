import { SearchProduct } from './searchproduct';
export interface SearchResponse {
    err: string;
    success: boolean;
    token: string;
    msg: string;
    status: number;
    product: [SearchProduct];
}
