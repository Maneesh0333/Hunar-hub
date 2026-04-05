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

export default function EntrepreneurApplications() {
  const [activeFilter, setActiveFilter] = useState("Pending");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, isFetching } = useEntrepreneurs(
    activeFilter,
    search,
    "applications",
  );

  const approveMutation = useApproveEntrepreneur();
  const rejectMutation = useRejectEntrepreneur();

  if (isError) return <p className="flex-1 flex items-center justify-center">Error loading entrepreneurs</p>;

  const entrepreneurs = data?.entrepreneurs ?? [];

  const chips = getChips(data?.stats, data?.totalEntrepreneurs);

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E] overflow-y-auto">
      <Header
        title="Entrepreneur Applications"
        description={`${data?.totalEntrepreneurs} total applications`}
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
        </>
      )}
    </div>
  );
}
