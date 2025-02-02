import Link from "next/link";
import "../[category]/Category.styles.scss";
import ProductCard from "@/app/components/ProductCard/ProductCard";

interface CategoryPageProps {
  params: {
    category: CategoryKey;
  };
}

type CategoryKey = "hats" | "jackets" | "mens" | "sneakers" | "womens";

const categoryData: Record<
  CategoryKey,
  {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
  }[]
> = {
  hats: [
    {
      id: 1,
      name: "Brown Brim",
      price: 25,
      imageUrl: "https://i.ibb.co/ZYW3VTp/brown-brim.png",
      category: "hats",
    },
    {
      id: 2,
      name: "Blue Beanie",
      price: 18,
      imageUrl: "https://i.ibb.co/ypkgK0X/blue-beanie.png",
      category: "hats",
    },
  ],
  jackets: [
    {
      id: 10,
      name: "Black Jacket",
      price: 125,
      imageUrl: "https://i.ibb.co/0jqHpnp/black-jacket.png",
      category: "jackets",
    },
  ],
  mens: [], // Include all required keys with empty arrays if no items exist
  sneakers: [],
  womens: [],
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const products = categoryData[category];

  return (
    <div className="shop-directory-container">
      <h2 className="category-title"> {category.toUpperCase()} </h2>
      <div className="category-container">
        {products &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}
