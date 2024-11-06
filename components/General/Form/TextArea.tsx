interface Props {
  field: Field;
}

export default function TextArea({ field }: Props) {
  const { name, label, placeholder, defaultValue, ...rest } = field;
  return (
    <div key={name} className=" flex flex-col w-full gap-1">
      <label htmlFor={name}>{label}</label>
      <textarea
        className="bg-inherit border rounded p-1 font-semibold resize-none "
        name={name}
        id={name}
        defaultValue={defaultValue as string}
        placeholder={placeholder}
        {...rest}
        maxLength={255}
      />
    </div>
  );
}
