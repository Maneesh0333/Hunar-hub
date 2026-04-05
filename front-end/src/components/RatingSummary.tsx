import { StarRating } from "./StarRating";

type RatingSummaryProps = {
  average: number;
  total: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

function RatingSummary({ average, total, breakdown }: RatingSummaryProps) {
  return (
    <div className="flex gap-6">
      {/* Big rating */}
      <div className="flex flex-col items-center">
        <div className="text-6xl font-bold text-[var(--clay)]">
          {average.toFixed(1)}
        </div>

        <StarRating rating={average} size="lg" />

        <div className="text-[11px] text-center w-full text-[var(--earth-mid)]">
          {total} reviews
        </div>
      </div>

      {/* Rating bars */}
      <div className="space-y-2 w-full">
        {([5, 4, 3, 2, 1] as const).map((item) => {
          const percentage = total
            ? (breakdown[item] / total) * 100
            : 0;

          return (
            <div key={item} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-[var(--earth-mid)]">{item}</span>

              <div
                className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
                aria-label={`${item} star rating`}
              >
                <div
                  className="h-full bg-[var(--gold)] rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-8 text-[var(--earth-mid)]">
                {breakdown[item]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RatingSummary;