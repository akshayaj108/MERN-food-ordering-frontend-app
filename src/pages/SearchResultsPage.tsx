import { useSearchRestaurant } from "@/apiRequest/SearchRestaurantsApi";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar, { searchForm } from "@/components/SearchBar";
import SearchResultCards from "@/components/SearchResultCards";
import SearchResultsInfo from "@/components/SearchResultsInfo";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type SearchState = {
  searchQuery: string;
  page: number;
};
const SearchResultsPage = () => {
  const { city } = useParams();
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: "",
    page: 1,
  });
  const { searchResults, isLoading } = useSearchRestaurant(searchState, city);

  if (isLoading) {
    return <span>Loading...</span>;
  }
  if (!searchResults?.data || !city) {
    return <span>No results found</span>;
  }

  const setPage = (page: number) => {
    setSearchState((prevState) => ({
      ...prevState,
      page,
    }));
  };
  const setSearchQuery = (searchFormData: searchForm) => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: searchFormData.searchQuery,
      page: 1,
    }));
  };
  const resetSearch = () => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: "",
      page: 1,
    }));
  };
  console.log("search results", searchResults.pagination);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div id="cuisines-list">insert cuisines here</div>
      <div id="main-content" className="flex flex-col gap-5">
        <SearchBar
          searchQuery={searchState.searchQuery}
          onSubmit={setSearchQuery}
          placeholder="Search by Cuisine or Restaurant Name"
          onReset={resetSearch}
        />
        <SearchResultsInfo
          total={searchResults?.pagination?.total}
          city={city}
        />
        {searchResults.data.map((restaurant) => (
          <SearchResultCards restaurant={restaurant} />
        ))}
        <PaginationSelector
          page={searchResults.pagination.page}
          pages={searchResults.pagination.pageSize}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default SearchResultsPage;
