interface IThreadBase extends IEntity {
  title: string;
  description: string;
  createdAt?: Date;
  forumId: string;

}

declare interface IThreadSmall extends IThreadBase {
  latestPost: IPostSmall | null;
  likedPost: IPostSmall | null;
  viewedPost: IPostSmall | null;
  postCount: number | null;
  likeCount: number | null;
}
declare interface IThread extends IThreadBase {
  moderators: IUserSmall[];
  posts: IPost[];
}
declare interface IThreadDto extends IThreadBase {
  moderators: string[];
  updatedAt?: Date;
}
declare interface IThreadFilter extends IEntity {
  title?: string;
  postName?: string;
  take?: number;
  skip?: number;
  sortBy?: "createdAt" | "updatedAt" | "uniqueView" | "asc" | "desc";
}
