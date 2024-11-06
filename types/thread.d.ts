interface IThreadBase extends IEntity {
  title: string;
  description: string;
  createdAt?: Date;
}

declare interface IThreadSmall extends IThreadBase {
  latestPost: IPostSmall | null;
  likedPost: IPostSmall | null;
  viewedPost: IPostSmall | null;
  postCount: number | null;
  likedPost: number | null;
}
declare interface IThread extends IThreadBase {
  admins: IUserSmall[];
  posts: IPost[];
}
declare interface IThreadDto extends IThreadBase {
  admins: string[];
  updatedAt?: Date;
}
declare interface IThreadFilter extends IEntity {
  title?: string;
  postName?: string;
  take?: number;
  skip?: number;
  sortBy?: "createdAt" | "updatedAt" | "uniqueView" | "asc" | "desc";
}
