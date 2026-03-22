import { useMemo, useState } from "react";

// ---- Mock API Data ----
const initialReviews = [
  {
    id: 1,
    rating: 1,
    review: "Very poor stitching quality. Order delayed and no response.",
    customer: "User #1023",
    entrepreneur: "Rashida Begum",
    orderId: "ORD-8451",
    date: "2026-02-21",
    status: "Flagged",
  },
  {
    id: 2,
    rating: 2,
    review: "Product was okay but delivery was late.",
    customer: "User #893",
    entrepreneur: "Ramesh Prajapati",
    orderId: "ORD-8320",
    date: "2026-02-20",
    status: "Pending",
  },
  {
    id: 3,
    rating: 5,
    review: "Excellent craftsmanship. Highly recommended!",
    customer: "User #771",
    entrepreneur: "Mohammed Iqbal",
    orderId: "ORD-8299",
    date: "2026-02-19",
    status: "Approved",
  },
];

const statusStyles = {
  Flagged: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-gray-200 text-gray-700",
};

export default function Reviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState("Flagged");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);

  const pageSize = 5;

  // ---- Filtering + Search ----
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => (filter === "All" ? true : r.status === filter))
      .filter(
        (r) =>
          r.review.toLowerCase().includes(search.toLowerCase()) ||
          r.customer.toLowerCase().includes(search.toLowerCase()) ||
          r.entrepreneur.toLowerCase().includes(search.toLowerCase())
      );
  }, [reviews, filter, search]);

  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const paginated = filteredReviews.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // ---- Moderation Actions ----
  const updateStatus = (id, newStatus) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="flex-1 min-h-screen p-8 space-y-6 bg-[#F3EEE7] text-[#2C1A0E]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-semibold">Reviews</h1>
          <p className="text-sm text-[#6B4A2D] mt-1">
            Production-grade moderation panel
          </p>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          {["Flagged", "Pending", "Approved", "Rejected", "All"].map(
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
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 rounded-lg border border-[rgba(196,99,42,0.2)] bg-white text-sm w-64"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden bg-white border border-[rgba(196,99,42,0.15)] shadow-sm">
        <div className="grid grid-cols-8 bg-[#F6EFE8] px-6 py-3 text-xs font-semibold tracking-widest text-[#7A4B2A] uppercase">
          <span>Rating</span>
          <span className="col-span-2">Review</span>
          <span>Customer</span>
          <span>Entrepreneur</span>
          <span>Date</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {paginated.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-8 items-center px-6 py-4 border-t border-[rgba(196,99,42,0.12)] text-sm"
          >
            <span className="text-amber-600 font-medium">
              {"★".repeat(r.rating)}
            </span>

            <div className="col-span-2 cursor-pointer" onClick={() => setSelectedReview(r)}>
              <p className="font-medium line-clamp-2">{r.review}</p>
              <p className="text-xs text-gray-500 mt-1">Order {r.orderId}</p>
            </div>

            <span>{r.customer}</span>
            <span>{r.entrepreneur}</span>
            <span className="text-xs text-gray-500">{r.date}</span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                statusStyles[r.status]
              }`}
            >
              {r.status}
            </span>

            <div className="flex gap-2">
              {r.status === "Pending" && (
                <>
                  <button
                    onClick={() => updateStatus(r.id, "Approved")}
                    className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "Rejected")}
                    className="px-3 py-1 rounded-lg bg-red-100 text-red-600 text-xs"
                  >
                    Reject
                  </button>
                </>
              )}

              {r.status === "Flagged" && (
                <button
                  onClick={() => updateStatus(r.id, "Approved")}
                  className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs"
                >
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

      {/* Review Detail Drawer */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/30 flex justify-end">
          <div className="w-[400px] bg-white h-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Review Detail</h2>
              <button onClick={() => setSelectedReview(null)}>✕</button>
            </div>
            <p className="text-sm">{selectedReview.review}</p>
            <div className="text-xs text-gray-500">
              <p>Customer: {selectedReview.customer}</p>
              <p>Entrepreneur: {selectedReview.entrepreneur}</p>
              <p>Order: {selectedReview.orderId}</p>
              <p>Date: {selectedReview.date}</p>
              <p>Status: {selectedReview.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
