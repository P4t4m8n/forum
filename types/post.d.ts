interface IPostBase extends IEntity {
  title: string;
  content: string;
  createdAt?: Date;
  viewCount?: number;
  likeCount?: number;
  forumId: string;
  threadId: string;
}

declare interface IPostSmall extends IPostBase {
  author: IUserSmall;
  lastCommentAt?: Date;
}
declare interface IPost extends IPostSmall {
  isPinned?: boolean;
  comments?: IComment[];
  tags: string[];
  updatedAt?: Date;
  commentsAmount?: number;
}
declare interface IPostDto extends IPostBase {
  createdAt?: Date;
  updatedAt?: Date;
  authorId: string;
}
declare interface IPostFilter extends IEntity {
  title?: string;
  forumTitle?: string;
  authorName?: string;
  page?: number;
  pageSize?: number;
  uniqueView?: number;
}
