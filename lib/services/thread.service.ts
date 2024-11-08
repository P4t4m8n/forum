const toDTO = (thread: IThread): IThreadDto => {
  const { moderators, ...rest } = thread;
  return { ...rest, moderators: moderators.map((m) => m?.id || "") };
};

const getEmpty = (): IThread => {
  return {
    title: "",
    description: "",
    forumId: "",
    moderators: [],
    posts: [],
  };
};
export const threadService: TServiceConfig<IThread, IThreadDto> = {
  tableName: "threads",
  toDTO,
  getEmpty,
};
