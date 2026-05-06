import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type SearchBarProps = {
  triggerSearch: (query: string) => void;
};

function SearchBar({ triggerSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  // debounce input
  const [debouncedQuery] = useDebounce(query, 400);

  // trigger search when user stops typing
  useEffect(() => {
    triggerSearch(debouncedQuery);
  }, [debouncedQuery, triggerSearch]);

  return (
    <div className="mt-6 flex bg-white rounded-xl overflow-hidden shadow-xl">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by skill or name…"
        className="flex-1 px-5 py-4 text-sm outline-none"
      />
    </div>
  );
}

export default SearchBar;
