interface Props {
  field: Field;
}
export default function Radio({ field }: Props) {
  const { name, label, options, defaultValue, ...rest } = field;

  return (
    <div className="">
      <label>{label}</label>
      <div className="flex flex-warp items-center justify-around border p-4 rounded border-gray-900">
        {options?.map((option) => (
          <label key={option.value} htmlFor={`${name}_${option.value}`}>
            <input
              name={name}
              id={`${name}_${option.value}`}
              value={option.value}
              defaultChecked={defaultValue === option.value}
              className="peer hidden"
              {...rest}
            />
            <span
              className="text-sm border  border-transparent peer-checked:border-slate-300  hover:border-white flex items-center gap-2 rounded-md px-4 py-2 cursor-pointer transition-all 
            peer-checked:shadow-md "
            >
              {option.display || option.value}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
