import React, { useState } from "react";

function Toggle() {
  const [toggle, setToggle] = useState(false);

  return (
    <div
      onClick={() => setToggle((prev) => !prev)}
      className={`${toggle ? "bg-[var(--clay)]" : "bg-[var(--khaki)]"} flex items-center rounded-2xl w-10 h-fit p-0.5`}
    >
      <span
        className={`${toggle ? "translate-x-5" : "translate-x-0"} h-4 w-4 bg-white rounded-full transition-all duration-200`}
      />
    </div>
  );
}

export default Toggle;
