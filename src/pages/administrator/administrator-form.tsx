import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { AdminFormView } from 'src/sections/administrator/form/view';

// ----------------------------------------------------------------------

const AdministratorFormPage = () => {
  const params = useParams();

  const { adminCode, type } = params;

  return (
    <>
      <Helmet>
        <title> ผู้ดูแลระบบ : Administrator</title>
      </Helmet>

      <AdminFormView adminCode={`${adminCode}`} type={`${type}`} />
    </>
  );
};

export default AdministratorFormPage;
