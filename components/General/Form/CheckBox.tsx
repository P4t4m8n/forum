interface Props {
  field: Field;
}
export const CheckBox = ({ field }: Props) => {
  const { name, label, defaultValue, ...rest } = field;
  return (
    <div key={name} className="form-group">
      <label htmlFor={name}>
        <input
          name={name}
          id={name}
          defaultChecked={defaultValue as boolean}
          {...rest}
        />
        {label}
      </label>
    </div>
  );
};
