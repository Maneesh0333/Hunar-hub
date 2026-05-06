export default function NoInternet() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-screen text-center bg-[#FAF5ED]">
      <h1 className="text-2xl font-semibold mb-2">No Internet Connection</h1>

      <p className="text-gray-600 mb-4">
        Please check your connection and try again.
      </p>
    </div>
  );
}
