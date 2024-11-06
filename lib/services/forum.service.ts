const toDTO = (forum: IForum): IForumDto => {
  const { admins, ...rest } = forum;
  return { ...rest, admins: admins.map((a) => a?.id || "") };
};

const getEmpty = (): IForum => ({
  title: "",
  description: "",
  type: "discussions",
  admins: [],
  threads: [],
});

export const forumService: TServiceConfig<IForum, IForumDto> = {
  tableName: "forum",
  toDTO,
  getEmpty,
};
