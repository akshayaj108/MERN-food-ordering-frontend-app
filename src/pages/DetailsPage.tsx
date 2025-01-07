import { useGetRestaurantDetails } from "@/apiRequest/SearchRestaurantsApi";
import MenuItem from "@/components/MenuItem";
import RestaurantInfoCard from "@/components/RestaurantInfoCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useParams } from "react-router-dom";

function DetailsPage() {
  const { restaurantId } = useParams();
  const { restaurant, isLoading } = useGetRestaurantDetails(restaurantId);
  if (isLoading) {
    return "Loading";
  }
  if (!restaurant) {
    return "Restaurant not found";
  }
  return (
    <div className="flex flex-col gap-10">
      <AspectRatio ratio={16 / 5}>
        <img
          className="rounded-md object-cover h-full w-full"
          src={restaurant.imageUrl}
          alt=""
        />
      </AspectRatio>
      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <RestaurantInfoCard restaurant={restaurant} />
          <span className="text-2xl font-bold tracking-tight">Menu</span>
          {restaurant.menuItems.map((menuItem) => (
            <MenuItem menuItem={menuItem} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
