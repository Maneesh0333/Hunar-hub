import { ActionButton } from "../Shared/ActionButton";
import {
  useToggleService,
  type Service,
} from "../../hooks/Entrepreneur/useServices";

type Props = {
  item: Service;
  onEdit: (service: Service) => void;
};

export default function ServicesRow({ item, onEdit }: Props) {
  const toggleMutation = useToggleService();

  const isToggling =
    toggleMutation.isPending && toggleMutation.variables?.id === item._id;

  return (
    <tr className="border-t border-[var(--border-1)]">
      <td className="px-4 py-4">{item.title}</td>
      <td className="px-4 py-4">{item.category}</td>

      <td className="px-4 py-4">
        ₹{item.price} / {item.priceUnit.split("_")[1].toString()}
      </td>

      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            item.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          ● {item.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="px-4 py-4">
        {new Date(item.createdAt).toLocaleDateString("en-IN", {
          dateStyle: "medium",
        })}
      </td>

      <td className="px-4 py-4 space-x-2 whitespace-nowrap">
        <ActionButton variant="warning" onClick={() => onEdit(item)}>
          Edit
        </ActionButton>

        {item.isActive ? (
          <ActionButton
            variant="danger"
            isLoading={isToggling}
            onClick={() =>
              toggleMutation.mutate({
                id: item._id,
                action: "disable",
              })
            }
          >
            Disable
          </ActionButton>
        ) : (
          <ActionButton
            variant="success"
            isLoading={isToggling}
            onClick={() =>
              toggleMutation.mutate({
                id: item._id,
                action: "enable",
              })
            }
          >
            Enable
          </ActionButton>
        )}
      </td>
    </tr>
  );
}
