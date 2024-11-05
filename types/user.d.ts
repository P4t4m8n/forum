declare interface IUserSmall extends IEntity {
  imgUrl: string;
  username: string;
  permission?: string;
}
declare interface IUser extends IUserSmall {
  email: string;
  firstName?: string;
  lastName?: string;
}
declare interface IUserDto extends IUser {
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
declare interface IUserFilter extends IEntity {
  username?: string;
  id?: string;
  email?: string;
  take?: number;
  page?: number;
  firstName?: string;
  lastName?: string;
  permission?: string;
}
