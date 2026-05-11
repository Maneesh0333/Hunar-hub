import { useState } from "react";
import Button from "../Shared/Button";
import SideSheet from "../Shared/SideSheet";
import PortfolioForm from "../forms/PortfolioForm";
import { usePortfolio } from "../../hooks/Entrepreneur/useCreatePortfolio";
import Spinner from "../Shared/Spinner";

type Props = {
  page: "Entrepreneur" | "User";
  EntrepreneurId?: string;
};

function PortfolioSection({ page, EntrepreneurId }: Props) {
  const [open, setOpen] = useState(false);
  const { data: portfolio, isLoading } = usePortfolio(page, EntrepreneurId);

  return (
    <div className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6 h-fit">
      <div className="flex justify-between">
        <h2 className="font-serif text-lg font-bold mb-4">Portfolio</h2>
        {page === "Entrepreneur" && (
          <Button
            label="Edit"
            className="text-xs h-7"
            onClick={() => setOpen(true)}
          />
        )}
      </div>
      {isLoading ? (
        <div className="min-h-20 flex items-center justify-center">
          <Spinner />
        </div>
      ) : portfolio ? (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(portfolio).map((img) => {
            if (
              ["image1", "image2", "image3", "image4"].includes(img[0]) &&
              img[1]
            ) {
              return (
                <div
                  key={img[0]}
                  className="relative rounded-2xl overflow-hidden border border-[rgba(196,99,42,0.12)]"
                >
                  <img
                    src={img[1]}
                    alt={`preview of ${img}`}
                    className={`${page === "User" ? "aspect-square" : "aspect-video"} w-full  object-cover`}
                  />
                </div>
              );
            }
          })}
        </div>
      ) : (
        <div className="min-h-36 flex items-center justify-center">
          No portfolio
        </div>
      )}

      <SideSheet
        title="Add Portfolio"
        discription="Showcase your best work to customers"
        open={open}
        onClose={() => setOpen(false)}
      >
        <PortfolioForm images={portfolio} closeSheet={() => setOpen(false)} />
      </SideSheet>
    </div>
  );
}

export default PortfolioSection;
