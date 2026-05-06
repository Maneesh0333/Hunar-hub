import { useMemo, useState } from "react";
import FilterChips from "../Shared/FilterChips";
import Header from "../Shared/Header";
import {
  useBlockEntrepreneur,
  useEntrepreneurs,
  useUnblockEntrepreneur,
} from "../../hooks/Admin/useEntrepreneurs";

import { getChips } from "../../utils/EntrepreneurFilters";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import EntrepreneurRow from "./EntrepreneurRow";
import Spinner from "../Shared/Spinner";
import ErrorState from "../../pages/ErrorState";
import NoInternet from "../../pages/NoInternet";
import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import Pagination from "../Shared/Pagination";

export default function Entrepreneurs() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const isOnline = useNetworkStatus();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useEntrepreneurs(
    activeFilter,
    search,
    page,
    "entrepreneurs",
  );

  const blockMutation = useBlockEntrepreneur();
  const unblockMutation = useUnblockEntrepreneur();

  const entrepreneurs = data?.entrepreneurs ?? [];

  const chips = useMemo(
    () => [...getChips(data?.stats, data?.totalEntrepreneurs)].reverse(),
    [data?.stats, data?.totalEntrepreneurs],
  );

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load Entrepreneurs"
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
            headers={[
              "Artisan",
              "Category",
              "City",
              "Orders",
              "Rating",
              "Status",
              "Actions",
            ]}
            data={entrepreneurs}
            colSpan={7}
            isFetching={isFetching}
            renderRow={(item) => (
              <EntrepreneurRow
                key={item._id}
                item={item}
                blockMutation={blockMutation}
                unblockMutation={unblockMutation}
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
