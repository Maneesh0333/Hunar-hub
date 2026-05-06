import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex-1 h-screen flex items-center justify-center">
      {isRouteErrorResponse(error) ? (
        <h1>
          {error.status} {error.statusText}
        </h1>
      ) : error instanceof Error ? (
        <h1>{error.message}</h1>
      ) : (
        <h1>Something went wrong</h1>
      )}
    </div>
  );
}
