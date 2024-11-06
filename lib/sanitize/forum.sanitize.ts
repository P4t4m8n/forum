import xss from "xss";

export const sanitizeForumForm = (formData: FormData): IForumDto => {
  try {
    const title = xss(formData.get("title")?.toString() || "");
    const description = xss(formData.get("description")?.toString() || "");
    const type = xss(formData.get("type")?.toString() || "");
    const subjects = formData
      .getAll("subjects")
      .map((subject) => xss(subject.toString()));
    const admins = formData
      .getAll("admins")
      .map((admin) => xss(admin.toString()));
    const id = formData.get("id") as string;

    const forumDto: IForumDto = {
      title,
      description,
      type,
      subjects,
      admins,
      id,
    };

    return forumDto;
  } catch (error) {
    throw error;
  }
};
