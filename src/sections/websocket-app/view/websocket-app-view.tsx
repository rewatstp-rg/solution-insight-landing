import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

import { Box, Button } from '@mui/material';


const SOCKET_URL_ONE = 'wss://echo.websocket.events';
const READY_STATE_OPEN = 1;

export default function WebsocketAppView() {
    // const [currentSocketUrl, setCurrentSocketUrl] = useState<string>(SOCKET_URL_ONE);
    const [messageHistory, setMessageHistory] = useState([]);
    const [inputtedMessage, setInputtedMessage] = useState('');
    const { sendMessage, lastMessage, readyState } = useWebSocket(
        SOCKET_URL_ONE,
        {
            share: true,
            shouldReconnect: () => true,
        }
    );

    useEffect(() => {
        if (lastMessage?.data) {
            setMessageHistory((prev) => prev.concat(lastMessage.data))
        }
    }, [lastMessage]);
    
    const readyStateString = {
        0: 'CONNECTING',
        1: 'OPEN',
        2: 'CLOSING',
        3: 'CLOSED',
    }[readyState];

    return (
        <Box>
            Whatever you send will be echoed from the Server
            <Box>
                <input
                    style={{ marginRight: '10px' }}
                    type='text'
                    value={inputtedMessage}
                    onChange={(e) => setInputtedMessage(e.target.value)}
                />
                <Button
                    variant='contained'
                    onClick={() => sendMessage(inputtedMessage)}
                    disabled={readyState !== READY_STATE_OPEN}
                >
                    Send
                </Button>
            </Box>
            Select Socket Server:
            <br />
            ReadyState: {readyStateString}
            <br />
            MessageHistory: {messageHistory.join(', ')}
        </Box>
    );
};