import { useState, useEffect } from "react";
import EmailEditor from "@editex/react-email-editor";

import './test.css';

type Props = {
    blockList?: any[];
    emailEditorRef?: any;
}

export default function FormEditor({ blockList = [], emailEditorRef }: Props) {

    const [emailData, setEmailData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setEmailData(blockList);
            setLoading(false);
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockList]);

    return (
        <div className="page" >
            <div className="page-content">{emailData && !loading ? <EmailEditor options={{
                customCSS: [
                    `
                      body {
                        background-color: yellow !important;
                        display: block !important;
                      }
                    `
                ]
            }}
                ref={emailEditorRef} defaultBlockList={emailData} /> : <>กำลังโหลด...</>}</div>
        </div>
    )
}