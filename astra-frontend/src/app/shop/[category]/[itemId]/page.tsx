import ProductCard from "@/app/components/ProductCard/ProductCard";

interface ItemPageProps {
  params: {
    category: CategoryKey;
    itemId: string;
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

export default function ItemPage({ params }: ItemPageProps) {
  const { category, itemId } = params;
  const items = categoryData[category];
  const item = items.find((item) => item.id === parseInt(itemId));

  if (!item) {
    return <p>Item not found</p>;
  }

  return <ProductCard product={item} />;
}
