import { Order } from "./order";
import { User } from "./user";

export interface Referal {
    owner: User;
    orders: Order[];
    code: string;
    commision: number;
}