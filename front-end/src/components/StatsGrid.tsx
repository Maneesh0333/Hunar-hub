import type { statsDataType } from "../types/shared/types";
import StatsCard from "./StatsCard";

type statsDataPropsType = {
  statsData: statsDataType[];
  className?: string;
};

export default function StatsGrid({
  statsData,
  className,
}: statsDataPropsType) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 ${className}`}
    >
      {statsData.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
