// EmailTemplateSearchView
import { Helmet } from 'react-helmet-async';

import { EmailTransactionSearchView } from 'src/sections/email-transaction/search/view';


// ----------------------------------------------------------------------

const EmailTemplateSearchPage = () => (
    <>
        <Helmet>
            <title>Search Email Transaction : Administrator</title>
        </Helmet>

        <EmailTransactionSearchView />
    </>
)

export default EmailTemplateSearchPage;
