import { Helmet } from 'react-helmet-async';

import NewPasswordView from 'src/sections/auth/jwt/new-password-view';

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Administrator : New Password</title>
      </Helmet>

      <NewPasswordView />
    </>
  );
}
