import { Address } from "./address";
import { OrderProduct } from "./orderCart";
import { PaymentStatus } from "./paymentStatus";
import { Referal } from "./referal";
import { Refund } from "./refund";
import { User } from "./user";

export interface Order {
    _id: string;
    patient: User;
    products: OrderProduct[];
    pharmacy: User;
    referal: {referal: Referal,payedByAdmin:string,commissionApplied:number};
    totalPrice: number;
    status: string;
    method:string;
    createdAt:string;
    address:Address;
    paymentStatus:PaymentStatus;
    refund: {refund: Refund,payedByAdmin:string,commissionApplied:number};
    payedByAdmin:string;
}