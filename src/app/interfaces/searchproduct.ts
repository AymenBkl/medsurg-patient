import { Pharmacy } from './pharmacy';
import { User } from './user';

export interface SearchProduct {
    product: {
        pharmacy_id: {
            pharmacy: Pharmacy
        }
    };
}
