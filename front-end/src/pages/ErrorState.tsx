import Button from "../components/Shared/Button";

type Props = {
  message?: string;
  onRetry: () => void;
  isLoading?: boolean;
};
export default function ErrorState({
  message = "Something went wrong",
  onRetry,
  isLoading = false,
}: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-2xl font-semibold">
        {message}
      </h1>

      <Button
        label="Try Again"
        onClick={onRetry}
        isLoading={isLoading}
        disabled={isLoading}
        className="bg-black text-white"
      />
    </div>
  );
}