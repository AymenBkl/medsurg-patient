import { Prescription } from "./prescription";

export interface PrescriptionResponse {
    err: string;
    success: boolean;
    token: string;
    msg: string;
    status: number;
    prescription: Prescription;
}
