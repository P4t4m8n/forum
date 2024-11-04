import { IEntity } from "./app.model";
import { IPost } from "./post.model";
import { IUserSmall } from "./User.model";

interface IForumBase extends IEntity {
  title: string;
  description: string;
  type: string;
  subjects: string[];
  createdAt?: Date;
}
export interface IForum extends IForumBase {
  admins: IUserSmall[];
  posts: IPost[];
  _count?: { posts: number; uniqueView: number };
}
export interface IForumDto extends IForumBase {
  admins: string[];
  updatedAt?: Date;
}
export interface IForumFilter extends IEntity {
  title?: string;
  postName?: string;
  type?: string;
  subject?: string[];
  take?: number;
  skip?: number;
  uniqueView?: number;
  sortBy?: "createdAt" | "updatedAt" | "uniqueView" | "asc" | "desc";
}

