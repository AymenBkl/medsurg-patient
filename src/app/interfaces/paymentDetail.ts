import { User } from "./user";

export interface PaymentDetail {
    bankAccountNumber: string;
    IFSCCODE: string;
    ACCOUNTHOLDERNAME: string;
    user: User;
}