import { IForum, IForumDto } from "@/models/forum.model";

const toDTO = (forum: IForum): IForumDto => {
  const { admins, ...rest } = forum;
  return { ...rest, admins: admins.map((a) => a?.id || "") };
};

const getEmpty = (): IForum => ({
  title: "",
  description: "",
  type: "public",
  admins: [],
  subjects: ["general"],
  posts: [],
});

export const forumService: TServiceConfig<IForum, IForumDto> = {
  tableName: "forum",
  toDTO,
  getEmpty,
};
