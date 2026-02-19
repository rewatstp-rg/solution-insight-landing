import { Helmet } from 'react-helmet-async';

import { ProfilePreview } from 'src/sections/profile-preview/view';

// ----------------------------------------------------------------------

const ProfilePreviewPage = () => (
    <>
        <Helmet>
            <title> Profile Preview : Administrator</title>
        </Helmet>

        <ProfilePreview />
    </>)

export default ProfilePreviewPage;
