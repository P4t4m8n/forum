interface Props {
  field: Field;
}
export default function Radio({ field }: Props) {
  const { name, label, options,defaultValue,...rest } = field;
  return (
    <div key={name} className="form-group">
      <label>{label}</label>
      {options &&
        options.map((option) => (
          <label key={option.value} htmlFor={`${name}_${option.value}`}>
            <input
              name={name}
              id={`${name}_${option.value}`}
              value={option.value}
              defaultChecked={defaultValue === option.value}
              {...rest}
            />
            {option.display || option.value}
          </label>
        ))}
    </div>
  );
}
