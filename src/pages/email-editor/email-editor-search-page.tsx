// EmailTemplateSearchView
import { Helmet } from 'react-helmet-async';

import { EmailTemplateSearchView } from 'src/sections/email-editor/search/view';

// ----------------------------------------------------------------------

const EmailTemplateSearchPage = () => (
    <>
        <Helmet>
            <title>Search Email Template : Administrator</title>
        </Helmet>

        <EmailTemplateSearchView />
    </>
)

export default EmailTemplateSearchPage;
