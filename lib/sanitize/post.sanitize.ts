import xss from "xss";

export const sanitizePostForm = (formData: FormData): IPostDto => {
  try {
    const title = xss(formData.get("title")?.toString() || "");
    const content = xss(formData.get("content")?.toString() || "");
    const id = formData.get("id") as string;
    const authorId = formData.get("authorId") as string;
    const forumId = formData.get("forumId") as string;
    const threadId = formData.get("threadId") as string;

    const postDto: IPostDto = {
      title,
      content,
      id,
      authorId,
      forumId,
      threadId,
    };

    return postDto;
  } catch (error) {
    throw error;
  }
};
