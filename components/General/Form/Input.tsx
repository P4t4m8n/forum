interface Props {
  field: Field;
}

export default function Input({ field }: Props) {
  const { type, name, label, placeholder, defaultValue, ...rest } = field;
  return (
    <div key={name} className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
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
