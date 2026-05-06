import type { Review, useDeleteReview } from "../../hooks/Admin/useReviews";
import { ActionButton } from "../Shared/ActionButton";

type Props = {
  item: Review;
  deleteMutation: ReturnType<typeof useDeleteReview>;
};

export default function ReviewRow({ item, deleteMutation }: Props) {
  const isDeleting =
    deleteMutation.isPending && deleteMutation.variables === item._id;

  return (
    <tr className="border-t border-[var(--border-1)]">
      <td className="px-4 py-4">{item.customer?.name}</td>

      <td className="px-4 py-4">
        {item.entrepreneur?.user?.name}
      </td>

      <td className="px-4 py-4">{item.service?.title}</td>

      <td className="px-4 py-4">
        <span className="font-medium">⭐ {item.rating}</span>
      </td>

      <td className="px-4 py-4 max-w-xs truncate">
        {item.comment || "-"}
      </td>

      <td className="px-4 py-4">
        {new Date(item.createdAt).toLocaleDateString("en-IN", {
          dateStyle: "medium",
        })}
      </td>

      <td className="px-4 py-4">
        <ActionButton
          variant="danger"
          isLoading={isDeleting}
          onClick={() => deleteMutation.mutate(item._id)}
        >
          Delete
        </ActionButton>
      </td>
    </tr>
  );
}