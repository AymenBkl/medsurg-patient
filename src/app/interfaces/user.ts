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
}
