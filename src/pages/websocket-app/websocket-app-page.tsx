import { Helmet } from 'react-helmet-async';

import { WebsocketAppView } from 'src/sections/websocket-app/view';

// ----------------------------------------------------------------------

const WebsocketAppPage = () => (
    <>
        <Helmet>
            <title> Websocket : Administrator</title>
        </Helmet>

        <WebsocketAppView />
    </>)

export default WebsocketAppPage;
