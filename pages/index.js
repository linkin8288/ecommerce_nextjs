// Create layout component.
// List Products, add data and render products of id.
// Handle Add to Cart, react context, reducer

import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import data from "@/utils/data";

export default function Home() {
  return (
    <Layout>Home page
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data.products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            // addToCartHandler={addToCartHandler}
          ></ProductItem>
          ))}
      </div>
    </Layout>
  )
}
