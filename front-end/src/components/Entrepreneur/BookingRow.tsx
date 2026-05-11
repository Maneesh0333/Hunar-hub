import { ActionButton } from "../Shared/ActionButton";
import {
  useUpdateBookingStatus,
  useUpdatePaymentStatus,
  type Booking,
} from "../../hooks/Entrepreneur/useBookings";

type Props = {
  item: Booking;
  statusMutation: ReturnType<typeof useUpdateBookingStatus>;
  paymentStatusMutation: ReturnType<typeof useUpdatePaymentStatus>;
};

export default function BookingRow({
  item,
  paymentStatusMutation,
  statusMutation,
}: Props) {
  const isUpdating = statusMutation.isPending;

  const isAccepting =
    isUpdating &&
    statusMutation.variables?.id === item._id &&
    statusMutation.variables?.status === "Confirmed";

  const isDeclining =
    isUpdating &&
    statusMutation.variables?.id === item._id &&
    statusMutation.variables?.status === "Declined";

  const isCompleting =
    isUpdating &&
    statusMutation.variables?.id === item._id &&
    statusMutation.variables?.status === "Completed";

  const isMarkingPaid =
    paymentStatusMutation.isPending &&
    paymentStatusMutation.variables?.id === item._id;

  /* ---------------- Styles ---------------- */

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
  };

  /* ---------------- UI ---------------- */

  return (
    <tr className="border-t border-[rgba(196,99,42,0.12)]">
      {/* 👤 Customer */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg font-semibold bg-orange-100 flex items-center justify-center text-lg">
            {item.customer.name[0]}
          </div>
          <p className="font-medium">{item.customer.name}</p>
        </div>
      </td>

      <td className="px-4 py-4">{item.service.title}</td>

      <td className="px-4 py-4">₹{item.totalAmount}</td>

      <td className="px-4 py-4">
        {item.visitType === "visit_home" ? "Home Visit" : "Workshop"}
      </td>

      <td className="px-4 py-4">
        {item.requirements || "No requirements added"}
      </td>

      <td className="px-4 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            paymentStyles[item.paymentStatus]
          }`}
        >
          ● {item.paymentStatus}
        </span>
      </td>

      {/* 📅 Date */}
      <td className="px-4 py-4">
        {new Date(item.createdAt).toLocaleDateString("en-IN", {
          dateStyle: "medium",
        })}
      </td>

      {/* 🚦 Booking Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusStyles[item.status]
          }`}
        >
          ● {item.status}
        </span>
      </td>

      {/* ⚡ Actions */}
      <td className="px-4 flex-1 whitespace-nowrap space-x-2">
        {item.status === "Pending" && (
          <>
            <ActionButton
              variant="success"
              isLoading={isAccepting}
              onClick={() =>
                statusMutation.mutate({
                  id: item._id,
                  status: "Confirmed",
                })
              }
            >
              Accept
            </ActionButton>

            <ActionButton
              variant="danger"
              isLoading={isDeclining}
              onClick={() =>
                statusMutation.mutate({
                  id: item._id,
                  status: "Declined",
                })
              }
            >
              Decline
            </ActionButton>
          </>
        )}

        {item.status === "Confirmed" && (
          <>
            <ActionButton
              variant="primary"
              isLoading={isCompleting}
              onClick={() =>
                statusMutation.mutate({
                  id: item._id,
                  status: "Completed",
                })
              }
            >
              Complete
            </ActionButton>
          </>
        )}

        {["Confirmed", "Completed"].includes(item.status) &&
          item.paymentStatus === "Pending" && (
            <ActionButton
              variant="secondary"
              isLoading={isMarkingPaid}
              onClick={() =>
                paymentStatusMutation.mutate({
                  id: item._id,
                  paymentStatus: "Paid",
                })
              }
            >
              Mark as Paid
            </ActionButton>
          )}
      </td>
    </tr>
  );
}
