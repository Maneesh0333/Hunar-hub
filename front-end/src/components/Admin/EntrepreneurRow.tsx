import type { UseMutationResult } from "@tanstack/react-query";
import type { Entrepreneur } from "../../hooks/Admin/useEntrepreneurs";
import { ActionButton } from "../Shared/ActionButton";
import { memo } from "react";

type Props = {
  item: Entrepreneur;
  blockMutation: UseMutationResult<any, Error, string>;
  unblockMutation: UseMutationResult<any, Error, string>;
};

export default memo(function EntrepreneurRow({
  item,
  blockMutation,
  unblockMutation,
}: Props) {
  const isBlocking =
    blockMutation.isPending && blockMutation.variables === item?.user?._id;

  const isUnblocking =
    unblockMutation.isPending && unblockMutation.variables === item?.user?._id;

  const handleBlock = () => blockMutation.mutate(item.user._id);
  const handleUnblock = () => unblockMutation.mutate(item.user._id);

  return (
    <tr className="border-t border-[var(--border-1)]">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-lg">
            👩
          </div>

          <div>
            <p className="font-medium">{item?.user?.name}</p>

            <p className="text-xs text-gray-500">
              {item?.bio?.length === 0 ? "Bio not added" : item?.bio}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        {item?.category?.length === 0 ? "Category not added" : item?.category}
      </td>
      <td className="px-4 py-4">
        {item?.city?.length === 0 ? "City not added" : item?.city}
      </td>
      <td className="px-4 py-4">{item?.completedOrders}</td>
      <td className="px-4 py-4">
        <span className="text-[var(--gold)]">★</span> {item?.rating.average}
      </td>

      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            item?.user?.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          ● {item?.user?.status}
        </span>
      </td>

      <td className="px-4 py-4 space-x-2 whitespace-nowrap">
        {item?.user?.status === "Active" ? (
          <ActionButton
            variant="danger"
            isLoading={isBlocking}
            onClick={handleBlock}
          >
            Block
          </ActionButton>
        ) : (
          <ActionButton
            variant="success"
            isLoading={isUnblocking}
            onClick={handleUnblock}
          >
            Unblock
          </ActionButton>
        )}
      </td>
    </tr>
  );
});
