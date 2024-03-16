import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const SearchInput = React.memo(({ search, onChange, onKeyDown }) => (
  <input
    type="search"
    id="search-dropdown"
    className="block p-2.5 sm:w-[250px] z-20 text-sm text-gray-900 bg-gray-50 rounded-lg w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
    placeholder="Search Products..."
    required
    value={search}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
  />
));

export default function SearchAppBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      search !== "" ? navigate(`/search/${search}`) : () => {}
    }
  }
  const MemoizedSearchInput = useMemo(
    () => <SearchInput search={search} onChange={setSearch} onKeyDown={handleEnter} />,
    [search]
  );
  
  return (
    <div className="relative w-full mb-3 sm:mb-0 sm:me-3">
      {MemoizedSearchInput}
      <button
        onClick={() => search !== "" ? navigate(`/search/${search}`) : () => {}}
        className="absolute top-0 end-0 sm:end-[10px] p-2.5 text-sm font-medium h-full text-white bg-[#e10f37] rounded-e-lg border border-[#e10f37] hover:bg-[#DA2E4F] focus:ring-4 focus:outline-none focus:ring-[#DA2E4F]"
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </div>
  );
}
