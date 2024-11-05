interface Props {
  list: string[];
  field: Field;
  error?: string;
}

export default function CheckboxList({ list, field, error }: Props) {
  const { name, label, defaultValue } = field;
  return (
    <div>
      <label className="" htmlFor={name}>
        {label}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </label>
      <ul className="">
        {list.map((item) => (
          <li key={item} className="">
            <input
              type="checkbox"
              id={item}
              name={name}
              value={item}
              defaultChecked={(defaultValue as string[])?.includes(item)}
              className=""
            />

            <label htmlFor={item} className="f">
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
