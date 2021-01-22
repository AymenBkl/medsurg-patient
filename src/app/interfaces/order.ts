import { Address } from "./address";
import { OrderProduct } from "./orderCart";
import { Referal } from "./referal";
import { User } from "./user";

export interface Order {
    _id: string;
    patient: User;
    products: OrderProduct[];
    pharmacy: User;
    referal: Referal;
    totalPrice: number;
    status: string;
    method:string;
    createdAt:string;
    address:Address;
}