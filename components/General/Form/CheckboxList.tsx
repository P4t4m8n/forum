interface Props {
  field: Field;
  error?: string;
}

export default function CheckboxList({ field, error }: Props) {
  const { name, label, defaultValue } = field;
  return (
    <div>
      <label className="" htmlFor={name}>
        {label}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </label>
      <ul className=" flex flex-warp gap-8 items-center  border p-4 rounded border-gray-900">
        {field?.options?.map((option) => (
          <li key={option.value} className="">
            <input
              type="checkbox"
              id={option.value}
              name={name}
              value={option.value}
              className="peer hidden"
              defaultChecked={(defaultValue as string[])?.includes(
                option.value
              )}
            />

            <label
              htmlFor={option.value}
              className="flex-col w-32 border border-transparent peer-checked:border-slate-700  hover:border-white flex items-center gap-2 rounded-md px-4 py-2 cursor-pointer transition-all "
            >
              {option.display}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
