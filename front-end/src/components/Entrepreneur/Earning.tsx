import { useState } from "react";
import Header from "../Shared/Header";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import Spinner from "../Shared/Spinner";
import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import NoInternet from "../../pages/NoInternet";
import ErrorState from "../../pages/ErrorState";
import Pagination from "../Shared/Pagination";
import { useEarning } from "../../hooks/Entrepreneur/useEarning";
import EarningRow from "./EarningRow";
import StatsGrid from "../StatsGrid";

export default function Earning() {
  const [search, setSearch] = useState("");
  const isOnline = useNetworkStatus();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useEarning(
    search,
    page,
  );

  const bookings = data?.bookings ?? [];

  const statsData = [
    {
      icon: "💰",
      label: "Total Earnings",
      value: `${data?.totalEarning || 0}`,
      change: "",
      sub: "",
    },
    {
      icon: "📚",
      label: "Total Bookings",
      value: `${data?.totalBookings || 0}`,
      change: "",
      sub: "",
    },
    {
      icon: "✅",
      label: "Paid",
      value: `${data?.stats?.Paid || 0}`,
      change: "",
      sub: "",
    },
    {
      icon: "⏳",
      label: "Pending Payment",
      value: `${data?.stats?.Pending || 0}`,
      change: "",
      sub: "",
    },
  ];

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
        title="Earnings"
        description="Track your revenue and payment activity"
        children={
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search bookings..."
            className="w-70 max-lg:w-full ml-20"
          />
        }
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <StatsGrid statsData={statsData} />

          <Table
            headers={[
              "Customer",
              "Email",
              "Phone",
              "Service",
              "Price",
              "Payment Status",
              "Created",
            ]}
            data={bookings}
            colSpan={8}
            isFetching={isFetching}
            renderRow={(item) => <EarningRow key={item._id} item={item} />}
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
