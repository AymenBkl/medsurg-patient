import { Product } from "./product";
import { Referal } from "./referal";
import { User } from "./user";

export interface Order {
    patient: User;
    products: Product[];
    pharmacy: User;
    referal: Referal;
    totalPrice: number;
}