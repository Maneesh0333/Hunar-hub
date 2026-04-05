type PropsType = {
  setAvailability: React.Dispatch<
    React.SetStateAction<{
      "Available Today": boolean;
      "Home Service": boolean;
    }>
  >;
  item: "Available Today" | "Home Service";
  availability: {
    "Available Today": boolean;
    "Home Service": boolean;
  };
};

function Toggle({ setAvailability, item, availability }: PropsType) {
  const isActive = availability[item];

  const handleToggle = () => {
    setAvailability((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <div
      onClick={handleToggle}
      className={`${
        isActive ? "bg-[var(--clay)]" : "bg-[var(--khaki)]"
      } flex items-center rounded-2xl w-10 shrink-0 h-fit p-0.5 cursor-pointer`}
    >
      <span
        className={`${
          isActive ? "translate-x-5" : "translate-x-0"
        } h-4 w-4 bg-white rounded-full transition-all duration-200`}
      />
    </div>
  );
}

export default Toggle;