import { IEntity } from "./app.model";
import { IComment } from "./comments.model";
import { IUserSmall } from "./user.model";

interface IPostBase extends IEntity {
  title: string;
  content: string;
  forumId: string;
  tags: string[];
  isPinned?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IPost extends IPostBase {
  author: IUserSmall;
  comments?: IComment[];
  _count?: { comments?: number; uniqueView?: number };
}
export interface IPostDto extends IPostBase {
  createdAt?: Date;
  updatedAt?: Date;
  authorId: string;
}
export interface IPostFilter extends IEntity {
  title?: string;
  forumTitle?: string;
  authorName?: string;
  page?: number;
  limit?: number;
  uniqueView?: number;
}
