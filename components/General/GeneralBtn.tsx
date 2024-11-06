interface props {
  children: React.ReactNode;
  onClick?: () => void;
  btnType?: "submit" | "reset" | "button";
}
export default function GeneralBtn({ onClick, children, btnType }: props) {
  return (
    <button
      onClick={onClick}
      type={btnType}
      className="bg-white text-black px-6 py-4 rounded-lg font-semibold  h-fit flex items-center w-fit"
    >
      {children}
    </button>
  );
}
