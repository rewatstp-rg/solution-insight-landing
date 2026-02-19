export async function compressImage(file: File, { quality = 1, type = file.type }) {

    let fileType = 'jpg';

    if (type === 'image/jpeg') {
        quality -= 0.15;
    } else if (type === 'image/png') {
        fileType = 'png';
    } else if (type === 'image/webp') {
        fileType = 'webp';
    } else {
        fileType = 'jpg';
    }
    // Get as image data
    const imageBitmap = await createImageBitmap(file);

    // Draw to canvas
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    ctx?.drawImage(imageBitmap, 0, 0);

    // Turn into Blob
    const blob: Blob = await new Promise((resolve: any) =>
        canvas.toBlob(resolve, type, quality)
    );

    // Turn Blob into File
    return new File([blob], generateRandomFileName(fileType), {
        type: blob.type,
    });
}

const generateRandomFileName = (extension: string): string => {
    const timestamp = new Date().getTime(); // Add a timestamp for uniqueness
    const randomString = Math.random().toString(36).substring(2, 8); // Random alphanumeric string
    return `file_${timestamp}_${randomString}.${extension}`;
};
