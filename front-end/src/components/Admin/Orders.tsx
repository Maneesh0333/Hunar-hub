import { useMemo, useState } from "react";

// ---- Mock Orders Data ----
const ordersData = [
  {
    id: "ORD-9001",
    customer: "User #1023",
    entrepreneur: "Rashida Begum",
    items: 3,
    amount: "₹2,400",
    payment: "Paid",
    status: "Delivered",
    date: "2026-02-21",
  },
  {
    id: "ORD-9002",
    customer: "User #893",
    entrepreneur: "Ramesh Prajapati",
    items: 1,
    amount: "₹780",
    payment: "Paid",
    status: "In Progress",
    date: "2026-02-21",
  },
  {
    id: "ORD-9003",
    customer: "User #771",
    entrepreneur: "Mohammed Iqbal",
    items: 2,
    amount: "₹1,150",
    payment: "Refunded",
    status: "Cancelled",
    date: "2026-02-20",
  },
  {
    id: "ORD-9004",
    customer: "User #654",
    entrepreneur: "Suresh Kumar",
    items: 5,
    amount: "₹3,900",
    payment: "Pending",
    status: "Pending",
    date: "2026-02-19",
  },
];

const statusStyles = {
  Delivered: "bg-green-100 text-green-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

const paymentStyles = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Refunded: "bg-gray-200 text-gray-700",
};

export default function Orders() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 6;

  const filteredOrders = useMemo(() => {
    return ordersData
      .filter((o) => (filter === "All" ? true : o.status === filter))
      .filter(
        (o) =>
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.customer.toLowerCase().includes(search.toLowerCase()) ||
          o.entrepreneur.toLowerCase().includes(search.toLowerCase())
      );
  }, [filter, search]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginated = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="flex-1 min-h-screen p-8 space-y-6 bg-[#F3EEE7] text-[#2C1A0E]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-semibold">Orders</h1>
        <p className="text-sm text-[#6B4A2D] mt-1">
          All marketplace orders and fulfillment status
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          {["All", "Pending", "In Progress", "Delivered", "Cancelled"].map(
            (chip) => (
              <button
                key={chip}
                onClick={() => {
                  setFilter(chip);
                  setPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition
                  ${
                    filter === chip
                      ? "bg-[#C4632A] text-white border-[#C4632A]"
                      : "bg-white text-[#7A4B2A] border-[rgba(196,99,42,0.2)]"
                  }`}
              >
                {chip}
              </button>
            )
          )}
        </div>

        <input
          type="text"
          placeholder="Search order ID, customer, entrepreneur..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 rounded-lg border border-[rgba(196,99,42,0.2)] bg-white text-sm w-72"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden bg-white border border-[rgba(196,99,42,0.15)] shadow-sm">
        <div className="grid grid-cols-8 bg-[#F6EFE8] px-6 py-3 text-xs font-semibold tracking-widest text-[#7A4B2A] uppercase">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Entrepreneur</span>
          <span>Items</span>
          <span>Amount</span>
          <span>Payment</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {paginated.map((o) => (
          <div
            key={o.id}
            className="grid grid-cols-8 items-center px-6 py-4 border-t border-[rgba(196,99,42,0.12)] text-sm"
          >
            <span className="font-medium">{o.id}</span>
            <span>{o.customer}</span>
            <span>{o.entrepreneur}</span>
            <span>{o.items}</span>
            <span className="font-medium text-[#C4632A]">{o.amount}</span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                paymentStyles[o.payment]
              }`}
            >
              {o.payment}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                statusStyles[o.status]
              }`}
            >
              {o.status}
            </span>

            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-orange-100 text-orange-700 text-xs">
                View
              </button>
              {o.status === "Pending" && (
                <button className="px-3 py-1 rounded-lg bg-red-100 text-red-600 text-xs">
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm">
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
