import { Helmet } from 'react-helmet-async';

import { ViewCommonImageFrameView } from 'src/sections/upload-common-image-frame/view';

// ----------------------------------------------------------------------

const ViewCommonImageFramePage = () => (
    <>
        <Helmet>
            <title>View Image Frame</title>
        </Helmet>

        <ViewCommonImageFrameView />
    </>)

export default ViewCommonImageFramePage;