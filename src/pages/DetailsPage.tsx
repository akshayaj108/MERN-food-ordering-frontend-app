import { useGetRestaurantDetails } from "@/apiRequest/SearchRestaurantsApi";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfoCard from "@/components/RestaurantInfoCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { MenuItem as MenuItemType } from "@/types";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};
function DetailsPage() {
  const { restaurantId } = useParams();
  const { restaurant, isLoading } = useGetRestaurantDetails(restaurantId);
  const [cartItem, setCartItem] = useState<CartItem[]>([]);

  if (isLoading) {
    return "Loading";
  }
  if (!restaurant) {
    return "Restaurant not found";
  }
  const addToCart = (menuItem: MenuItemType) => {
    setCartItem((prevCartItem) => {
      //1. first check cart if item is already exits then update quantity.
      const isExistItem = prevCartItem.find(
        (cartItem: CartItem) => cartItem._id === menuItem._id
      );
      let updatedCartItem;
      if (isExistItem) {
        updatedCartItem = prevCartItem.map((cartItem: CartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCartItem = [
          ...prevCartItem,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }
      //2. if not then add item in cart as new item
      return updatedCartItem;
    });
  };
  const removeCartItem = (menuItem: CartItem) => {
    setCartItem((prevCartItem) => {
      const isExistItem = prevCartItem.find(
        (cartItem) => cartItem._id === menuItem._id
      );
      let updatedCartItem;
      if (isExistItem?.quantity == 1) {
        updatedCartItem = prevCartItem.filter(
          (cartItem) => cartItem._id !== menuItem._id
        );
      } else {
        updatedCartItem = prevCartItem.map((cartItem) =>
          cartItem._id === menuItem._id
            ? {
                ...cartItem,
                quantity: cartItem.quantity - 1,
              }
            : cartItem
        );
      }
      return updatedCartItem;
    });
  };
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
            <MenuItem
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
            />
          ))}
        </div>
        <div>
          <Card>
            <OrderSummary
              restaurant={restaurant}
              cartItem={cartItem}
              removeCartItem={removeCartItem}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
