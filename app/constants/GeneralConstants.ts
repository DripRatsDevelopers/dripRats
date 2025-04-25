export const sortOptions: { value: string; label: string }[] = [
  {
    value: "recommended",
    label: "Recommended",
  },
  {
    value: "price_asc",
    label: "Price: Low to High",
  },
  {
    value: "name_asc",
    label: "Name: A to Z",
  },
  {
    value: "name_desc",
    label: "Name: Z to A",
  },
];

export const PRODUCT_CATEGORY = [
  { name: "Rings", slug: "Rings" },
  { name: "Bracelets", slug: "Bracelets" },
  { name: "Chains", slug: "Chains" },
];

export const BREADCRUMBS_DISALLOW_PATH = ["/checkout"];
