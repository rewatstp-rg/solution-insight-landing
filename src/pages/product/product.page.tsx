import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";

import { ProductView } from "src/sections/product/view";

export default function ProductPage() {

    const params = useParams();
    const { code, type } = params;

    return (
        <>
            <Helmet>
                <title>Product</title>
            </Helmet>
            <ProductView code={`${code}`} type={`${type}`} />
        </>
    );
}