"use client";

import { useState } from "react";

const ITEM = {
  name: "Sample Product",
  description: "This is a sample product description.",
  price: "$99.99",
  maxQuantity: 3,
  minQuantity: 1,
};

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(ITEM.minQuantity);


  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{ITEM.name}</h2>
      <p className="mb-4">{ITEM.description}</p>
      <p className="text-xl font-semibold mb-4">{ITEM.price}</p>
      <div className="mb-4">
        <label htmlFor="quantity" className="block mb-2">
          Quantity:
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min={ITEM.minQuantity}
          max={ITEM.maxQuantity}
          className="border rounded px-2 py-1 w-20"
          value={quantity}
          onChange={(e) => {
            const val = Math.max(
              ITEM.minQuantity,
              Math.min(ITEM.maxQuantity, Number(e.target.value))
            );
            setQuantity(val);
          }}
        />
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add to Cart
      </button>
    </div>
  );
}
