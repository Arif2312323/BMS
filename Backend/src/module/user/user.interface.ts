
export interface IUser{
    _id? : string;
    email : string;
    name : string;
    phone? : string;
    role : 'admin'|'user';
    activateUser? : boolean;
    createdAt : Date;
    updatetAt : Date;
}