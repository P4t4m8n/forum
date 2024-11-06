import React, { FormEvent } from "react";
import Input from "./Form/Input";
import TextArea from "./Form/TextArea";
import { CheckBox } from "./Form/CheckBox";
import Radio from "./Form/Radio";
import Select from "./Form/Select";
import CheckboxList from "./Form/CheckboxList";
import GeneralBtn from "./GeneralBtn";

interface DynamicFormProps {
  schema: Field[];
  onSubmit: (formData: FormData) => void;
}

const GeneralForm: React.FC<DynamicFormProps> = ({ schema, onSubmit }) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const renderField = (field: Field) => {
    const { type } = field;

    switch (type) {
      case "text":
      case "email":
      case "password":
      case "number":
      case "date":
        return <Input field={field} key={field.name} />;
      case "textarea":
        return <TextArea field={field} key={field.name} />;
      case "select":
        return <Select field={field} key={field.name} />;
      case "checkbox":
        return <CheckBox field={field} key={field.name} />;
      case "radio":
        return <Radio field={field} key={field.name} />;
      case "multiSelectCheckBox":
        return <CheckboxList key={field.name} field={field} />;
      default:
        return null;
    }
  };

  return (
    <form
      className="text-white flex flex-col   gap-6 forum-form"
      onSubmit={handleSubmit}
    >
      {schema.map((field) => renderField(field))}
      <div className="self-center">
        <GeneralBtn btnType="submit">Submit</GeneralBtn>
      </div>
    </form>
  );
};

export default GeneralForm;
