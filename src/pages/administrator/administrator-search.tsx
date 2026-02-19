import { Helmet } from 'react-helmet-async';

import { AdministratorSearchView } from 'src/sections/administrator/search/view';

// ----------------------------------------------------------------------

const AdministratorSearchPage = () => (
  <>
    <Helmet>
      <title> Administrator Search : Administrator</title>
    </Helmet>

    <AdministratorSearchView />
  </>
)

export default AdministratorSearchPage;
