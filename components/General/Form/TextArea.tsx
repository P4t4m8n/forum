interface Props {
  field: Field;
}

export default function TextArea({ field }: Props) {
  const { name, label, placeholder, defaultValue, ...rest } = field;
  return (
    <div key={name} className="form-group">
      <label htmlFor={name}>{label}</label>
      <textarea
        name={name}
        id={name}
        defaultValue={defaultValue as string}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}
