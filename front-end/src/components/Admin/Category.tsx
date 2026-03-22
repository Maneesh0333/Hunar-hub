import { useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import { getChips } from "../../utils/entrepreneurFilters";
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

export default function Categories() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const { data, isLoading, isError } = useCategories(activeFilter, search);

  const enableMutation = useEnableCategories();
  const disableMutation = useDisableCategories();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading entrepreneurs</p>;

  const users = data?.categories ?? [];

  const chips = getChips(data?.stats, data?.totalCategories);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading entrepreneurs</p>;

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E] overflow-y-auto">
      <Header
        title="Categories"
        description={`${data?.totalCategories} registered Categories`}
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
          "Category Id",
          "Name",
          "Description",
          "Status",
          "Created",
          "Actions",
        ]}
        data={users}
        colSpan={6}
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
