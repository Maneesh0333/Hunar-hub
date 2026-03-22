import { useMemo, useState } from "react";
import Header from "../Shared/Header";
import FilterChips from "../Shared/FilterChips";
import SearchInput from "../Shared/SearchInput";
import Table from "../Shared/Table";
import Button from "../Shared/Button";
import SideSheet from "../Shared/SideSheet";

import ServicesRow from "./ServicesRow";
import ServiceForm from "../forms/ServiceForm";
import {
  useServices,
  type Service,
} from "../../hooks/Entrepreneur/useServices";
import { getChips } from "../../utils/entrepreneurFilters";

export default function Services() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data, isLoading, isError } = useServices(search, statusFilter);

  const services = data?.services ?? [];

  const chips = useMemo(
    () => [...getChips(data?.stats, data?.totalServices)].reverse(),
    [data?.stats, data?.totalServices],
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading services</p>;
  return (
    <div className="flex-1 p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E] overflow-y-auto">
      <Header
        title="Services"
        description={`${data?.totalServices} registered services`}
        children={
          <Button
            label="+ Add Service"
            onClick={() => {
              setSelectedService(null);
              setOpen(true);
            }}
          />
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterChips
          chips={chips}
          active={statusFilter}
          onChange={setStatusFilter}
        />

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search services..."
          className="w-70 max-lg:w-full"
        />
      </div>

      <Table
        headers={["Title", "Category", "Price", "Status", "Created", "Actions"]}
        data={services}
        colSpan={6}
        renderRow={(item) => (
          <ServicesRow
            key={item._id}
            item={item}
            onEdit={(service) => {
              setSelectedService(service);
              setOpen(true);
            }}
          />
        )}
      />

      <SideSheet
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedService(null);
        }}
        title={selectedService ? "Edit Service" : "Add Service"}
        discription={
          selectedService
            ? "Update service details"
            : "Fill details to create service"
        }
      >
        <ServiceForm
          service={selectedService}
          closeSheet={() => setOpen(false)}
        />
      </SideSheet>
    </div>
  );
}
