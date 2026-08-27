"use client";

import React from "react";
import CreateProductProvider from "@/contexts/product/create-product-context";
import AdminRouteGuard from "@/components/shared/admin-route-gaurd";

const AdminProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminRouteGuard>
      <CreateProductProvider>{children}</CreateProductProvider>
    </AdminRouteGuard>
  );
};

export default AdminProviders;
