import { useMemo, useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import Spinner from "../Shared/Spinner";

import { getChips } from "../../utils/EntrepreneurFilters";
import {
  useComplaints,
  useUpdateComplaintStatus,
} from "../../hooks/Shared/useComplaints";
import ComplaintRow from "./ComplaintRow";
import NoInternet from "../../pages/NoInternet";
import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import ErrorState from "../../pages/ErrorState";
import Pagination from "../Shared/Pagination";

export default function Complaints() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const updateStatusMutation = useUpdateComplaintStatus();
  const isOnline = useNetworkStatus();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useComplaints(
    search,
    activeFilter,
    page,
  );

  const complaints = data?.complaints ?? [];
  const chips = useMemo(
    () => [...getChips(data?.stats, data?.totalComplaints)].reverse(),
    [data?.stats, data?.totalComplaints],
  );

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load complaints"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      <Header
        title="Complaint Management"
        description={`${data?.totalComplaints ?? 0} total complaints`}
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
              active={activeFilter}
              onChange={(value) => {
                setActiveFilter(value);
                setPage(1);
              }}
            />

            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search complaints..."
              className="w-70 max-lg:w-full"
            />
          </div>

          <Table
            headers={[
              "Complaint",
              "Booking",
              "Customer",
              "Against",
              "Type",
              "Status",
              "Date",
              "Actions",
            ]}
            data={complaints}
            colSpan={8}
            isFetching={isFetching}
            renderRow={(item) => (
              <ComplaintRow
                key={item._id}
                updateStatusMutation={updateStatusMutation}
                item={item}
              />
            )}
          />
          <Pagination
            page={data?.page ?? 1}
            totalPages={data?.totalPages ?? 1}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
