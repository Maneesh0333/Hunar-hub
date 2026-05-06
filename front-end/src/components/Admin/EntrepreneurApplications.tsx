import { useState } from "react";
import FilterChips from "../Shared/FilterChips";
import Header from "../Shared/Header";
import {
  useApproveEntrepreneur,
  useEntrepreneurs,
  useRejectEntrepreneur,
} from "../../hooks/Admin/useEntrepreneurs";

import { getChips } from "../../utils/EntrepreneurFilters";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import EntrepreneurApplicationRow from "./EntrepreneurApplicationRow";
import Spinner from "../Shared/Spinner";
import ErrorState from "../../pages/ErrorState";
import NoInternet from "../../pages/NoInternet";
import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import Pagination from "../Shared/Pagination";

export default function EntrepreneurApplications() {
  const [activeFilter, setActiveFilter] = useState("Pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const isOnline = useNetworkStatus();

  const { data, isLoading, isError, isFetching, refetch } = useEntrepreneurs(
    activeFilter,
    search,
    page,
    "applications",
  );

  const approveMutation = useApproveEntrepreneur();
  const rejectMutation = useRejectEntrepreneur();

  const entrepreneurs = data?.entrepreneurs ?? [];
  const chips = getChips(data?.stats, data?.totalEntrepreneurs);

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load entrepreneur applications"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }
  return (
    <div className="flex-1 flex flex-col space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      <Header
        title="Entrepreneur Applications"
        description={`${data?.totalEntrepreneurs || 0} total applications`}
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
              placeholder="Search entrepreneur..."
              className="w-70 max-lg:w-full"
            />
          </div>

          <Table
            headers={["Name", "Email", "Phone", "Status", "Actions"]}
            data={entrepreneurs}
            colSpan={5}
            isFetching={isFetching}
            renderRow={(item) => (
              <EntrepreneurApplicationRow
                key={item._id}
                item={item}
                approveMutation={approveMutation}
                rejectMutation={rejectMutation}
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
