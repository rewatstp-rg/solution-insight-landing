import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { EmailTransactionFormView } from 'src/sections/email-transaction/form/view';

// ----------------------------------------------------------------------

const EmailTransactionFormPage = () => {

    const params = useParams();
    const { transactionNo, type } = params;

    return (
        <>
            <Helmet>
                <title>Email Transaction : Administrator</title>
            </Helmet>

            <EmailTransactionFormView transactionNo={`${transactionNo}`} type={`${type}`} />
        </>
    )
}

export default EmailTransactionFormPage;
