"use client";

import {
  Camera,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingBasket,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import UserAvatar from "./user-avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CartItems from "./cart-items";
import { useCart } from "@/contexts/cart/cart-context";
import { formatToNaira } from "@/lib/utils";
import { useUserContext } from "@/contexts/user/user-context";
import ProfilePictureModal from "./profile-picture-modal";
import type { UserRole } from "@/types";
import { useLogout } from "@/hooks/auth/use-logout";

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Shade Finder", href: "/shade-finder" },
];

const ADMIN_ROLES = new Set<UserRole>(["admin", "staff"]);

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUserContext();
  const { totalItems, totalPrice } = useCart();
  const { logout, isLoading } = useLogout();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] =
    useState<boolean>(false);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [scrolledUp, setScrolledUp] = useState<boolean>(false);
  const isActive = (href: string) => pathname === href;
  const isHomepage = pathname === "/";
  const navColorClass =
    isHomepage && !scrolledUp ? "text-black text-white" : "text-black";
  const canAccessAdmin = user ? ADMIN_ROLES.has(user.role) : false;

  const handleProfilePictureModalClose = () => {
    setIsProfilePictureModalOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      }

      if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
        setScrolledUp(currentScrollY > 20);
      }

      if (currentScrollY <= 10) {
        setScrolledUp(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } ${scrolledUp ? "bg-white shadow-md py-4" : "bg-transparent py-6"}`}
    >
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between text-base px-4 lg:px-0 ${navColorClass}`}
      >
        <Link href={"/"} className="cursor-pointer">
          <Image
            src={"/logo.png"}
            alt="Wallflower Beauty Logo"
            width={103}
            height={103}
            className="w-17 h-17 md:w-26 md:h-26 object-cover"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-12 font-inter">
          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className={`transition-all duration-300 cursor-pointer hover:text-primary ${
                isActive(link.href) ? "text-primary underline" : navColorClass
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className={`flex items-center gap-5 md:gap-8 ${navColorClass}`}>
          {canAccessAdmin && (
            <Link
              href="/admin"
              aria-label="Open admin dashboard"
              className={`flex items-center gap-2 transition-colors duration-300 hover:text-primary ${
                pathname.startsWith("/admin") ? "text-primary" : "text-black"
              }`}
            >
              <span className={`hidden xl:inline ${navColorClass}`}>Admin</span>
            </Link>
          )}

          <Popover>
            <PopoverTrigger className="relative">
              <ShoppingBasket
                size={24}
                className={`cursor-pointer transition-colors duration-300 hover:text-primary ${navColorClass}`}
              />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-86 p-4">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-roboto-mono text-sm font-medium text-primary">
                    Wallflower Beauty Cart
                  </h2>
                  <span className="text-xs text-secondary">
                    {totalItems} item{totalItems === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="max-h-86 overflow-y-auto pr-1">
                  <CartItems compact maxItems={3} />
                </div>

                <div className="flex items-center justify-between border-t border-[#E5E5E5] pt-3 text-sm">
                  <span className="text-secondary">Subtotal</span>
                  <span className="font-semibold text-primary">
                    {formatToNaira(totalPrice)}
                  </span>
                </div>

                {user ? (
                  <Link
                    href="/cart"
                    className="w-full flex items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/80"
                  >
                    View cart
                  </Link>
                ) : (
                  <Link
                    href="/sign-in"
                    className="w-full flex items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/80"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {user ? (
            <Popover>
              <PopoverTrigger className="hidden lg:block">
                <UserAvatar
                  name={user.name}
                  seed={user.email}
                  src={user.profile_image_url}
                  className="h-8 w-8 cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="bg-[#E2E8F0]">
                <div className="flex flex-col items-center">
                  <div className="relative text-black hover:text-[#0A66C2] cursor-pointer">
                    <UserAvatar
                      name={user.name}
                      seed={user.email}
                      src={user.profile_image_url}
                      className="h-10 w-10"
                    />
                    <div
                      className="absolute -right-2.5 -bottom-2 w-6 h-6 rounded-full flex items-center justify-center bg-white"
                      onClick={() => setIsProfilePictureModalOpen(true)}
                      aria-label="Edit profile picture"
                    >
                      <Camera size={14} color="#0000FF" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 mt-2">
                    <h2>Hi! {user.name.split(" ")[0]}</h2>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="rounded-xl bg-white flex items-center justify-center px-2.5 py-1.5 mt-3 w-45 text-gray-600 duration-300 transition-all hover:bg-neutral-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 ">My Profile</div>
                  </Link>
                  <p
                    onClick={() => logout()}
                    className="flex items-center gap-2 text-xs text-red-500 cursor-pointer duration-300 transition-all hover:text-red-700 my-2"
                  >
                    <LogOut size={14} />
                    {isLoading ? "Signing out..." : "Sign Out"}
                  </p>
                  {/* <button
                    className="rounded-xl bg-white flex items-center justify-center px-2.5 py-1.5 my-3 w-45 text-gray-600 duration-300 transition-all hover:text-red-500 cursor-pointer"
                    onClick={() => logout()}
                  >
                    <div className="flex items-center gap-2 ">
                      <LogOut size={14} />
                      {isLoading ? "Signing out..." : "Sign Out"}
                    </div>
                  </button> */}
                  <div className="flex items-center gap-1.5 text-black text-[10px]">
                    <Link
                      href="/privacy-policy"
                      className="cursor-pointer transition-all duration-300 hover:text-blue-700"
                    >
                      Privacy Policy
                    </Link>
                    <span className="bg-black w-0.5 h-0.5 rounded-full" />
                    <Link
                      href="/terms-and-condition"
                      className="cursor-pointer transition-all duration-300 hover:text-blue-700"
                    >
                      Terms and Conditions
                    </Link>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Link href={"/sign-in"} className="hidden lg:block">
              <button className="bg-primary cursor-pointer w-25 rounded-md shadow-md text-white text-sm md:flex items-center justify-center py-1.5 px-2 transition-all duration-300 hover:bg-primary/80">
                Sign in
              </button>
            </Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="block lg:hidden transition-all duration-300"
          >
            {isOpen ? (
              <X size={24} className={navColorClass} />
            ) : (
              <Menu size={24} className={navColorClass} />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar: starts below navbar (top-16), slides in from the LEFT */}
      <aside
        className={`fixed top-16 left-0 z-40 w-72 h-[calc(100vh-4rem)] bg-white flex flex-col items-center gap-6 pt-8 shadow-xl transition-transform duration-500 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {user && (
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <UserAvatar
                name={user.name}
                seed={user.email}
                src={user.profile_image_url}
              />
              <div
                className="absolute -right-2.5 -bottom-2 w-6 h-6 rounded-full flex items-center justify-center bg-white"
                onClick={() => setIsProfilePictureModalOpen(true)}
                aria-label="Edit profile picture"
              >
                <Camera size={14} color="#0000FF" />
              </div>
            </div>
            <h2 className="text-sm text-black font-medium">
              Hi! {user.name.split(" ")[0]}
            </h2>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        )}

        <nav className="w-full flex flex-col">
          {canAccessAdmin && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`text-black flex items-center gap-2 px-6 py-3 border-b border-[#8E8E93] font-inter text-sm hover:text-primary transition-colors`}
            >
              Admin
            </Link>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`px-6 py-3 border-b border-[#8E8E93] font-inter text-sm hover:text-primary transition-colors ${
                isActive(link.href) ? "text-primary" : "text-black"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <button
          className={`${
            user ? "bg-red-500" : "bg-primary"
          } rounded-md shadow-md text-white text-sm flex items-center justify-center py-1.5 px-4`}
          onClick={() => logout()}
        >
          {user ? "Sign out" : isLoading ? "Signing out..." : "Sign in"}
        </button>
      </aside>

      {/* Overlay: starts below navbar so the header row stays fully interactive */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-x-0 h-screen top-16 bottom-0 bg-black/40 z-30 md:hidden"
        />
      )}

      <ProfilePictureModal
        isOpen={isProfilePictureModalOpen}
        onClose={handleProfilePictureModalClose}
      />
    </header>
  );
};

export default Navbar;
