import { Product } from "./product";
import { Referal } from "./referal";
import { User } from "./user";

export interface Order {
    _id: string;
    patient: User;
    products: Product[];
    pharmacy: User;
    referal: Referal;
    totalPrice: number;
    status: string;
    method:string;
    createdAt:string;
}