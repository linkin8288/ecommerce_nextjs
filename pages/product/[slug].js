// npm i -D @types/react
// query: Object - The query string parsed to an object, including dynamic route 
// parameters. It will be an empty object during prerendering if the page 
// doesn't use Server-side Rendering. Defaults to {}


import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout'
import { useRouter } from 'next/router';
import React, { useContext } from 'react'
import { Store } from '@/utils/Store';
import data from '@/utils/data';
import Product from '../../models/Product';
import axios from 'axios';
import db from '../../utils/db';
import { toast } from 'react-toastify';

export default function ProductScreen(props) {
  // const { query } = useRouter();
  // const { slug } = query;

  // const product = data.products.find((x) => x.slug === slug);
  // if (!product) {
  //   return <div>Product Not Found</div>
  // }
  // console.log(query)
  // console.log(product)

  // const { state, dispatch } = useContext(Store);
  // if (!product) {
  //   return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  // }

  // const addToCartHandler = () => {

  //   const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
  //   const quantity = existItem ? existItem.quantity + 1 : 1;

  //   if (data.countInStock < quantity) {
  //     return toast.error('Sorry. Product is out of stock');
  //   }
    
  //   dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity} });
  // }
  
  // Connct to mongoDB
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    // data
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

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

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}