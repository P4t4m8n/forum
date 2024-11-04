import { IEntity } from "./app.model";

export interface IUserSmall extends IEntity {
  imgUrl: string;
  username: string;
  permission?: string;
}
export interface IUser extends IUserSmall {
  email: string;
  firstName?: string;
  lastName?: string;
}
export interface IUserDto extends IUser {
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUserFilter extends IEntity {
  username?: string;
  id?: string;
  email?: string;
  take?: number;
  page?: number;
  firstName?: string;
  lastName?: string;
  permission?: string;
}
