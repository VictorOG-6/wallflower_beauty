"use client";

import ProductCard from "@/components/shared/product-card";
import useFetchProducts from "@/hooks/product/use-fetch-products";
import useFetchProductCategoriesSummary from "@/hooks/product/use-fetch-product-categories-summary";
import { Product, ProductCategoriesSummary } from "@/types";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";

const ShopContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("categories") ?? "All";

  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const pageSize = 8;

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  const updateCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "All") {
      params.delete("categories");
    } else {
      params.set("categories", category);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const { data: categories = [] } = useFetchProductCategoriesSummary({
    status: "published",
  });
  const {
    data: productResponse,
    isLoading,
    isFetching,
  } = useFetchProducts({
    page_size: pageSize,
    page,
    name: search,
    category: activeCategory === "All" ? undefined : activeCategory,
    status: "published",
  });

  const products = useMemo<Product[]>(() => {
    if (Array.isArray(productResponse)) return productResponse;
    return productResponse?.data ?? productResponse?.items ?? [];
  }, [productResponse]);

  const categoryOptions = useMemo(
    () => [
      "All",
      ...categories.map(
        (category: ProductCategoriesSummary) => category.category,
      ),
    ],
    [categories],
  );

  const canGoBack = page > 1;
  const canGoForward = products.length === pageSize;

  return (
    <main className="pt-20 md:pt-28">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-0">
          <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-3.5 lg:gap-2.5">
            <h1 className="text-primary text-base md:text-xl font-roboto-mono">
              THE HOUSE EDIT
            </h1>
            <h2 className="text-[40px] md:text-[89px] text-black leading-13.75 md:leading-21.5">
              Shop <br /> slowly.
            </h2>
            <p className="text-black text-sm md:text-base">
              Shop our complete range of botanical powered skincare essentials.
            </p>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-20 px-5 py-8 md:py-10 md:px-0">
        <div className="flex flex-col-reverse lg:flex-row items-center lg:justify-between gap-8 md:gap-0">
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-5">
            {categoryOptions.map((category: string) => (
              <div
                key={category}
                className={`flex items-center font-roboto-mono justify-center py-1 px-2 md:px-3.5 cursor-pointer text-secondary transition-all duration-300 hover:bg-primary hover:text-white ${activeCategory === category ? "bg-primary text-white" : "text-secondary bg-white border border-primary/20"}`}
                onClick={() => updateCategory(category)}
              >
                <p className="text-sm md:text-base">{category}</p>
              </div>
            ))}
          </div>
          <div className="w-full bg-white md:w-91.5 flex items-center gap-3 py-1.5 md:py-3 px-4 border border-[#F0F0F0] rounded-2xl text-secondary">
            <Search size={24} />
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="w-full border-none outline-none placeholder:text-secondary text-xs md:text-base"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-7">
            {Array.from({ length: pageSize }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-5 animate-pulse"
              >
                <div className="w-37.5 h-50 md:w-60 md:h-80 bg-foreground rounded-2xl" />
                <div className="h-4 w-28 bg-foreground rounded" />
                <div className="h-4 w-20 bg-foreground rounded" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="w-full rounded-2xl bg-foreground px-5 py-16 text-center text-secondary">
            No products found.
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-7">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className="w-full flex items-center justify-center">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canGoBack || isFetching}
              onClick={() =>
                setPage((currentPage) => Math.max(1, currentPage - 1))
              }
              className={`w-11 h-11 flex items-center justify-center rounded-full bg-[#F3F3F3] ${canGoBack ? "text-primary cursor-pointer" : "text-[#C4C4C4]"}`}
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              <span className="w-11 h-11 flex items-center justify-center rounded-full bg-white border border-[#C4C4C4] text-primary">
                {page}
              </span>
            </div>
            <button
              type="button"
              disabled={!canGoForward || isFetching}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className={`w-11 h-11 flex items-center justify-center rounded-full bg-[#F3F3F3] ${canGoForward ? "text-primary cursor-pointer" : "text-[#C4C4C4]"}`}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

const Shop = () => (
  <Suspense
    fallback={
      <main className="pt-20 md:pt-28">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-5 md:px-0">
            <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-3.5 lg:gap-2.5">
              <h1 className="text-primary text-base md:text-xl font-roboto-mono">
                THE HOUSE EDIT
              </h1>
              <h2 className="text-[40px] md:text-[89px] text-black leading-13.75 md:leading-21.5">
                Shop <br /> slowly.
              </h2>
              <p className="text-black text-sm md:text-base">
                Shop our complete range of botanical powered skincare
                essentials.
              </p>
            </div>
          </div>
        </section>
      </main>
    }
  >
    <ShopContent />
  </Suspense>
);

export default Shop;
