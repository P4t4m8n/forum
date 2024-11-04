import { IEntity } from "./app.model";
import { IUserSmall } from "./User.model";

interface ICommentBase extends IEntity {
  content: string;
  createdAt: Date;
  postId: string;
  parentId?: string | null;
}

export interface IComment extends ICommentBase {
  author: IUserSmall;
  replies?: IComment[];
  _count?: { replies?: number };
  likesAmount?: number;
  repliesAmount?: number;
}

export interface ICommentDto extends ICommentBase {
  authorId: string;
}

export interface ICommentFilter extends IEntity {
  parentId?: string;
  postTitle?: string;
  parentTitle?: string;
  authorName?: string;
}
