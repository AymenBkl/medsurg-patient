import { Comment } from './comment';

export interface Prescription {
    key: string;
    user_id: string;
    userFullName: string;
    userImage: string;
    description: string;
    imageUrl: string;
    date: string;
    comments: Comment[];
    status:string;
}
