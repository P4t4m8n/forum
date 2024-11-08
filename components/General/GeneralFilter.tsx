import Form from "next/form";

interface Props {
  type: string;
}

export const GeneralFilter = ({ type }: Props) => {
  return (
    <Form className="flex items-center gap-2 " action={type}>
      <input
        className="bg-white text-black px-6 py-4 rounded-lg font-semibold"
        type="text"
        name="search"
        placeholder="Search"
      />
      <button
        className="bg-white text-black px-6 py-4 rounded-lg font-semibold"
        type="submit"
      >
        Search
      </button>
    </Form>
  );
};
