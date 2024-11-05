/**
 * Formats a given date string or Date object into a human-readable string.
 *
 * @param dateString - The date string or Date object to format. If not provided, defaults to "No date provided".
 * @returns A formatted date string. Possible return values include:
 * - "No date provided" if the input is undefined.
 * - "Invalid date provided" if the input cannot be parsed into a valid date.
 * - "In the future" if the input date is in the future.
 * - A string representing the difference in hours if the input date is today.
 * - "Yesterday" if the input date is one day ago.
 * - A string representing the difference in days if the input date is within the last week.
 * - A formatted date string in "MMM D" or "MMM D, YYYY" format if the input date is older than a week.
 */
const formatDate = (dateString?: string | Date): string => {
  if (!dateString) return "No date provided";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date provided";

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.trunc(diffInMs / 36e5); // 1000 * 60 * 60
  const diffInDays = Math.trunc(diffInMs / 864e5); // 1000 * 60 * 60 * 24

  if (diffInDays < 0) return "In the future";

  if (diffInDays === 0) return `${diffInHours}h`;
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d`;

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    ...(now.getFullYear() !== date.getFullYear() && { year: "numeric" }),
  };

  return date.toLocaleDateString("en-US", options);
};



export const datesUtil = {
  formatDate,
};
