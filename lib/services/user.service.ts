const toDTO = (user: IUser): IUserDto => {
  const { ...rest } = user;
  return { password: "", ...rest };
};

const getEmpty = (): IUser => {
  return {
    username: "",
    email: "",
    imgUrl: "",
  };
};

export const userService: TServiceConfig<IUser, IUserDto> = {
  tableName: "users",
  toDTO,
  getEmpty,
};
