import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { ConfigGroupSearchListBoxView } from 'src/sections/master-data/config-group/search-list-box/view';

// ----------------------------------------------------------------------


const ConfigGroupSearchListBoxPage = () => {
    const params = useParams();

    const { listboxGroup, type } = params;

    return (
        <>
            <Helmet>
                <title> Config Listbox Search : Administrator</title>
            </Helmet>

            <ConfigGroupSearchListBoxView listboxGroup={`${listboxGroup}`} type={`${type}`} />
        </>
    )
}

export default ConfigGroupSearchListBoxPage;
