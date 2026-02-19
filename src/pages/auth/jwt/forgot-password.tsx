import { Helmet } from 'react-helmet-async';

import { ForgotPasswordView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Administrator : Forgot Password</title>
      </Helmet>

      <ForgotPasswordView />
    </>
  );
}
