import type { AdminBooking } from "../../hooks/Admin/useBooking";

type Props = {
  item: AdminBooking;
};

export default function AdminBookingRow({ item }: Props) {
  const statusStyles: Record<string, string> = {
    Pending: "bg-orange-100 text-orange-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    Declined: "bg-red-100 text-red-700",
  };

  const paymentStyles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Paid: "bg-green-100 text-green-700",
    Failed: "bg-red-100 text-red-700",
  };

  return (
    <tr className="border-t border-[rgba(196,99,42,0.12)]">
      {/* 👤 Customer */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            👤
          </div>
          <div>
            <p className="font-medium">{item.customer.name}</p>
            <p className="text-xs text-gray-500">
              {item.customer.phone}
            </p>
          </div>
        </div>
      </td>

      {/* 👨‍💼 Entrepreneur */}
      <td className="px-4 py-4">
        {item.entrepreneur?.user?.name}
      </td>

      {/* 🛠 Service */}
      <td className="px-4 py-4">{item.service.title}</td>

      {/* 💰 Price */}
      <td className="px-4 py-4">₹{item.totalAmount}</td>

      {/* 💳 Payment */}
      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            paymentStyles[item.paymentStatus]
          }`}
        >
          {item.paymentStatus}
        </span>
      </td>

      {/* 📅 Date */}
      <td className="px-4 py-4">
        {new Date(item.createdAt).toLocaleDateString("en-IN")}
      </td>

      {/* 🚦 Status */}
      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            statusStyles[item.status]
          }`}
        >
          {item.status}
        </span>
      </td>
    </tr>
  );
}