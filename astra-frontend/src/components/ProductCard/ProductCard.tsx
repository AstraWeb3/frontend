import Link from "next/link";
import "../ProductCard/ProductCard.styles.scss";
import { Button } from "@/components/ui/button";

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl: string;
    category: string;
  };
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="product-card-container">
      <img src={product.imageUrl} alt={product.name} />
      <Button variant="default">Add Item to Cart</Button>

      <h2 className="text-xl font-bold mt-4">
        {
          <Link
            href={`/shop/${product.category}/${product.id}`}
            className="text-blue-500 hover:underline"
          >
            {product.name}
          </Link>
        }
      </h2>
      <p className="text-lg font-semibold mt-2">${product.price.toFixed(2)}</p>
    </div>
  );
};

export default ProductCard;
