import { Helmet } from 'react-helmet-async';

import { ProvinceSearchView } from 'src/sections/master-data/province/search/view';

// ----------------------------------------------------------------------

const ProvinceSearchPage = () => (
    <>
        <Helmet>
            <title> Province Search : Administrator</title>
        </Helmet>

        <ProvinceSearchView />
    </>
)

export default ProvinceSearchPage;
