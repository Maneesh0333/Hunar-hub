import type { UseMutationResult } from "@tanstack/react-query";
import type { User } from "../../hooks/Admin/useUsers";
import { ActionButton } from "../Shared/ActionButton";

type Props = {
  item: User;
  blockMutation: UseMutationResult<any, Error, string>;
  unblockMutation: UseMutationResult<any, Error, string>;
};

export default function UserRow({
  item,
  blockMutation,
  unblockMutation,
}: Props) {
  const isBlocking =
    blockMutation.isPending && blockMutation.variables === item._id;

  const isUnblocking =
    unblockMutation.isPending && unblockMutation.variables === item._id;

  return (
    <tr className="border-t border-[var(--border-1)]">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-lg">
            👩
          </div>

          <div>
            <p className="font-medium">{item.name}</p>

            <p className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString("en-IN", {
                dateStyle: "medium",
              })}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">{item.email}</td>
      <td className="px-4 py-4">{item.phone}</td>

      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            item.isVerified
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          ● {item.isVerified ? "Verified" : "Not Verified"}
        </span>
      </td>

      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            item.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          ● {item.status}
        </span>
      </td>

      <td className="px-4 py-4 space-x-2 whitespace-nowrap">
        {item.status === "Active" ? (
          <ActionButton
            variant="danger"
            isLoading={isBlocking}
            onClick={() => blockMutation.mutate(item._id)}
          >
            Block
          </ActionButton>
        ) : (
          <ActionButton
            variant="success"
            isLoading={isUnblocking}
            onClick={() => unblockMutation.mutate(item._id)}
          >
            Unblock
          </ActionButton>
        )}
      </td>
    </tr>
  );
}
