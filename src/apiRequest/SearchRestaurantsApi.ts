import { SearchState } from "@/pages/SearchResultsPage";
import { RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSearchRestaurant = (
  searchState: SearchState,
  city?: string
) => {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("sortOption", searchState.sortOption.toString());
    params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    const url = `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }

    return response.json();
  };

  const { data: searchResults, isLoading } = useQuery(
    ["searchRestaurants", searchState],
    createSearchRequest
  );
  return {
    searchResults,
    isLoading,
  };
};
