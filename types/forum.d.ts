interface IForumBase extends IEntity {
  title: string;
  description: string;
  type: string;
  createdAt?: Date;
}

declare interface IForum extends IForumBase {
  admins: IUserSmall[];
  threads: IThread[];
  totalPosts: number;
}
declare interface IForumDto extends IForumBase {
  admins: string[];
  updatedAt?: Date;
}
declare interface IForumFilter extends IEntity {
  title?: string;
  postName?: string;
  type?: string;
  take?: number;
  skip?: number;
  uniqueView?: number;
  sortBy?: "createdAt" | "updatedAt" | "uniqueView" | "asc" | "desc";
}
