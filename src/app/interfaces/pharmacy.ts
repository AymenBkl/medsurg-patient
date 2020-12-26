
import { OrderProduct } from './orderCart';


export interface Pharmacy {
   _id: string;
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    role: string;
    token: string;
    imageUrl: string;
    setup: boolean;
    emailVerified: boolean;
    products: OrderProduct[];
}
