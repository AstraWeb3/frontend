"use client";

import Link from "next/link";

const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "books", name: "Books" },
];

export default function CategoriesPreview() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Shop Categories</h1>
      <ul className="list-disc pl-4">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/shop/${category.id}`}
              className="text-blue-500 hover:underline"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
