import { useMemo, useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";

import { useAdminBookings } from "../../hooks/Admin/useBooking";
import AdminBookingRow from "./AdminBookingRow";
import Spinner from "../Shared/Spinner";
import ErrorState from "../../pages/ErrorState";
import NoInternet from "../../pages/NoInternet";
import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import Pagination from "../Shared/Pagination";
import { getChips } from "../../utils/EntrepreneurFilters";

export default function AdminBookingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const isOnline = useNetworkStatus();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useAdminBookings(
    search,
    statusFilter,
    page,
  );

  const bookings = data?.bookings ?? [];

  const chips = useMemo(
    () => [...getChips(data?.stats, data?.total)],
    [data?.stats, data?.total],
  );

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load bookings"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }
  return (
    <div className="flex-1 flex flex-col space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      <Header
        title="All Bookings"
        description={`${data?.total || 0} total bookings`}
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
              "Entrepreneur",
              "Service",
              "Price",
              "Payment",
              "Date",
              "Status",
            ]}
            data={bookings}
            colSpan={7}
            isFetching={isFetching}
            renderRow={(item) => <AdminBookingRow key={item._id} item={item} />}
          />
          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
