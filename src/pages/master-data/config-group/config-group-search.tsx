import { Helmet } from 'react-helmet-async';

import { ConfigGroupSearchView } from 'src/sections/master-data/config-group/search/view';

// ----------------------------------------------------------------------

const ConfigGroupSearchPage = () => (
    <>
        <Helmet>
            <title> Config Group Search : Administrator</title>
        </Helmet>

        <ConfigGroupSearchView />
    </>
)

export default ConfigGroupSearchPage;
