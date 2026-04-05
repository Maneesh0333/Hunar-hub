import Reviews from "../Reviews";
import Header from "../Shared/Header";

function ReviewsPage() {

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      <Header
        title="Customer Reviews"
        description="What people are saying about your work"
      />

      <Reviews titleRequired={false} />
    </div>
  );
}

export default ReviewsPage;
