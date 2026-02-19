import { Helmet } from 'react-helmet-async';

import { SubDistrictSearchView } from 'src/sections/master-data/sub-district/view';

// ----------------------------------------------------------------------

const SubDistrictSearchPage = () => (
    <>
        <Helmet>
            <title>Sub District Search : Administrator</title>
        </Helmet>

        <SubDistrictSearchView />
    </>
)

export default SubDistrictSearchPage;
