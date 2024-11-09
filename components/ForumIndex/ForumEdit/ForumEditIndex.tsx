"use client";

import GeneralForm from "@/components/General/GeneralForm";
import { saveForum } from "@/lib/actions/forum.action";
import Image from "next/image";
// import { useState } from "react";

interface Props {
  forum: IForum;
  admins: IUserSmall[];
  types: string[];
}
export default function ForumEditIndex({ forum, admins, types }: Props) {
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
      label: <p className=" font-medium pb-1">Title</p>,
      type: "text",
      defaultValue: forum.title,
      placeholder: "Enter forum name",
    },
    {
      name: "description",
      label: <p className=" font-medium pb-1">Description</p>,
      type: "textarea",
      defaultValue: forum.description,
    },
    {
      name: "type",
      label: <p className=" font-medium pb-1">Type</p>,
      type: "radio",
      options: types.map((type) => ({ value: type })),
      defaultValue: forum.type,
    },
    {
      name: "admins",
      label: <p className=" font-medium pb-1">Admins</p>,
      type: "multiSelectCheckBox",
      options: admins.map((admin) => ({
        value: admin.id!,
        display: (
          <>
            <Image
              src={admin.imgUrl}
              width={64}
              height={64}
              className="rounded-full h-16 w-16 object-fill"
              alt="avatar"
            />
            <span className="">{admin.username}</span>
          </>
        ),
      })),
      defaultValue: forum.admins.map((admin) => admin.id!),
    },
  ];

  // const onSubmit = async (formData: FormData) => {
  //   try {
  //     await saveForum(formData);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="px-[20vw] py-6">
      <h2 className="text-white pb-2 mb-2 text-lg font-medium border-b border-gray-900 ">
        {forum?.id ? "Edit Forum," : "Create Forum"}
      </h2>
      <GeneralForm schema={schema} onSubmit={saveForum} />
    </div>
  );
}
