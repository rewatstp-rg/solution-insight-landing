import { Helmet } from 'react-helmet-async';

import { UploadCommonImageFrameView } from 'src/sections/upload-common-image-frame/view';

// ----------------------------------------------------------------------

const UploadCommonImageFramePage = () => (
    <>
        <Helmet>
            <title>Upload Image Frame</title>
        </Helmet>

        <UploadCommonImageFrameView />
    </>)

export default UploadCommonImageFramePage;