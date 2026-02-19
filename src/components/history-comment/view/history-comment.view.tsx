import Divider from '@mui/material/Divider';

import ISOToDate from 'src/utils/ISOToDate';

import Sender from '../Sender';
import Content from '../Content';

type Props = {
    history: any
}
const HistoryCommentView = ({ history }: Props) => (
    <>
        <Sender position={history?.orderNumber || '-'} actionBy={history?.actionBy || '-'} timestamp={ISOToDate(new Date(history?.createDtm || ''), 'dateRequestTime') || '-'} />
        <Content message={history?.remark || ''} />
        <Divider sx={{ borderStyle: 'dashed' }} />
    </>
);

export default HistoryCommentView;
