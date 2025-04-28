import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { Product } from "@/types";


const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  return ( 
  <>
  {/* //eslint-disable-next-line @typescript-eslint/ban-ts-comment @ts-ignore this is to get rid of build error */}
   <ProductList data={latestProducts as unknown as Product[]} title="Newest Arrivals" limit={4} />
  </> );
}
 
export default Homepage;