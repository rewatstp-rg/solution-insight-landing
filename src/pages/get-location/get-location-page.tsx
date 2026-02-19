import { Helmet } from 'react-helmet-async';

import { GetLocationView } from 'src/sections/get-location';

// ----------------------------------------------------------------------

const GetLocationPage = () => (
    <>
        <Helmet>
            <title> Location : Administrator</title>
        </Helmet>

        <GetLocationView />
    </>)

export default GetLocationPage;
