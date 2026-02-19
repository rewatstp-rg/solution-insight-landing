import { Helmet } from 'react-helmet-async';

import { DistrictSearchView } from 'src/sections/master-data/district/view';

// ----------------------------------------------------------------------

const DistrictSearchPage = () => (
    <>
        <Helmet>
            <title> District Search : Administrator</title>
        </Helmet>

        <DistrictSearchView />
    </>
)

export default DistrictSearchPage;
