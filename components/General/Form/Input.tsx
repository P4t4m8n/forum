interface Props {
  field: Field;
}

export default function Input({ field }: Props) {
  const { type, name, label, placeholder, defaultValue, ...rest } = field;
  return (
    <div key={name} className=" flex flex-col w-full gap-1">
      <label htmlFor={name}>{label}</label>
      <input
        className="bg-inherit border rounded p-2 font-semibold "
        type={type}
        name={name}
        id={name}
        defaultValue={defaultValue as string | number}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}
