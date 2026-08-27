"use client";

import { StarRating } from "@/components/shared/star-rating";
import { useCart } from "@/contexts/cart/cart-context";
import { useFetchProduct } from "@/hooks/product/use-fetch-products";
import { formatToNaira } from "@/lib/utils";
import { ArrowLeft, Minus, Plus, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading, isError } = useFetchProduct(id);
  const { addItem, isMutating } = useCart();
  const variants = product?.variants ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState<
    string | undefined
  >(undefined);
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];
  const displayedImage =
    selectedVariant?.image_url ||
    product?.image_url ||
    "/images/featured1.avif";

  const handleAddToCart = () => {
    if (!product) return;

    addItem(product, quantity, selectedVariant?.id);
    toast.success("Product added to cart");
  };

  if (isLoading) {
    return (
      <main className="pt-28 md:pt-36">
        <section className="max-w-7xl mx-auto px-5 md:px-0 py-10 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
            <div className="h-100 md:h-150 bg-foreground rounded-[40px]" />
            <div className="flex flex-col gap-5">
              <div className="h-6 w-32 bg-foreground rounded" />
              <div className="h-12 w-3/4 bg-foreground rounded" />
              <div className="h-8 w-40 bg-foreground rounded" />
              <div className="h-28 w-full bg-foreground rounded" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="pt-28 md:pt-36">
        <section className="max-w-7xl mx-auto px-5 md:px-0 py-20 text-center">
          <h1 className="font-roboto-mono text-2xl md:text-4xl text-primary">
            Product not found
          </h1>
          <p className="mt-3 text-secondary">
            We could not find the product you are looking for.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 mt-8 text-primary font-semibold"
          >
            <ArrowLeft size={18} />
            Back to shop
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-28 md:pt-36">
      <section className="max-w-7xl mx-auto px-5 md:px-0 py-10 md:py-20">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Back to shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div className="bg-foreground rounded-[40px] overflow-hidden">
            <img
              src={displayedImage}
              alt={selectedVariant?.name || product.name}
              className="w-full h-100 md:h-150 object-cover"
            />
          </div>

          <div className="flex flex-col gap-6 text-secondary">
            <div className="flex flex-col gap-3">
              <p className="font-roboto-mono text-secondary capitalize">
                {product.category}
              </p>
              <h1 className="font-roboto-mono text-2xl md:text-5xl text-primary">
                {product.name}
              </h1>
              {selectedVariant && (
                <span className="text-sm text-secondary">
                  {selectedVariant.name}
                </span>
              )}
              {product.average_rating !== 0 && (
                <div className="flex items-center gap-3">
                  <img
                    src="/images/5star.png"
                    alt={`${product.average_rating} Stars`}
                    className="w-16 h-4 md:w-25 md:h-5"
                  />
                  <span className="text-sm">
                    ({product.total_reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            <p className="text-xl md:text-3xl font-semibold text-primary">
              {formatToNaira(product.price)}
            </p>

            <p className="text-sm md:text-lg leading-7">
              {product.description}
            </p>

            {variants.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-roboto-mono text-primary">Color</h2>
                </div>
                <div
                  className="flex flex-wrap gap-3"
                  aria-label={`Choose a ${product.name} color`}
                >
                  {variants.map((variant) => {
                    const isSelected = variant.id === selectedVariant?.id;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        title={variant.name}
                        aria-label={`Select ${variant.name}`}
                        aria-pressed={isSelected}
                        className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/30 ring-offset-2"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: variant.color }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center pt-4">
              <div className="w-fit flex items-center gap-4 border border-[#F0F0F0] rounded-2xl px-4 py-3">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((currentQuantity) =>
                      Math.max(1, currentQuantity - 1),
                    )
                  }
                  className="text-primary cursor-pointer"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold min-w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((currentQuantity) => currentQuantity + 1)
                  }
                  className="text-primary cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                disabled={isMutating}
                onClick={handleAddToCart}
                className="bg-primary flex items-center justify-center gap-2.5 py-3 px-8 text-white font-semibold rounded-2xl shadow-md cursor-pointer transition-all duration-300 hover:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShoppingBasket size={20} />
                {isMutating ? "Adding..." : "Add to cart"}
              </button>
            </div>
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16 md:mt-24">
            <h2 className="font-roboto-mono text-primary text-2xl md:text-3xl mb-6">
              Customer reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl bg-foreground p-5 text-secondary"
                >
                  <div className="mb-3">
                    <StarRating rating={review.rating} size={14} />
                  </div>
                  <p className="text-sm leading-6">{review.comment}</p>
                  {review.user?.name && (
                    <p className="text-xs mt-3 text-primary">
                      {review.user.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
