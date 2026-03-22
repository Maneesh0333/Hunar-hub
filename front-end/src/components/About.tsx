import React from "react";
import type { EntrepreneurProfile } from "../hooks/Entrepreneur/useProfile";

type AboutPropsType = {
  data: EntrepreneurProfile | undefined;
};

function About({ data }: AboutPropsType) {
  return (
    <section className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6">
      <h2 className="font-serif text-xl font-bold mb-4">👤 About</h2>
      <p className="text-sm text-[#5C3A1E]">
        {data?.about.length === 0 ? "About not added" : data?.about}
      </p>

      {data && data?.skills?.length > 0 && (
        <div className="mt-6 flex gap-3">
          {data?.skills.map((skill) => (
            <span key={skill} className="inline-block text-[12px] px-3 py-1 font-semibold rounded-full border border-[rgba(196,99,42,0.12)] bg-[var(--cream)] text-[var(--clay)]">
              {skill}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

export default About;
