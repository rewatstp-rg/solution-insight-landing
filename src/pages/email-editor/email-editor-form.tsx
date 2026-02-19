import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { EmailEditorFormView } from 'src/sections/email-editor/editor/view';

// ----------------------------------------------------------------------

const EmailTemplateFormPage = () => {

    const params = useParams();
    const { id, type } = params;

    return (
        <>
            <Helmet>
                <title>Email Template : Administrator</title>
            </Helmet>

            <EmailEditorFormView id={`${id}`} type={`${type}`}/>
        </>
    )
}

export default EmailTemplateFormPage;
