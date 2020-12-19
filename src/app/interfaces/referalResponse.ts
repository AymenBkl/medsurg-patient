import { Referal } from './referal';

export interface ReferalResponse {
    err: string;
    success: boolean;
    msg: string;
    status: number;
    message: Referal | Referal[] | any;
}
