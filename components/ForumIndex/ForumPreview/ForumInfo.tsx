interface Props {
  title: string;
  description: string;
  subjects: string[];
}
const ForumInfo = ({ title, description, subjects }: Props) => {
  return (
    <div className="flex flex-col gap-2 h-full  ">
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
      <p className="text text-gray-400 line-clamp-3">{description}</p>
      <ul className="flex gap-1 mt-auto">
        {subjects.map((subject) => (
          <li
            className="bg-gray-900 rounded-lg w-fit p-1 px-2 flex items-center gap-1"
            key={subject}
          >
            <p className="bg-purple-800 w-2 h-2 rounded-full"></p>
            <h5 className="text-sm">{subject}</h5>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForumInfo;
