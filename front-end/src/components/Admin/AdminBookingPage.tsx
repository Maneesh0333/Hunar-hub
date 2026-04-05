import { useMemo, useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";

import { getChips } from "../../utils/EntrepreneurFilters";
import { useAdminBookings } from "../../hooks/Admin/useBooking";
import AdminBookingRow from "./AdminBookingRow";
import Spinner from "../Shared/Spinner";

export default function AdminBookingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data, isLoading, isError, isFetching } = useAdminBookings(
    search,
    statusFilter,
  );

  const bookings = data?.bookings ?? [];

  const chips = useMemo(
    () => [...getChips(data?.stats, data?.total)],
    [data?.stats, data?.total],
  );
  
  if (isError) return <p className="flex-1 flex items-center justify-center">Error loading bookings</p>;

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E] overflow-y-auto">
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
              onChange={setStatusFilter}
            />

            <SearchInput
              value={search}
              onChange={setSearch}
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
        </>
      )}
    </div>
  );
}
