import { Helmet } from 'react-helmet-async';

import { NewPasswordForEmailView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function NewPasswordForEmailPage() {
    return (
        <>
            <Helmet>
                <title> Checkrace: Change Password</title>
            </Helmet>

            <NewPasswordForEmailView />
        </>
    );
}
