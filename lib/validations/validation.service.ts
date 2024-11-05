/**
 * Validates the title input.
 * @param title - The title to validate.
 * @returns A string with an error message if the title is invalid, otherwise null.
 */
const validateLength = (
  str: string,
  length: number,
  filedName: string
): string | null => {
  if (str.trim().length < length) {
    return `${filedName} must be at least ${length} characters long.`;
  }
  return null;
};

const validateArrayLength = (
  arr: unknown[],
  length: number,
  filedName: string
): string | null => {
  if (arr.length < length) {
    return `At least ${length} ${filedName} is required.`;
  }
  return null;
};

const validateExistence = (item: unknown, filedName: string): string | null => {
  if (!item) {
    return `${filedName} is required.`;
  }
  return null;
};

const validateLettersAndNumbers = (
  type: string,
  filedName: string
): string | null => {
  if (!/^[a-zA-Z0-9]+$/.test(type)) {
    return `${filedName} contain only letters and numbers.`;
  }
  return null;
};

export const validationService = {
  validateLength,
  validateArrayLength,
  validateExistence,
  validateLettersAndNumbers,
};
