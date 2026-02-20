import { Helmet } from "react-helmet-async";

import { ProductSearchView } from "src/sections/product/view";

export default function ProductPage() {
    return (
        <>
            <Helmet>
                <title>Product</title>
            </Helmet>
            <ProductSearchView />
        </>
    );
}