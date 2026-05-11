import { useMemo, useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";

import BookingRow from "./BookingRow";
import {
  useBookings,
  useUpdateBookingStatus,
  useUpdatePaymentStatus,
} from "../../hooks/Entrepreneur/useBookings";
import { getChips } from "../../utils/EntrepreneurFilters";
import Spinner from "../Shared/Spinner";
import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import NoInternet from "../../pages/NoInternet";
import ErrorState from "../../pages/ErrorState";
import Pagination from "../Shared/Pagination";

export default function BookingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const isOnline = useNetworkStatus();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useBookings(
    search,
    statusFilter,
    page,
  );

  const bookings = data?.bookings ?? [];

  const statusMutation = useUpdateBookingStatus();
  const paymentStatusMutation = useUpdatePaymentStatus();

  const chips = useMemo(
    () => [...getChips(data?.stats, data?.totalBookings)],
    [data?.stats, data?.totalBookings],
  );

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load booking"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      <Header
        title="Booking & Requests"
        description={`${data?.totalBookings || 0} total bookings`}
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <FilterChips
              chips={chips}
              active={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            />

            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search bookings..."
              className="w-70 max-lg:w-full"
            />
          </div>

          <Table
            headers={[
              "Customer",
              "Service",
              "Price",
              "Visit Type",
              "Requirements",
              "Payment Status",
              "Created",
              "Status",
              "Actions",
            ]}
            data={bookings}
            colSpan={8}
            isFetching={isFetching}
            renderRow={(item) => (
              <BookingRow
                key={item._id}
                item={item}
                statusMutation={statusMutation}
                paymentStatusMutation={paymentStatusMutation}
              />
            )}
          />
        </>
      )}
      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
