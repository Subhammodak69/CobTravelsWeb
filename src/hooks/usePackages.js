import { destinations, reviews, posts } from "../data/packages";

export default function usePackages() {
  const getPackageById = (id) => destinations.find((item) => item.id === id);
  return { packages: destinations, reviews, posts, getPackageById };
}
