// pages/NotFound.jsx
import { useNavigate } from "react-router-dom";
import Button from "../components/Shared/Button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#FAF5ED] text-[#2C1A0E]">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="mt-2 text-lg">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <Button
        label="Go Back"
        onClick={() => navigate(-1)}
        className="mt-6 px-6"
      />
    </div>
  );
}
