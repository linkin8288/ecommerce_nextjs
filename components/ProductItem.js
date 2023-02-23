import React from 'react'
import Link from 'next/link';

export default function ProductItem({ product }) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`} legacyBehavior>
      <a>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow object-cover h-64 w-full"
        />
      </a>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`} legacyBehavior>
          <a>
            <h2 className="text-lg">{product.name}</h2>
          </a>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>${product.price}</p>
        <button
          className="primary-button"
          type="button"
          // onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

function reducer (state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      
      const newItem = action.payload;
      
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
      
        : [...state.cart.cartItems, newItem];
      
      return { ...state, cart: { ...state.cart, cartItems } };
    }
  }
}  
