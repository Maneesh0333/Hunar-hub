import { useMemo, useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";

import BookingRow from "./BookingRow";
import { useBookings } from "../../hooks/Entrepreneur/useBookings";
import { getChips } from "../../utils/EntrepreneurFilters";
import Spinner from "../Shared/Spinner";

export default function BookingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");

  const { data, isLoading, isError } = useBookings(search, statusFilter);

  const bookings = data?.bookings ?? [];

  const chips = useMemo(
    () => [...getChips(data?.stats, data?.totalBookings)],
    [data?.stats, data?.totalBookings],
  );

  if (isLoading) return <Spinner />;
  if (isError) return <p>Error loading bookings</p>;
  return (
    <div className="flex-1 p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E] overflow-y-auto">
      <Header
        title="Booking & Requests"
        description={`${data?.totalBookings} total bookings`}
      />

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
        renderRow={(item) => <BookingRow key={item._id} item={item} />}
      />
    </div>
  );
}
