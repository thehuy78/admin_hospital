export default function getCroppedImg(imageSrc, cropAreaPixels) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = cropAreaPixels.width;
      canvas.height = cropAreaPixels.height;

      ctx.drawImage(
        image,
        cropAreaPixels.x,
        cropAreaPixels.y,
        cropAreaPixels.width,
        cropAreaPixels.height,
        0,
        0,
        cropAreaPixels.width,
        cropAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, 'image/jpeg');
    };
    image.onerror = () => {
      reject(new Error('Image load error'));
    };
  });
};
