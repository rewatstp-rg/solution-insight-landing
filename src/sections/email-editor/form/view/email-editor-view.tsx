// import React, { useRef } from 'react';
// // import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';

// import { Grid, Container } from "@mui/material";

// import { paths } from 'src/routes/paths';

// import { getStorage } from 'src/hooks/use-local-storage';

// import { endpoints } from 'src/utils/axios';
// import { STORAGE_KEYS } from 'src/utils/constants';

// import CardCustom from "src/components/card/card-custom";
// import { useSettingsContext } from "src/components/settings";
// import { ButtonSubmitForm } from 'src/components/button-forom';
// import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

export default function EmailEditorView() {
 
    // const settings = useSettingsContext();
    // const emailEditorRef = useRef<EditorRef>(null);

    // const key = STORAGE_KEYS.USER_INFO;
    // const userProfile = getStorage(key);
    // console.log("🚀 ~ file: email-editor-view.tsx:24 ~ EmailEditorView ~ userProfile:", userProfile)

    // function base64ImageToBlob(str: any) {

    //     const fileType = 'html';
    //     const trimmedString = str;
    //     const imageContent = atob(trimmedString);
    //     const buffer = new ArrayBuffer(imageContent.length);
    //     const viewPdf = new Uint8Array(buffer);

    //     for (let n = 0; n < imageContent.length; n += 1) {
    //         viewPdf[n] = imageContent.charCodeAt(n);
    //     }

    //     const blob = new Blob([buffer], { type: fileType });
    //     const a = document.createElement("a");
    //     const fileItem: File = new File([blob], 'test', { lastModified: new Date().getTime(), type: fileType });
    //     a.download = 'test.html'
    //     a.href = URL.createObjectURL(fileItem)
    //     a.click()
    //     setTimeout(() => {
    //         URL.revokeObjectURL(a.href)
    //         a.remove()
    //     }, 200)

    //     return fileItem;

    // }

    // const exportHtml = () => {
    //     const unlayer = emailEditorRef.current?.editor;

    //     unlayer?.exportHtml(async (data) => {
    //         const { design, html } = data;
    //         console.log("🚀 ~ file: email-editor-view.tsx:58 ~ unlayer?.exportHtml ~ design:", JSON.stringify(design))
    //         // console.log('exportHtml', html);
    //         // Ensure UTF-8 encoding
    //         const utf8Html = unescape(encodeURIComponent(html)); // Convert to a safe format
    //         const encodeHtml = btoa(utf8Html); // Base64 encode
    //         const fileItem = base64ImageToBlob(encodeHtml);

    //         console.log("🚀 ~ file: email-editor-view.tsx:56 ~ unlayer?.exportHtml ~ fileItem:", fileItem)
    //     });
    // };

    // // const saveFileToServce = async (fileItem: File) => {
    // //     const formData = new FormData();
    // //     formData.append('file', fileItem);
    // //     const model = {
    // //         "imageFileName": fileItem.name,
    // //         "imageFileUrl": ""
    // //     }

    // //     formData.append('data', JSON.stringify(model));
    // //     axios.defaults.headers.common.Authorization = `Bearer ${userProfile.accessToken}`;
    // //     const url = endpoints.commonController.uploadImageEmail;
    // //     const res = await axios.post(url, formData);
    // //     return res?.data?.imageFileUrl;
    // // }

    // const onReady: EmailEditorProps['onReady'] = (unlayer : any) => {
    //     // unlayer?.loadDesign(designTest);
    //     unlayer?.registerCallback('image', (file: any, done: any) => {
    //         const url = endpoints.commonController.uploadImageEmail;
    //         const formData = new FormData();

    //         const model = {
    //             "imageFileName": file.attachments[0].name,
    //             "imageFileUrl": ""
    //         }

    //         formData.append('file', file.attachments[0]);
    //         formData.append('data', JSON.stringify(model));

    //         fetch(`https://admin-checkrace.solutioninsight.tech${url}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json'
    //             },
    //             body: formData
    //         }).then(response => {
    //             // Make sure the response was valid
    //             if (response.status >= 200 && response.status < 300) {
    //                 return response
    //             }
    //             const error: any = new Error(response.statusText)
    //             error.response = response
    //             throw error;
    //         }).then(response => (response.json())).then(data => {
    //             console.log("🚀 ~ file: email-editor-view.tsx:114 ~ data:", data.data.imageFileUrl)
    //             // Pass the URL back to Unlayer to mark this upload as completed
    //             done({ progress: 100, url: data.data.imageFileUrl })
    //         })


    //         // unlayer?.registerCallback('image', async function (file: any, done: any) {

    //         //     if (file && file?.accepted && file.accepted?.length > 0) {
    //         //         const { attachments } = file;
    //         //         const imageFileUrl = await saveFileToServce(attachments[0]);
    //         //         console.log("🚀 ~ file: email-editor-view.tsx:89 ~ imageFileUrl:", imageFileUrl)
    //         //         done({ progress: 100, url: imageFileUrl })
    //         //     }


    //         // })
    //     });
    // }

    // const onResetForm = () => {

    // }

    return (
        <>TEST</>
        // <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        //     <CustomBreadcrumbs
        //         heading="Email Template"
        //         links={[
        //             { name: 'Dashboard Overview', href: paths.dashboard.general.overview },
        //             { name: 'Editor' },
        //         ]}
        //         sx={{
        //             mb: { xs: 3, md: 5 },
        //         }}
        //     />

        //     <CardCustom title='Editor'>
        //         <Grid container spacing={3}>
        //             <React.StrictMode>
        //                 <EmailEditor
        //                     editorId='email-editor'
        //                     ref={emailEditorRef}
        //                     onReady={onReady}
        //                     minHeight="750px"
        //                     options={{
        //                         tools: {
        //                             html: {
        //                                 enabled: false,
        //                             },
        //                             menu: {
        //                                 enabled: false,
        //                             },
        //                             button: {
        //                                 sections: {
        //                                     buttonBranding: {
        //                                         enabled: false
        //                                     }
        //                                 }
        //                             }
        //                         },
        //                     }}

        //                 />
        //             </React.StrictMode>
        //         </Grid>
        //         <ButtonSubmitForm
        //             cancelLabel='กลับ'
        //             submitLabel='Export Html'
        //             onSubmit={() => exportHtml()}
        //             onCancel={() => onResetForm()}
        //         />
        //     </CardCustom>

        // </Container>
    )
}