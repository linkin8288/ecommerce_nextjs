// npm i -D @types/react
// query: Object - The query string parsed to an object, including dynamic route 
// parameters. It will be an empty object during prerendering if the page 
// doesn't use Server-side Rendering. Defaults to {}

import { useRouter } from 'next/router'
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout'
import React, { useContext } from 'react'
import { Store } from '@/utils/Store';
import data from '@/utils/data';

export default function ProductScreen() {
  const { query } = useRouter();
  const { slug } = query;

  const product = data.products.find((x) => x.slug === slug);
  if (!product) {
    return <div>Product Not Found</div>
  }
  console.log(query)
  console.log(product)

  const { state, dispatch } = useContext(Store);

  const addToCartHandler = () => {

    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity} });
  }

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/" legacyBehavior>back to products</Link>
      </div>

      <div className="grid md:grid-cols-4 md:gap-3">
        
        {/* Product Image */}
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </div>

        {/* Product Details */}
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>

        {/* Add to Cart button */}
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
