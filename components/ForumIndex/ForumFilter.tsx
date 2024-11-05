import Form from "next/form";

const ForumFilter = () => {
  return (
    <Form className="flex items-center gap-2 " action={"/"}>
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

export default ForumFilter;
