import { Helmet } from 'react-helmet-async';

import { EmailEditor2View } from 'src/sections/email-editor/form1/view';

// ----------------------------------------------------------------------

const EmailEditor2Page = () => (
    <>
        <Helmet>
            <title> Email Template : Administrator</title>
        </Helmet>

        <EmailEditor2View />
    </>
)

export default EmailEditor2Page;
