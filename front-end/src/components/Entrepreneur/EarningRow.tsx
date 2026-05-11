import type { Booking } from "../../hooks/Entrepreneur/useEarning";

type Props = {
  item: Booking;
};

export default function EarningRow({ item }: Props) {
  const paymentStyles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Paid: "bg-green-100 text-green-700",
  };

  return (
    <tr className="border-t border-[rgba(196,99,42,0.12)]">
      {/* 👤 Customer */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 font-semibold rounded-lg bg-orange-100 flex items-center justify-center text-lg">
            {item?.customer?.name[0]}
          </div>
          <p className="font-medium">{item.customer.name}</p>
        </div>
      </td>
      <td className="px-4 py-4">{item?.customer?.email}</td>
      <td className="px-4 py-4">{item?.customer?.phone}</td>
      <td className="px-4 py-4">{item?.service?.title}</td>
      <td className="px-4 py-4">₹{item?.totalAmount}</td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            paymentStyles[item?.paymentStatus]
          }`}
        >
          ● {item?.paymentStatus}
        </span>
      </td>

      {/* 📅 Date */}
      <td className="px-4 py-4">
        {new Date(item.createdAt).toLocaleDateString("en-IN", {
          dateStyle: "medium",
        })}
      </td>
    </tr>
  );
}
