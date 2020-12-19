import { Product } from './product';
import { User } from './user';

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
      products: Product[];
}
