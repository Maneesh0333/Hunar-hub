import { useMemo, useState } from "react";

// ---- Mock Complaints Data ----
const complaintsData = [
  {
    id: "CMP-301",
    orderId: "ORD-9002",
    customer: "User #893",
    against: "Ramesh Prajapati",
    type: "Late Delivery",
    priority: "High",
    status: "Open",
    date: "2026-02-22",
  },
  {
    id: "CMP-302",
    orderId: "ORD-9001",
    customer: "User #1023",
    against: "Rashida Begum",
    type: "Damaged Item",
    priority: "Medium",
    status: "In Review",
    date: "2026-02-21",
  },
  {
    id: "CMP-303",
    orderId: "ORD-8997",
    customer: "User #611",
    against: "Mohammed Iqbal",
    type: "Wrong Item",
    priority: "Low",
    status: "Resolved",
    date: "2026-02-19",
  },
  {
    id: "CMP-304",
    orderId: "ORD-8988",
    customer: "User #477",
    against: "Suresh Kumar",
    type: "Rude Behavior",
    priority: "High",
    status: "Escalated",
    date: "2026-02-18",
  },
];

const statusStyles = {
  Open: "bg-red-100 text-red-700",
  "In Review": "bg-yellow-100 text-yellow-700",
  Escalated: "bg-orange-100 text-orange-700",
  Resolved: "bg-green-100 text-green-700",
};

const priorityStyles = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-yellow-50 text-yellow-600",
  Low: "bg-gray-100 text-gray-600",
};

export default function Complaints() {
  const [filter, setFilter] = useState("Open");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 6;

  const filteredComplaints = useMemo(() => {
    return complaintsData
      .filter((c) => (filter === "All" ? true : c.status === filter))
      .filter(
        (c) =>
          c.id.toLowerCase().includes(search.toLowerCase()) ||
          c.orderId.toLowerCase().includes(search.toLowerCase()) ||
          c.customer.toLowerCase().includes(search.toLowerCase()) ||
          c.against.toLowerCase().includes(search.toLowerCase())
      );
  }, [filter, search]);

  const totalPages = Math.ceil(filteredComplaints.length / pageSize);
  const paginated = filteredComplaints.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="flex-1 min-h-screen p-8 space-y-6 bg-[#F3EEE7] text-[#2C1A0E]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-semibold">Complaints</h1>
        <p className="text-sm text-[#6B4A2D] mt-1">
          Customer complaints and dispute resolution
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          {["Open", "In Review", "Escalated", "Resolved", "All"].map(
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
          placeholder="Search complaint, order, user..."
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
          <span>ID</span>
          <span>Order</span>
          <span>Customer</span>
          <span>Against</span>
          <span>Type</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {paginated.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-8 items-center px-6 py-4 border-t border-[rgba(196,99,42,0.12)] text-sm"
          >
            <span className="font-medium">{c.id}</span>
            <span className="text-xs text-[#7A4B2A]">{c.orderId}</span>
            <span>{c.customer}</span>
            <span>{c.against}</span>
            <span>{c.type}</span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                priorityStyles[c.priority]
              }`}
            >
              {c.priority}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                statusStyles[c.status]
              }`}
            >
              {c.status}
            </span>

            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-orange-100 text-orange-700 text-xs">
                View
              </button>
              {c.status !== "Resolved" && (
                <button className="px-3 py-1 rounded-lg bg-red-100 text-red-600 text-xs">
                  Resolve
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
