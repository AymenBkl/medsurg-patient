import { Product } from "./product";
import { User } from "./user";

export interface Comment {
    _id:string;
    pharmacy: User,
    createdAt: string;
    status:string;
    products: {product: Product,quantity: number}[];
}
