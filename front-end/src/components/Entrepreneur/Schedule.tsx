import { useState } from "react";
import Header from "../Shared/Header";
import SideSheet from "../Shared/SideSheet";
import Button from "../Shared/Button";
import Spinner from "../Shared/Spinner";
import {
  useSchedules,
  type Schedule,
} from "../../hooks/Entrepreneur/useSchedule";
import ScheduleForm from "../forms/ScheduleForm";

export default function Schedule() {
  const [open, setOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );

  const { data: schedule = [], isLoading, isError } = useSchedules();

  // Open form to edit a schedule
  const handleEdit = (item: Schedule) => {
    setSelectedSchedule(item);
    setOpen(true);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) return <p>Error loading Schedule</p>;

  return (
    <div className="flex flex-col flex-1 p-6 bg-[var(--cream)] rounded-xl space-y-6 text-[var(--earth)]">
      {/* Header */}
      <Header
        title="My Schedule"
        description="Weekly working hours and slot configuration"
        children={
          <Button
            label="+ Add Schedule"
            onClick={() => {
              setSelectedSchedule(null);
              setOpen(true);
            }}
          />
        }
      />

      {schedule.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm">
          You haven't added your working hours yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {schedule.map((item) => (
            <div
              key={item.day}
              className="bg-[var(--white)] border border-[var(--border-1)] rounded-xl p-5 flex flex-col gap-4 cursor-pointer"
              onClick={() => handleEdit(item)}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{item.day}</h2>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    item.working
                      ? "bg-green-100 text-green-500"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {item.working ? "Working" : "Off"}
                </span>
              </div>

              {item.working && (
                <div className="flex gap-10 text-sm">
                  <div>
                    <p className="text-xs text-[var(--earth-light)]">Hours</p>
                    <p className="font-semibold">
                      {item.start} – {item.end}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SideSheet Form */}
      <SideSheet
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedSchedule(null);
        }}
        title={selectedSchedule ? "Edit Schedule" : "Add Schedule"}
        discription={
          selectedSchedule
            ? "Update working hours and slots"
            : "Fill details to add new schedule"
        }
      >
        <ScheduleForm
          schedule={selectedSchedule}
          closeSheet={() => setOpen(false)}
        />
      </SideSheet>
    </div>
  );
}
