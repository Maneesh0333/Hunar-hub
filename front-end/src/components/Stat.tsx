type StatProps = {
  value: string | number;
  label: string | number;
};

function Stat({ value, label }: StatProps) {
  return (
    <div className="text-center">
      <div className="font-serif text-xl font-black text-[#C4632A]">
        {value}
      </div>
      <div className="text-xs text-[#5C3A1E]">{label}</div>
    </div>
  );
}

export default Stat;
