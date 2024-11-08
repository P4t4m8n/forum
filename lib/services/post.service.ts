import { userService } from "./user.service";

const toDTO = (post: IPost): IPostDto => {
  const { author, title, content, forumId, threadId } = post;
  return { forumId, authorId: author.id!, title, content, threadId };
};

const getEmpty = (): IPost => {
  return {
    title: "",
    content: "",
    author: userService.getEmpty(),
    tags: [],
    forumId: "",
    threadId: "",
  };
};

export const postService: TServiceConfig<IPost, IPostDto> = {
  tableName: "posts",
  toDTO,
  getEmpty,
};
