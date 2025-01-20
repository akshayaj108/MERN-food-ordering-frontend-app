import { Restaurant } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Dot } from "lucide-react";

type Props = {
  restaurant: Restaurant;
};
const RestaurantInfoCard = (restaurant: Props) => {
  const restaurantDetail = restaurant.restaurant;
  return (
    <Card className="border-sla">
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight">
          {restaurantDetail.restaurantName}
        </CardTitle>
        <CardDescription>
          {restaurantDetail.city}, {restaurantDetail.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap">
        {restaurantDetail.cuisines.map((item, index) => (
          <span className="flex">
            <span>{item}</span>
            {index < restaurantDetail.cuisines.length - 1 && <Dot />}
          </span>
        ))}
      </CardContent>
    </Card>
  );
};

export default RestaurantInfoCard;
