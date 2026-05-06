import { type EntrepreneurProfile } from "../../hooks/Entrepreneur/useProfile";
import InputField from "../Shared/InputField";

function BasicInformationCard({ data }: { data: EntrepreneurProfile | undefined }) {
  return (
    <section className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6 flex-1 h-fit">
      <h2 className="font-serif text-lg font-bold">Basic Information</h2>
      <p className="text-xs text-[#6B4A2D] mt-1">
        Shown publicly on your profile
      </p>

      <div className="mt-5 space-y-4">
        <InputField
          label="Full Name"
          readOnly={true}
          value={data?.user?.name}
          inputClassName="!px-3 !py-2 text-sm"
        />
        <InputField
          label="Phone Number"
          readOnly={true}
          value={data?.user?.phone}
          inputClassName="!px-3 !py-2 text-sm"
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Category"
            readOnly={true}
            value={
              data?.category?.name ?? "Category not added"
            }
            inputClassName="!px-3 !py-2 text-sm"
          />

          <InputField
            label="Experience (Years)"
            readOnly={true}
            value={data?.experienceYears}
            inputClassName="!px-3 !py-2 text-sm"
          />
        </div>

        <InputField
          label="Location / Workshop Address"
          readOnly={true}
          value={data?.user?.city.length === 0 ? "City not added" : data?.user?.city}
          inputClassName="!px-3 !py-2 text-sm"
        />

        <InputField
          label="Languages Spoken"
          readOnly={true}
          value={
            data?.languages.length === 0
              ? "Languages not added"
              : data?.languages.toString()
          }
          inputClassName="!px-3 !py-2 text-sm"
        />

        <InputField
          label="Payment"
          readOnly={true}
          value={
            data?.payment.length === 0
              ? "Payment not added"
              : data?.payment.toString()
          }
          inputClassName="!px-3 !py-2 text-sm"
        />
      </div>
    </section>
  );
}

export default BasicInformationCard;
