interface Props {
  field: Field;
}
export default function Select({ field }: Props) {
  const { name, label, options, defaultValue, ...rest } = field;
  return (
    <div key={name} className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        name={name}
        id={name}
        defaultValue={defaultValue as string}
        {...rest}
      >
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.display || option.value}
            </option>
          ))}
      </select>
    </div>
  );
}
