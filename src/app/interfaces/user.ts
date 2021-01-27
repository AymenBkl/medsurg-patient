import { Address } from "./address";
import { PaymentDetail } from "./paymentDetail";

export interface User {
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
    phoneNumber:number;
    addresses:Address[];
    paymentDetail: PaymentDetail;
}
