import ThreadPreview from "./ThreadPreview";

interface Props {
  threads: IThreadSmall[];
}
export default function ThreadList({ threads }: Props) {
  return (
    <ul className="flex flex-col w-full">
      {threads.map((thread) => (
        <ThreadPreview thread={thread} key={thread.id} />
      ))}
    </ul>
  );
}
