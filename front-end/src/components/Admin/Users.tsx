import { useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import {
  useBlockUsers,
  useUnblockUsers,
  useUsers,
} from "../../hooks/Admin/useUsers";
import { getChips } from "../../utils/EntrepreneurFilters";
import UserRow from "./UserRow";
import Spinner from "../Shared/Spinner";
import ErrorState from "../../pages/ErrorState";
import NoInternet from "../../pages/NoInternet";
import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import Pagination from "../Shared/Pagination";

export default function Users() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const isOnline = useNetworkStatus();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useUsers(
    search,
    activeFilter,
    page,
  );

  const blockMutation = useBlockUsers();
  const unblockMutation = useUnblockUsers();

  const users = data?.users ?? [];
  const chips = getChips(data?.stats, data?.totalUsers);

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load users"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }
  return (
    <div className="flex-1 flex flex-col space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      <Header
        title="User Management"
        description={`${data?.totalUsers || 0} registered customers`}
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
              "Name",
              "Email",
              "Phone",
              "Is Verified",
              "Status",
              "Actions",
            ]}
            data={users}
            colSpan={6}
            isFetching={isFetching}
            renderRow={(item) => (
              <UserRow
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
