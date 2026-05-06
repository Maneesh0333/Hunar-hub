import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import NoInternet from "../../pages/NoInternet";
import Reviews from "../Reviews";
import Header from "../Shared/Header";

function ReviewsPage() {
  const isOnline = useNetworkStatus();

  if (!isOnline) {
    return <NoInternet />;
  }

  return (
    <div className="flex flex-col flex-1 space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      <Header
        title="Customer Reviews"
        description="What people are saying about your work"
      />

      <Reviews titleRequired={false} />
    </div>
  );
}

export default ReviewsPage;
