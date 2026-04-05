import { ActionButton } from "../Shared/ActionButton";
import { useUpdateComplaintStatus, type Complaint } from "../../hooks/Shared/useComplaints";

type Props = {
  item: Complaint;
  updateStatusMutation: ReturnType<typeof useUpdateComplaintStatus>;
};

export default function ComplaintRow({ item, updateStatusMutation }: Props) {
  const isUpdating =
    updateStatusMutation.isPending &&
    updateStatusMutation.variables?.id === item._id;

  const handleStatusChange = (status: Complaint["status"]) => {
    updateStatusMutation.mutate({
      id: item._id,
      status,
    });
  };

  return (
    <tr className="border-t border-[var(--border-1)]">
      <td className="px-4 py-4 font-medium">{item.complaintId}</td>

      <td className="px-4 py-4 font-medium whitespace-nowrap">
        {item.bookingId}
      </td>

      <td className="px-4 py-4">
        <div>
          <p className="font-medium">{item.customerName}</p>
          <p className="text-xs text-gray-500">{item.customerPhone}</p>
        </div>
      </td>

      {/* Entrepreneur */}
      <td className="px-4 py-4">{item.entrepreneurName}</td>

      {/* Type */}
      <td className="px-4 py-4 capitalize">{item.type}</td>

      {/* Status */}
      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            item.status === "Resolved"
              ? "bg-green-100 text-green-700"
              : item.status === "In Review"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          ● {item.status}
        </span>
      </td>

      {/* Date */}
      <td className="px-4 py-4 text-sm text-gray-600">
        {new Date(item.createdAt).toLocaleDateString("en-IN", {
          dateStyle: "medium",
        })}
      </td>

      {/* Actions */}
      <td className="px-4 py-4 space-x-2 whitespace-nowrap">
        {item.status === "In Review" && (
          <ActionButton
            variant="success"
            isLoading={isUpdating}
            disabled={isUpdating}
            onClick={() => handleStatusChange("Resolved")}
          >
            Resolve
          </ActionButton>
        )}

        {item.status === "Open" && (
          <ActionButton
            variant="warning"
            isLoading={isUpdating}
            disabled={isUpdating}
            onClick={() => handleStatusChange("In Review")}
          >
            Review
          </ActionButton>
        )}
      </td>
    </tr>
  );
}
