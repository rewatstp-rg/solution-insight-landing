

export const getPathImageByfile64 = (fileResponse: any) => {
    
    if (fileResponse?.name && fileResponse?.file) {
        const { name, file } = fileResponse;
        const fileType = 'image/png';
        const trimmedString = file;
        const imageContent = atob(trimmedString);
        const buffer = new ArrayBuffer(imageContent.length);
        const viewPdf = new Uint8Array(buffer);

        for (let n = 0; n < imageContent.length; n += 1) {
            viewPdf[n] = imageContent.charCodeAt(n);
        }

        const blob = new Blob([buffer], { type: fileType });
        const fileItem: File = new File([blob], name, { lastModified: new Date().getTime(), type: fileType });

        const newFile: any = Object.assign(fileItem, {
            preview: URL.createObjectURL(fileItem),
        });

        return newFile?.preview;
    }

    return null;
}   