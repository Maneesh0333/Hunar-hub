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
import { getChips } from "../../utils/EntrepreneurFilters";
import Spinner from "../Shared/Spinner";
import ErrorState from "../../pages/ErrorState";
import NoInternet from "../../pages/NoInternet";
import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import Pagination from "../Shared/Pagination";

export default function Services() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const isOnline = useNetworkStatus();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useServices(
    search,
    statusFilter,
    page,
  );

  const services = data?.services ?? [];

  const chips = useMemo(
    () => [...getChips(data?.stats, data?.totalServices)].reverse(),
    [data?.stats, data?.totalServices],
  );

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load services"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }
  return (
    <div className="flex-1 flex flex-col space-y-6 bg-[#FAF5ED] text-[#2C1A0E] overflow-y-auto">
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

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <FilterChips
              chips={chips}
              active={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            />

            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search services..."
              className="w-70 max-lg:w-full"
            />
          </div>

          <Table
            headers={["Title", "Price", "Status", "Created", "Actions"]}
            data={services}
            colSpan={6}
            isFetching={isFetching}
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
        </>
      )}

      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
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
