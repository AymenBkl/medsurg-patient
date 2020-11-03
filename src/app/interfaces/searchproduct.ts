import { Pharmacy } from './pharmacy';
import { User } from './user';

export interface SearchProduct {
        pharmacy: Pharmacy;
        pharmacy_id: string;
        totalPrice: number;
}
