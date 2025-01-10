import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import styled from 'styled-components';
import getCroppedImg from '../../function/cropImageHelper'; // Hàm helper xử lý crop ảnh
import GetImageFireBase from '../../function/GetImageFireBase';

// Styled components
const FullScreenCropContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const CropContainer = styled.div`
  position: relative;
  width: 80%;
  height: 80%;
  background: #333;
`;

const CloseButton = styled.div`
 
  position: absolute;
  top: 3px;
  right: 3px;
display:flex;

  width:1.5rem;
  height:1.5rem;
  background-color: #2684ff;
  color: white;
   justify-content: center;
      align-items: center;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

const Button = styled.div`
  margin-top: 10px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 10px 20px;
  background-color: #2684ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ImagePreview = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
  position: absolute;
  inset: 0;
`;

const UploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const UploadButton = styled.label`
  background-color: #2684ff;
  color: white;
  padding: 5px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
font-size:var(--fz_smallmax);
  input {
    display: none;
  }
`;
const Error = styled.span`
   color: red;
  font-size: var(--fz_smallmax);
`;

export default function InputImageAvatar({ defaultImg, err, fnChange, aspectWH = 1 }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(
    defaultImg ? GetImageFireBase(defaultImg) : null
  );
  useEffect(() => {
    setCroppedImage(GetImageFireBase(defaultImg))
  }, [defaultImg]);
  const [croppedFile, setCroppedFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Fetch và xử lý ảnh từ base64 hoặc URL
      const response = await fetch(croppedImg);
      if (!response.ok) throw new Error('Failed to fetch cropped image');

      const blob = await response.blob();
      const file = new File([blob], 'croppedImage.png', { type: 'image/png' });

      setCroppedImage(croppedImg); // Hiển thị ảnh đã cắt
      setCroppedFile(file); // Lưu file để gửi lên backend
      setCropping(false); // Kết thúc quá trình crop
      setImageSrc(null); // Xóa ảnh gốc sau khi crop xong
      fnChange(file, croppedImg); // Gọi hàm callback truyền file và URL
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveImage = () => {
    setCroppedImage(null);
    setCroppedFile(null);
    fnChange(null, null); // Reset callback khi xóa ảnh
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setCropping(true); // Bắt đầu quá trình crop
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <UploadWrapper>
      <Error>{err && err !== '' ? '* ' + err : ''}</Error>
      <div style={{ border: err && err !== '' ? "1px solid red" : "none", position: 'relative', width: "100%", maxWidth: '150px', maxHeight: "150px", overflow: "hidden", aspectRatio: '1/1', backgroundColor: 'var(--cl_1)' }}>
        {croppedImage ? (
          <>
            <ImagePreview src={croppedImage} alt="Preview" style={{ width: "100%" }} />

            {/* <CloseButton onClick={handleRemoveImage}>x</CloseButton> */}
          </>
        ) : (
          <div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>No avatar</div>
        )}
      </div>
      {cropping ? (
        <FullScreenCropContainer>
          <CropContainer>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectWH}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <Button onClick={handleCrop}>Save</Button>
          </CropContainer>
        </FullScreenCropContainer>
      ) : (
        <UploadButton>
          Choose File
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </UploadButton>
      )}

    </UploadWrapper>
  );
}
