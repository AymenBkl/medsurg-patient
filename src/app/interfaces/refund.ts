import { Order } from "./order";
import { User } from "./user";

export interface Refund {
    patient: User;
    order: Order;
    payedByAdmin:string;
    refundPrice:number;
}