import { userService } from "./user.service";

const toDTO = (post: IPost): IPostDto => {
  const { author, title, content, forumId } = post;
  return { forumId, authorId: author.id!, title, content };
};

const getEmpty = (): IPost => {
  return {
    title: "",
    content: "",
    author: userService.getEmpty(),
    tags: [],
    forumId: "",
  };
};

export const postService: TServiceConfig<IPost, IPostDto> = {
  tableName: "posts",
  toDTO,
  getEmpty,
};
