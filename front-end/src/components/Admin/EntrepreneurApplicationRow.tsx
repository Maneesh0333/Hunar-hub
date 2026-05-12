import type {
  Entrepreneur,
  useApproveEntrepreneur,
  useRejectEntrepreneur,
} from "../../hooks/Admin/useEntrepreneurs";
import { ActionButton } from "../Shared/ActionButton";

type Props = {
  item: Entrepreneur;
  approveMutation: ReturnType<typeof useApproveEntrepreneur>;
  rejectMutation: ReturnType<typeof useRejectEntrepreneur>;
};

export default function EntrepreneurApplicationRow({
  item,
  approveMutation,
  rejectMutation,
}: Props) {
  const isApproving =
    approveMutation.isPending && approveMutation.variables === item._id;

  const isRejecting =
    rejectMutation.isPending && rejectMutation.variables === item._id;

  return (
    <tr className="border-t border-[var(--border-1)]">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 font-semibold rounded-lg bg-orange-100 flex items-center justify-center text-lg">
            {item.user.name[0].toUpperCase()}
          </div>

          <div>
            <p className="font-medium">{item.user.name}</p>

            <p className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString("en-IN", {
                dateStyle: "medium",
              })}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">{item.user.email}</td>
      <td className="px-4 py-4">{item.user.phone}</td>

      <td className="px-4 py-4">
        <span
          className={`${item.verificationStatus === "Pending" ? "bg-yellow-100 text-yellow-700" : item.verificationStatus === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded-full font-medium text-xs whitespace-nowrap`}
        >
          ● {item.verificationStatus}
        </span>
      </td>

      <td className="px-4 py-4 space-x-2 whitespace-nowrap">
        {item.verificationStatus === "Pending" && (
          <>
            <ActionButton
              variant="success"
              isLoading={isApproving}
              onClick={() => approveMutation.mutate(item._id)}
            >
              Approve
            </ActionButton>

            <ActionButton
              variant="danger"
              isLoading={isRejecting}
              onClick={() => rejectMutation.mutate(item._id)}
            >
              Reject
            </ActionButton>
          </>
        )}
      </td>
    </tr>
  );
}
