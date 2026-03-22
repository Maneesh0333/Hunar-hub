import React from "react";
import { usePublicServices } from "../../hooks/User/usePublicServices ";
import Spinner from "../Shared/Spinner";

type PropsType = {
  selectedService: string;
  id: string | undefined;
  setSelectedService: (item: string) => void;
};

function ServicesOffered({
  id,
  selectedService,
  setSelectedService,
}: PropsType) {
  const { data: services, isLoading, isError, error } = usePublicServices(id);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Spinner />
      </div>
    );
  if (isError) return <div>{error.message}</div>;

  return (
    <section className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6">
      <h2 className="font-serif text-xl font-bold mb-4">🛍️ Services Offered</h2>

      <div className="flex flex-col gap-4">
        {services?.map((s) => (
          <button
            key={s._id}
            onClick={() => setSelectedService(s._id)}
            className={`relative text-left p-4 rounded-xl bg-[var(--cream)] border border-[rgba(196,99,42,0.12)] transition-all duration-200 hover:-translate-y-0.5
                    ${
                      selectedService === s._id
                        ? "border-[var(--clay)] bg-[var(--cream)]"
                        : "hover:border-[var(--clay)] hover:bg-white"
                    }`}
          >
            {selectedService === s._id && (
              <span className="absolute top-3 right-3 w-5 h-5 bg-[#C4632A] text-white rounded-full text-xs flex items-center justify-center">
                ✓
              </span>
            )}

            <div className="text-2xl">👗</div>
            <div className="font-semibold mt-3 text-sm">{s.title}</div>
            <div className="mt-1 text-xs text-[var(--earth-mid)]">
              {s.description}
            </div>
            <div className="mt-3 font-semibold text-[var(--clay)]">
              ₹{s.price}{" "}
              <span className="text-[10px] text-[var(--earth-mid)] font-normal">
                {s.priceUnit.replace("_", " ")}
              </span>
            </div>
            {s.deliveryTime && (
              <div className="text-[10px] text-[var(--earth-mid)] mt-1">
                ⏱ Ready in {s.deliveryTime}
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

export default ServicesOffered;
