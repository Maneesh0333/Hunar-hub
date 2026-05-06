import { useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import { getChips } from "../../utils/EntrepreneurFilters";
import {
  useCategories,
  useDisableCategories,
  useEnableCategories,
  type Category,
} from "../../hooks/Admin/useCategories";
import CategoriesRow from "./CategoriesRow";
import SideSheet from "../Shared/SideSheet";
import Button from "../Shared/Button";
import CategoryForm from "../forms/CategoryForm";
import Spinner from "../Shared/Spinner";
import ErrorState from "../../pages/ErrorState";
import NoInternet from "../../pages/NoInternet";
import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import Pagination from "../Shared/Pagination";

export default function Categories() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useCategories(
    search,
    activeFilter,
    page,
  );

  const enableMutation = useEnableCategories();
  const disableMutation = useDisableCategories();
  const isOnline = useNetworkStatus();

  const categories = data?.categories ?? [];
  const chips = getChips(data?.stats, data?.totalCategories);

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load categories"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      <Header
        title="Categories"
        description={`${data?.totalCategories || 0} registered Categories`}
        children={
          <Button
            label="+ Add Category"
            onClick={() => {
              setSelectedCategory(null);
              setOpen(true);
            }}
          />
        }
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
              "Category Id",
              "Name",
              "Description",
              "Status",
              "Created",
              "Actions",
            ]}
            data={categories}
            colSpan={6}
            isFetching={isFetching}
            renderRow={(item) => (
              <CategoriesRow
                key={item._id}
                item={item}
                disableMutation={disableMutation}
                enableMutation={enableMutation}
                onEdit={(cat) => {
                  setSelectedCategory(cat);
                  setOpen(true);
                }}
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

      <SideSheet
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedCategory(null);
        }}
        title={selectedCategory ? "Edit Category" : "Add Category"}
        discription={
          selectedCategory
            ? "Fill the details to edit"
            : "Fill the details to add"
        }
      >
        <CategoryForm
          category={selectedCategory}
          closeSheet={() => setOpen(false)}
        />
      </SideSheet>
    </div>
  );
}
