import { useProfileCompleteness } from "../../hooks/Entrepreneur/useProfileCompleteness";

function ProfileCompletenessCard() {
  const { data, isLoading, isError, error } = useProfileCompleteness();

  const percentage = data?.percentage ?? 0;
  const items = data?.items ?? [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  // Circle settings
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-[#F5F1EC] rounded-2xl p-6 shadow-sm h-fit">
      <h2 className="font-serif text-lg font-bold mb-4">
        Profile Completeness
      </h2>

      <div className="flex gap-5">
        {/* Progress Circle */}
        <div className="relative w-20 h-20">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              stroke="#E5DED6"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />

            <circle
              stroke="#C4632A"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[#C4632A]">
            {percentage}%
          </div>
        </div>

        {/* Text Section */}
        <div className="flex-1">
          <div className="font-semibold text-sm">{data.message}</div>
          <div className="text-xs text-[#6B4A2D] mt-1">
            Complete remaining steps to reach 100%
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="mt-5 space-y-2 text-sm">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-sm flex items-center justify-center text-xs ${
                  item.completed
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {item.completed ? "✓" : ""}
              </span>

              <span className={item.completed ? "" : "text-gray-400"}>
                {item.label}
              </span>
            </div>

            <span
              className={
                item.completed
                  ? "text-green-600 text-xs font-medium"
                  : "text-orange-400 text-xs"
              }
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileCompletenessCard;