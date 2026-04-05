import { useState } from "react";
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
import Button from "../Shared/Button";

export default function Complaints() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const updateStatusMutation = useUpdateComplaintStatus();

  const { data, isLoading, isError, isFetching, refetch } = useComplaints(
    search,
    activeFilter,
  );

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-red-600 font-medium">Failed to load complaints</p>

        <Button label="Try Again" onClick={() => refetch()} isLoading={isFetching} disabled={isFetching} />
      </div>
    );
  }

  const complaints = data?.complaints ?? [];
  const chips = getChips(data?.stats, data?.totalComplaints);

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E] overflow-y-auto">
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
              chips={chips.reverse()}
              active={activeFilter}
              onChange={setActiveFilter}
            />

            <SearchInput
              value={search}
              onChange={setSearch}
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
        </>
      )}
    </div>
  );
}
