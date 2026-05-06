import { useMemo, useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import Spinner from "../Shared/Spinner";
import ErrorState from "../../pages/ErrorState";
import NoInternet from "../../pages/NoInternet";
import Pagination from "../Shared/Pagination";

import {
  useReviews,
  useDeleteReview,
} from "../../hooks/Admin/useReviews";

import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import ReviewRow from "./ReviewRow";
import { getChips } from "../../utils/EntrepreneurFilters";

export default function Reviews() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const isOnline = useNetworkStatus();

  const { data, isLoading, isError, isFetching, refetch } =
    useReviews(search, activeFilter, page);

  const deleteMutation = useDeleteReview();

  const reviews = data?.reviews ?? [];

  const chips = useMemo(
      () => [...getChips(data?.stats, data?.totalReviews)].reverse(),
      [data?.stats, data?.totalReviews],
    );

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load reviews"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      <Header
        title="Reviews"
        description={`${data?.totalReviews || 0} total reviews`}
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
              placeholder="Search reviews..."
              className="w-70 max-lg:w-full"
            />
          </div>

          <Table
            headers={[
              "Customer",
              "Entrepreneur",
              "Service",
              "Rating",
              "Comment",
              "Date",
              "Actions",
            ]}
            data={reviews}
            colSpan={7}
            isFetching={isFetching}
            renderRow={(item) => (
              <ReviewRow
                key={item._id}
                item={item}
                deleteMutation={deleteMutation}
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