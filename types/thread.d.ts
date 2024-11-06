// interface IForumBase extends IEntity {
//     title: string;
//     description: string;
//     type: string;
//     createdAt?: Date;
//     totalPosts?: number | null;
//     viewCount?: number | null;
//   }
  
//   declare interface IThreadSmall extends IForumBase {
//     latestPost: IPostSmall | null;
//     likedPost: IPostSmall | null;
//     viewedPost: IPostSmall | null;
//   }
//   declare interface IForum extends IForumBase {
//     admins: IUserSmall[];
//     posts: IPost[];
//   }
//   declare interface IForumDto extends IForumBase {
//     admins: string[];
//     updatedAt?: Date;
//   }
//   declare interface IForumFilter extends IEntity {
//     title?: string;
//     postName?: string;
//     type?: string;
//     subject?: string[];
//     take?: number;
//     skip?: number;
//     uniqueView?: number;
//     sortBy?: "createdAt" | "updatedAt" | "uniqueView" | "asc" | "desc";
//   }
  