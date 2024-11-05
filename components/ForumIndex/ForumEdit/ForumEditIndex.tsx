"use client";

import GeneralForm from "@/components/General/GeneralForm";
import { saveForum } from "@/lib/actions/forum.actions";
// import { useState } from "react";

interface Props {
  forum: IForum;
  admins: IUserSmall[];
  types: string[];
  subjects: string[];
}
export default function ForumEditIndex({
  forum,
  admins,
  types,
  subjects,
}: Props) {
  //   const [errors, setErrors] = useState<Record<string, string>>({
  //     title: "",
  //     description: "",
  //     type: "",
  //     admins: "",
  //     subjects: "",
  //   });

  const schema: Field[] = [
    {
      name: "title",
      label: "Title",
      type: "text",
      defaultValue: forum.title,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      defaultValue: forum.description,
    },
    {
      name: "type",
      label: "Type",
      type: "radio",
      options: types.map((type) => ({ value: type })),
      defaultValue: forum.type,
    },
    {
      name: "admins",
      label: "Admins",
      type: "multiSelectCheckBox",
      options: admins.map((admin) => ({
        value: admin.id!,
        display: admin.username,
      })),
      defaultValue: forum.admins.map((admin) => admin.id!),
    },
    {
      name: "subjects",
      label: "Subjects",
      type: "multiSelectCheckBox",
      options: subjects.map((subject) => ({ value: subject })),
      defaultValue: forum.subjects,
    },
  ];

  const onSubmit = async (formData: FormData) => {
    try {
      const x = await saveForum(formData);
      console.log(" x:", x);
    } catch (error) {
      console.error(error);
    }
  };

  return <GeneralForm schema={schema} onSubmit={onSubmit} />;
}
