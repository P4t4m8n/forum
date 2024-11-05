import { IEntity } from "./app.model";
import { IComment } from "./comments.model";
import { IUserSmall } from "./user.model";

interface IPostBase extends IEntity {
  title: string;
  content: string;
  createdAt?: Date;
  viewCount?: number;
  likeCount?: number;
}

export interface IPostSmall extends IPostBase {
  author: IUserSmall;
  lastCommentAt?: Date;
}
export interface IPost extends IPostSmall {
  isPinned?: boolean;
  comments?: IComment[];
  tags: string[];
  updatedAt?: Date;
  commentsAmount?: number;
}
export interface IPostDto extends IPostSmall {
  createdAt?: Date;
  updatedAt?: Date;
  authorId: string;
  forumId: string;
}
export interface IPostFilter extends IEntity {
  title?: string;
  forumTitle?: string;
  authorName?: string;
  page?: number;
  limit?: number;
  uniqueView?: number;
}
