import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { useDropzone } from 'react-dropzone';
import styled, { css } from 'styled-components';
import getCroppedImg from '../../function/cropImageHelper'; // Thêm file helper để xử lý crop ảnh
import GetImageFireBase from '../../function/GetImageFireBase';

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
  z-index: 1000; /* Đảm bảo overlay luôn nằm trên cùng */
`;

const CropContainer = styled.div`
  position: relative;
  width: 80%;
  height: 80%;
  background: #333;
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
  z-index: 1100;
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  aspect-ratio: 1/1;
  border-width: 2px;
  border-radius: 2px;
  border-color: #eeeeee;
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  width: 10rem;
  height: 10rem;
  justify-content: center;
  align-items: center;

  p {
    font-size: var(--fz_title);
  }

  ${(props) =>
    props.$isDragReject &&
    css`
      border-color: red;
    `}

  ${(props) =>
    props.$isDragAccept &&
    css`
      border-color: green;
    `}

  ${(props) =>
    props.$isFocused &&
    css`
      border-color: blue;
    `}
`;

const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 10rem;
  height: 10rem;
`;

const ImagePreview = styled.img`
  display: block;
  width: 10rem;
  // height: 10rem;
  // aspect-ratio: 1/1;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  background: var(--shadow-black);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.8rem;
  width: 1rem;
  height: 1rem;
`;

const Label = styled.label`
  font-size: var(--fz_small);
  text-transform: uppercase;
  font-weight: 700;
  padding: 0.2rem 0;
  color: var(--gray);

  span {
    color: red;
  }
`;


const Error = styled.span`
   color: red;
  font-size: var(--fz_smallmax);
`;



export default function InputImageCrop({ defaultImg, Textlabel, isRequire, err, fnChange, aspectWH }) {
  const [imageSrc, setImageSrc] = useState(null);
  var img = defaultImg ? GetImageFireBase(defaultImg) : null
  const [croppedImage, setCroppedImage] = useState(img);
  const [croppedFile, setCroppedFile] = useState(null); // State để lưu file
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [effect, setEffect] = useState(true)
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImageSrc(reader.result);
          setCropping(true); // Bắt đầu quá trình crop
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Chuyển đổi từ base64 hoặc URL sang Blob
      const response = await fetch(croppedImg);
      const blob = await response.blob();

      // Tạo một file từ blob
      const file = new File([blob], 'croppedImage.png', { type: 'image/png' });

      setCroppedImage(croppedImg); // Hiển thị ảnh đã cắt
      setCroppedFile(file); // Lưu file để gửi lên backend
      setCropping(false); // Kết thúc quá trình crop
      setImageSrc(null); // Clear ảnh gốc sau khi crop xong
      setEffect(true)
    } catch (e) {
      console.error(e);
    }
  };
  const handleRemoveImage = () => {
    setCroppedImage(null);
    setCroppedFile(null); // Xóa file khi người dùng xóa ảnh
  };
  useEffect(() => {
    if (effect) {

      fnChange(croppedFile, croppedImage ? defaultImg : null)
    }
  }, [effect, croppedFile, croppedImage, defaultImg, fnChange]);

  return (
    <div style={{ paddingBottom: "1.5rem" }}>
      <Label>{Textlabel}{isRequire && (<span>*</span>)}</Label>
      <div className="container" style={{ width: '10rem', height: '10rem' }}>
        {!croppedImage && !cropping ? (
          <Container
            {...getRootProps({
              $isFocused: isFocused,
              $isDragAccept: isDragAccept,
              $isDragReject: isDragReject
            })}>
            <input {...getInputProps()} />
            <p>+</p>
          </Container>
        ) : cropping ? (
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
          <ImageWrapper>
            <ImagePreview src={croppedImage} style={{ aspectRatio: aspectWH }} alt="Preview" />
            <CloseButton onClick={handleRemoveImage}>x</CloseButton>
          </ImageWrapper>
        )}
      </div>
      <Error>{err && err !== '' ? '* ' + err : ''}</Error>
    </div>
  );
}
