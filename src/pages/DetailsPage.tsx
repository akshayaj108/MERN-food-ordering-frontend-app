import { useCreateCheckoutSession } from "@/apiRequest/OrderApi";
import { useGetRestaurantDetails } from "@/apiRequest/SearchRestaurantsApi";
import CheckoutButton from "@/components/CheckoutButton";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfoCard from "@/components/RestaurantInfoCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
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
  const { createCheckoutSession, isLoading: isCheckoutLoading } =
    useCreateCheckoutSession();

  const [cartItem, setCartItems] = useState<CartItem[]>(() => {
    const storedItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    return storedItems ? JSON.parse(storedItems) : [];
  });

  if (isLoading) {
    return "Loading";
  }
  if (!restaurant) {
    return "Restaurant not found";
  }
  const onCheckout = async (userFormData: UserFormData) => {
    if (!restaurant) return;
    //convert data as per backend api needed
    const checkoutData = {
      cartsItems: cartItem.map((item) => ({
        menuItemId: item._id,
        name: item.name,
        price: item.price.toString(),
        quantity: item.quantity,
      })),

      deliveryDetails: {
        email: userFormData.email as string,
        name: userFormData.name,
        addressLine: userFormData.addressLine1,
        city: userFormData.city,
      },
      restaurantId: restaurant._id,
    };
    const data = await createCheckoutSession(checkoutData);
    window.location.href = data.url;
  };
  const addToCart = (menuItem: MenuItemType) => {
    setCartItems((prevCartItem) => {
      //1. first check cart if item is already exits then update quantity.
      const isExistItem = prevCartItem.find(
        (cartItem) => cartItem._id === menuItem._id
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
          ...cartItem,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }
      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItem)
      );
      return updatedCartItem;
    });
  };
  const removeCartItem = (menuItem: CartItem) => {
    setCartItems((prevCartItem) => {
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
      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItem)
      );
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
            <CardFooter>
              <CheckoutButton
                isLoading={isCheckoutLoading}
                onCheckout={onCheckout}
                disabled={cartItem.length === 0}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
