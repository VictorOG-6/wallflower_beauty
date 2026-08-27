export const userKeys = {
  me: ["user", "me"] as const,
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: {}) => [...userKeys.lists(), filters] as const,
};

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: {}) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  metrics: () => [...productKeys.all, "metrics"] as const,
};

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (filters: {}) => [...reviewKeys.lists(), filters] as const,
  details: () => [...reviewKeys.all, "detail"] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
  metrics: () => [...reviewKeys.all, "metrics"] as const,
};

export const cartItemKeys = {
  all: ["cartItems"] as const,
  lists: () => [...cartItemKeys.all, "list"] as const,
  list: (filters: {}) => [...cartItemKeys.lists(), filters] as const,
  details: () => [...cartItemKeys.all, "detail"] as const,
  detail: (id: string) => [...cartItemKeys.details(), id] as const,
  metrics: () => [...cartItemKeys.all, "metrics"] as const,
};

export const cartKeys = {
  all: ["cart"] as const,
  lists: () => [...cartKeys.all, "list"] as const,
  list: (filters: {}) => [...cartKeys.lists(), filters] as const,
};

export const orderItemKeys = {
  all: ["orderItems"] as const,
  lists: () => [...orderItemKeys.all, "list"] as const,
  list: (filters: {}) => [...orderItemKeys.lists(), filters] as const,
  details: () => [...orderItemKeys.all, "detail"] as const,
  detail: (id: string) => [...orderItemKeys.details(), id] as const,
  metrics: () => [...orderItemKeys.all, "metrics"] as const,
};

export const orderKeys = {
  all: ["order"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: {}) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  metrics: () => [...orderKeys.all, "metrics"] as const,
};

export const paymentKeys = {
  all: ["payment"] as const,
  verification: (reference: string) =>
    [...paymentKeys.all, "verification", reference] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  lists: () => [...dashboardKeys.all, "list"] as const,
  list: (filters: {}) => [...dashboardKeys.lists(), filters] as const,
  details: () => [...dashboardKeys.all, "detail"] as const,
  detail: (id: string) => [...dashboardKeys.details(), id] as const,
  metrics: () => [...dashboardKeys.all, "metrics"] as const,
};
