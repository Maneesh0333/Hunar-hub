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

export default function Users() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, isFetching } = useUsers(
    activeFilter,
    search,
  );

  const blockMutation = useBlockUsers();
  const unblockMutation = useUnblockUsers();

  if (isError) return <p className="flex-1 flex items-center justify-center">Error loading Users</p>;

  const users = data?.users ?? [];

  const chips = getChips(data?.stats, data?.totalUsers);

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E] overflow-y-auto">
      <Header
        title="User Management"
        description={`${data?.totalUsers} registered customers`}
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
        </>
      )}
    </div>
  );
}
