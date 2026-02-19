import { Helmet } from 'react-helmet-async';

import { EmailEditorView } from 'src/sections/email-editor/form/view';

// ----------------------------------------------------------------------

const EmailEditorPage = () => (
    <>
        <Helmet>
            <title> Email Template : Administrator</title>
        </Helmet>

        <EmailEditorView />
    </>
)

export default EmailEditorPage;
