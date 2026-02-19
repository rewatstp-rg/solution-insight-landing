

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

export const getPathImageByfile64NoneFileName = (fileResponse: any) => {
  if (fileResponse?.file) {
    const { name, file } = fileResponse;

    const fileType = 'image/jpeg';
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

    return newFile.preview;
  }

  return null;
}

type Orientation = {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape' | 'square';
};


export const checkImageOrientationFromUrl = (imageUrl: string): Promise<Orientation> => (
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;

      if (width > height) {
        resolve({ width, height, orientation: 'landscape' }); // แนวนอน
      } else if (width < height) {
        resolve({ width, height, orientation: 'portrait' }); // แนวตั้ง
      } else {
        resolve({ width, height, orientation: 'square' }); // สี่เหลี่ยมจัตุรัส
      }
    };

    img.onerror = reject;
    img.src = imageUrl;

    // ป้องกัน CORS (ถ้าโหลดรูปจาก domain อื่นที่ไม่เปิด CORS)
    img.crossOrigin = 'anonymous';
  })
);

export const isIOS = (): boolean => /iphone|ipad|ipod/i.test(navigator.userAgent);
export const isAndroid = (): boolean => /android/i.test(navigator.userAgent);
export const isMobile = (): boolean => /android|iphone|ipad|ipod/i.test(navigator.userAgent);

export const shareImageFromBase64 = async (fileResponse: { name: string; file: string }) => {
  if (!fileResponse?.file) return;

  const { name, file } = fileResponse;
  const blob = base64ToBlob(file, 'image/jpeg');
  const filename = name || `image-${Date.now()}.jpg`;
  const fileObj = new File([blob], filename, { type: 'image/jpeg' });

  await navigator.share({
    files: [fileObj],
    title: 'แชร์รูปภาพ',
    text: 'แชร์หรือบันทึกรูปภาพนี้',
  });
};

export const base64ToBlob = (base64: string, mime = 'image/png'): Blob => {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
};

export const downloadImageFromBase64New = async (fileResponse: { name: string; file: string }) => {
  if (!fileResponse?.file) return;

  const { name, file } = fileResponse;
  const blob = base64ToBlob(file, 'image/jpeg');
  const filename = name || `image-${Date.now()}.jpg`;
  const blobUrl = URL.createObjectURL(blob);

  if (isIOS() && navigator.canShare && navigator.canShare({ files: [new File([blob], filename)] })) {
    // iOS: เปิดแท็บใหม่
    const fileObj = new File([blob], filename, { type: 'image/jpeg' });

    await navigator.share({
      files: [fileObj],
      title: 'แชร์รูปภาพ',
      text: '',
    });

  } else {
    // อื่นๆ: สร้างลิงก์ดาวน์โหลด
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  URL.revokeObjectURL(blobUrl);
};


export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string); // ผลลัพธ์จะเป็น base64 string
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export const urlToBase64 = async (imageUrl: string): Promise<string> => {
  const response = await fetch(imageUrl, {
    method: "GET",
    headers: {
      "Accept": "image/*",
      "Cache-Control": "no-cache",
      "client-module": "administrator",
    }
  });
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string); // base64 string
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export function removeDataPrefix(base64String: string) {
  // แยก string ที่ตำแหน่ง ',' และคืนค่าส่วนที่สอง
  const parts = base64String.split(',');
  return parts.length > 1 ? parts[1] : base64String;
}