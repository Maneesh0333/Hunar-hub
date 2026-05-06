import { useMemo, useState } from "react";
import { useCancelBooking, useUserBookings } from "../hooks/User/useBooking";
import Header from "../components/Shared/Header";
import FilterChips from "../components/Shared/FilterChips";
import { getChips } from "../utils/EntrepreneurFilters";
import SideSheet from "../components/Shared/SideSheet";
import ReviewForm from "../components/forms/ReviewForm";
import ComplaintForm from "../components/forms/ComplaintForm";
import Spinner from "../components/Shared/Spinner";
import { Link } from "react-router-dom";
import ErrorState from "./ErrorState";
import NoInternet from "./NoInternet";
import { useNetworkStatus } from "../hooks/Shared/useNetworkStatus";

export default function MyOrders() {
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [complaintBooking, setComplaintBooking] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useUserBookings(
    "",
    statusFilter,
  );
  const cancelMutation = useCancelBooking();
  const isOnline = useNetworkStatus();

  const bookings = data?.bookings ?? [];

  const chips = useMemo(
    () => [...getChips(data?.stats, data?.totalBookings)].reverse(),
    [data?.stats, data?.totalBookings],
  );

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load my orders"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 text-[#2C1A0E] space-y-6">
      <Link
        to="/home"
        className="text-sm bg-transparent text-[var(--clay-light)] hover:text-[var(--clay)] cursor-pointer"
      >
        ← Back to Home
      </Link>

      <Header
        title="My Orders"
        description={`${data?.totalBookings || 0} total orders`}
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <FilterChips
            chips={chips}
            active={statusFilter}
            onChange={setStatusFilter}
          />

          {/* Orders List */}
          <div className="space-y-4 flex flex-col flex-1">
            {bookings && bookings.length === 0 && (
              <p className="flex-1 flex items-center justify-center text-sm text-[#6B4A2D]">
                No bookings found
              </p>
            )}

            {bookings.map((item) => {
              const isCancelling =
                cancelMutation.isPending &&
                cancelMutation.variables?.id === item._id;

              return (
                <div
                  key={item._id}
                  className="group relative bg-[var(--cream)] rounded-2xl border border-[rgba(196,99,42,0.15)] p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Top Section */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[rgba(196,99,42,0.1)] flex items-center justify-center text-2xl border border-[rgba(196,99,42,0.2)]">
                        🧵
                      </div>

                      <div>
                        <h3 className="font-bold text-[#2C1A0E] text-lg leading-tight group-hover:text-[var(--clay)] transition-colors">
                          {item.service.title}
                        </h3>

                        <p className="text-sm text-[#6B4A2D] font-medium">
                          by {item.entrepreneur?.user?.name || "Entrepreneur"}
                        </p>
                      </div>
                    </div>

                    {/* STATUS */}
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full
                    ${
                      item.status === "Pending"
                        ? "bg-[rgba(245,158,11,0.15)] text-amber-700"
                        : item.status === "Confirmed"
                          ? "bg-[rgba(59,130,246,0.15)] text-blue-700"
                          : item.status === "Completed"
                            ? "bg-[rgba(34,197,94,0.15)] text-green-700"
                            : "bg-[rgba(239,68,68,0.15)] text-red-600"
                    }`}
                      >
                        {item.status}
                      </span>

                      <p className="text-[10px] text-[#8B5E3C] font-mono">
                        #{item.bookingId}
                      </p>
                    </div>
                  </div>

                  {/* Middle (Progress & Pricing) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-y border-[rgba(196,99,42,0.08)] items-center">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-[#8B5E3C] uppercase">
                        <span>Placed</span>
                        <span>Processing</span>
                        <span>Done</span>
                      </div>

                      <div className="h-2 rounded-full bg-[rgba(196,99,42,0.15)] overflow-hidden">
                        <div
                          className="h-full bg-[var(--clay)] transition-all duration-700"
                          style={{
                            width:
                              item.status === "Pending"
                                ? "20%"
                                : item.status === "Confirmed"
                                  ? "60%"
                                  : item.status === "Completed"
                                    ? "100%"
                                    : "0%",
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-[#8B5E3C]">Total</p>
                        <p className="text-xl font-black text-[#2C1A0E]">
                          ₹{item.totalAmount}
                        </p>
                      </div>
                      <div className="h-10 w-[1px] bg-[rgba(196,99,42,0.1)]" />
                      <div className="text-right">
                        <p className="text-[10px] text-[#8B5E3C]">Payment</p>
                        <p
                          className={`text-xs font-bold ${item.paymentStatus === "Paid" ? "text-green-700" : "text-amber-600"}`}
                        >
                          {item.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs italic text-[#8B5E3C]">
                      Ordered on{" "}
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>

                    <div className="flex gap-4 items-center">
                      {/* Cancel */}
                      {item.status === "Pending" && (
                        <button
                          disabled={isCancelling}
                          onClick={() =>
                            cancelMutation.mutate({ id: item._id })
                          }
                          className="text-xs font-bold text-red-500 hover:text-red-700 disabled:opacity-40"
                        >
                          {isCancelling ? "Processing..." : "Cancel"}
                        </button>
                      )}

                      {/* Review */}
                      {item.status === "Completed" && !item.isReviewed && (
                        <button
                          onClick={() => setSelectedBooking(item._id)}
                          className="text-xs font-bold text-[var(--clay)] hover:underline"
                        >
                          Write Review
                        </button>
                      )}
                      {item.status === "Completed" && item.isReviewed && (
                        <span className="text-xs font-bold text-green-600">
                          ✔ Reviewed
                        </span>
                      )}

                      {(item.status === "Completed" ||
                        item.status === "Confirmed") &&
                        !item.isComplained && (
                          <button
                            onClick={() => setComplaintBooking(item._id)}
                            className="text-xs font-bold text-red-500 hover:underline"
                          >
                            Report Issue
                          </button>
                        )}

                      {(item.status === "Completed" ||
                        item.status === "Confirmed") &&
                        item.isComplained && (
                          <span className="text-xs font-bold text-green-600">
                            ✔ Reported
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <SideSheet
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Rate Your Experience"
      >
        {selectedBooking && (
          <ReviewForm
            bookingId={selectedBooking}
            closeSheet={() => setSelectedBooking(null)}
          />
        )}
      </SideSheet>

      <SideSheet
        open={!!complaintBooking}
        onClose={() => setComplaintBooking(null)}
        title="Report an Issue"
      >
        {complaintBooking && (
          <ComplaintForm
            booking={complaintBooking}
            closeSheet={() => setComplaintBooking(null)}
          />
        )}
      </SideSheet>
    </div>
  );
}
