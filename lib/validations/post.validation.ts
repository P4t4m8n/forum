import { validationService } from "./validation.service";

export const validatePostDto = (postDto: IPostDto): Record<string, string> => {
  const errors: Record<string, string> = {
    title: "",
    content: "",
    authorId: "",
    forumId: "",
    threadId: "",
  };

  const titleError = validationService.validateLength(
    postDto.title,
    2,
    "Title"
  );
  if (titleError) errors.title = titleError;

  const contentError = validationService.validateLength(
    postDto.content,
    1,
    "Content"
  );
  if (contentError) errors.content = contentError;

  const authorIdError = validationService.validateExistence(
    postDto.authorId,
    "Author ID"
  );
  if (authorIdError) errors.authorId = authorIdError;

  const forumIdError = validationService.validateExistence(
    postDto.forumId,
    "Forum ID"
  );
  if (forumIdError) errors.forumId = forumIdError;

  const threadIdError = validationService.validateExistence(
    postDto.threadId,
    "Thread ID"
  );
  if (threadIdError) errors.threadId = threadIdError;

  return errors;
};
