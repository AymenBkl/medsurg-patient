import { Category } from './category';
import { User } from './user';

export interface Pharmacy {
   pharmacy: User;
   categories: [{
    category: Category;
   }];
}
