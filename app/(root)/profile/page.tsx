"use client";

import { StarRating } from "@/components/shared/star-rating";
import UserAvatar from "@/components/shared/user-avatar";
import UserStatCard from "@/components/pages/profile/user-stat-card";
import { useUserContext } from "@/contexts/user/user-context";
import { useFetchOrders } from "@/hooks/order/use-fetch-order";
import { OrderStatus, Product, Review } from "@/types";
import useFetchEligibleProducts from "@/hooks/review/use-fetch-eligible-products";
import useFetchReviews from "@/hooks/review/use-fetch-reviews";
import { formatToNaira } from "@/lib/utils";
import { Order } from "@/types";
import { format } from "date-fns";
import { Divide, DollarSign, MessageSquare, Package, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "text-[#1D6939] bg-[#DCFCE7] border-green-200",
  processing: "bg-violet-50 text-violet-700 border-violet-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  refund_pending: "bg-amber-50 text-amber-700 border-amber-200",
  refunded: "bg-gray-50 text-gray-700 border-gray-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

const Profile = () => {
  const { user, isUserLoading } = useUserContext();

  const { data: orders = [], isLoading: isOrdersLoading } = useFetchOrders({
    page_size: 10,
    page: 1,
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useFetchReviews({
    page_size: 10,
    page: 1,
  });

  const { data: eligibleProducts = [], isLoading: isEligibleProductsLoading } =
    useFetchEligibleProducts({
      page_size: 10,
      page: 1,
    });

  if (isUserLoading || !user) return null;

  return (
    <main className="pt-20 lg:pt-16 bg-[#F6F3EC]">
      <section className="max-w-7xl mx-auto px-5 lg:px-0 py-10 md:py-20">
        <div className="flex flex-col items-center lg:items-start gap-7 pb-12 md:pb-15 border-b border-neutral-300">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2.5 mb-5">
            <h1 className="text-base lg:text-xl font-medium text-primary font-roboto-mono">
              YOUR STUDIO
            </h1>
            <p className="text-sm lg:text-base text-neutral-500">
              Manage your orders and share your experience.
            </p>
          </div>
          <div className="flex items-center lg:items-start">
            <div className="flex flex-row items-center gap-2">
              <UserAvatar
                name={user.name}
                seed={user.email}
                src={user.profile_image_url}
                className="h-16 w-16"
              />
              <div>
                <h2 className="text-base md:text-xl text-black">{user.name}</h2>
                <p className="text-sm lg:text-base text-neutral-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            <UserStatCard
              title="Total Orders"
              value={user.total_orders}
              icon={Package}
              iconBg="bg-emerald-50"
            />
            <UserStatCard
              title="Total Spent"
              value={user.total_spent}
              icon={DollarSign}
              iconBg="bg-primary/10"
            />
            <UserStatCard
              title="Reviews"
              value={user.total_reviews}
              icon={MessageSquare}
              iconBg="bg-violet-50"
            />
          </div>
        </div>
        <div className="flex flex-col gap-9 md:gap-11.5 py-7.5 md:py-12.5">
          <div className="flex flex-col items-center lg:items-start gap-7.5">
            <div className="flex items-center gap-3 text-sm md:text-2xl text-black">
              <Package className="w-6 h-6" />
              <h2>Order History</h2>
            </div>
            <div className="max-h-80 overflow-y-scroll w-full bg-white rounded-2xl">
              {orders.length <= 0 && (
                <div className="w-full h-30 md:h-50 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-xs md:text-base text-neutral-400">
                    <Package className="w-7 h-7 md:w-10 md:h-10" />
                    <p>You haven't placed any orders yet.</p>
                  </div>
                </div>
              )}
              {isOrdersLoading && (
                <div className="flex flex-col gap-4 md:gap-5.5 py-3.5 md:py-6 px-4 md:px-7 border-b border-neutral-300 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start gap-1">
                      <div className="h-4 w-10 md:w-20 bg-foreground" />
                      <div className="h-4 w-8 md:w-15 bg-foreground" />
                    </div>
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className="w-22 h-6 md:h-7 text-xs md:text-sm bg-foreground" />
                      <div className="h-4 w-10 md:w-20 font-bold bg-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-foreground" />
                        <div className="w-18.5 h-6 bg-foreground" />
                      </div>
                      <div className="w-18.5 h-6 bg-foreground" />
                    </div>
                  </div>
                </div>
              )}
              {orders.length > 0 &&
                orders.map((order: Order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 md:gap-5.5 py-3.5 md:py-6 px-4 md:px-7 border-b border-neutral-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-start gap-1">
                        <h3 className="text-black text-base md:text-xl">
                          {order.public_id}
                        </h3>
                        <p className="text-sm md:text-base text-neutral-500">
                          {format(new Date(order.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 md:gap-5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[11px] font-medium border",
                            statusStyles[order.status],
                          )}
                        >
                          {order.status}
                        </Badge>
                        <p className="text-sm md:text-xl font-bold text-black">
                          {formatToNaira(order.total_price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="h-10 object-cover"
                            />
                            <h4 className="text-base text-black">
                              {item.product.name}
                            </h4>
                          </div>
                          <span className="text-base text-neutral-500">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-start gap-7.5">
            <div className="flex items-center gap-3 text-sm md:text-2xl text-black">
              <MessageSquare className="w-6 h-6" />
              <h2>Your Reviews</h2>
            </div>
            <div className="max-h-80 overflow-y-scroll w-full bg-white rounded-2xl">
              {reviews <= 0 && (
                <div className="w-full h-30 md:h-50 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-xs md:text-base text-neutral-400">
                    <MessageSquare className="w-7 h-7 md:w-10 md:h-10" />
                    <p>You haven't written any reviews yet.</p>
                  </div>
                </div>
              )}
              {reviewsLoading && (
                <div className="md:gap-5.5 py-3.5 md:py-6 px-4 md:px-7 border-b border-neutral-300 animate-pulse">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-foreground" />
                        <div className="flex flex-col gap-1 md:gap-1.5">
                          <div className="w-18.5 h-6 bg-foreground" />
                          <div className="w-20 h-6 bg-foreground" />
                        </div>
                      </div>
                      <div className="w-18.5 h-6 bg-foreground" />
                    </div>
                  </div>
                </div>
              )}
              {reviews.length > 0 &&
                reviews.map((review: Review) => (
                  <div className="md:gap-5.5 py-3.5 md:py-6 px-4 md:px-7 border-b border-neutral-300">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.product.image_url}
                            alt={review.product.name}
                            className="h-10 object-cover"
                          />
                          <div className="flex flex-col gap-1 md:gap-1.5">
                            <h4 className="text-base text-black">
                              {review.product.name}
                            </h4>
                            <p className="max-w-45 md:max-w-80 lg:max-w-102.5 text-xs md:text-base text-neutral-500 line-clamp-3">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                        <span>
                          <StarRating rating={review.rating} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-start gap-7.5">
            <div className="flex items-center gap-3 text-sm md:text-2xl text-black">
              <Star className="w-6 h-6" />
              <h2>Products To Review</h2>
            </div>
            <div className="max-h-80 overflow-y-scroll w-full bg-white rounded-2xl">
              {eligibleProducts.length <= 0 && (
                <div className="w-full h-30 md:h-50 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-xs md:text-base text-neutral-400">
                    <Star className="w-7 h-7 md:w-10 md:h-10" />
                    <p>You haven't purchased any products yet to review.</p>
                  </div>
                </div>
              )}
              {isEligibleProductsLoading && (
                <div className="md:gap-5.5 py-3.5 md:py-6 px-4 md:px-7 border-b border-neutral-300 animate-pulse">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-foreground" />
                        <div className="w-18.5 h-6 bg-foreground" />
                      </div>
                      <div className="w-20 md:w-27.5 h-10 bg-foreground" />
                    </div>
                  </div>
                </div>
              )}
              {eligibleProducts.length > 0 &&
                eligibleProducts.map((product: Product) => (
                  <div
                    key={product.id}
                    className="md:gap-5.5 py-3.5 md:py-6 px-4 md:px-7 border-b border-neutral-300"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-10 object-cover"
                          />

                          <h4 className="text-base text-black">
                            {product.name}
                          </h4>
                        </div>
                        <button className="w-27.5 h-10 rounded-xl text-black text-sm flex items-center justify-center border border-neutral-200 cursor-pointer transition-all duration-300 hover:bg-neutral-200">
                          Write Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
