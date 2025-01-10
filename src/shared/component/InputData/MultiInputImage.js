import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import getCroppedImg from '../../function/cropImageHelper'; // Thêm file helper để xử lý crop ảnh
import GetImageFireBase from '../../function/GetImageFireBase';

import swal from 'sweetalert';

const GridImage = styled.div`
 width: 100%;
min-height:10rem;
gap: 0.5rem;
  background-color: rgba(128, 128, 128, 0.106);
  display: grid;
  padding:0.5rem;
   align-items: center;
 
`;

// Các component styled
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
   background-color:white;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
   width: 100%;
  aspect-radio:1/1;
 
  justify-content: center;
  align-items: center;

  p {
    font-size: var(--fz_title);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  display: flex;

  width: 100%;
 

`;

const ImagePreview = styled.img`
   display: block;
  width: 100%;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
   aspect-radio:1/1;
`;

const CloseButton = styled.p`
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  // background: var(--shadow-black);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.8rem;
  width: 1rem;
  height: 1rem;
      display: flex;
          justify-content: center;
          align-items: center;
          i{
          font-size: 0.8rem;
           color: var(--shadow-black);
           transition: 0.3s ease;
          }
           i:hover{
            animation: shake 1s infinite;
            color: orange;
           }
            @keyframes shake {
          0% {
            transform: rotate(10deg)scale(1.1);
          }
          50% {
            transform: rotate(0deg)scale(1.1);
          }
          100% {
            transform: rotate(-10deg)scale(1.1);
          }
        }
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



export default function MultiInputImageCrop({
  defaultImage,
  GirdColumn,
  Textlabel,
  isRequire,
  err,
  fnChange,
  aspectWH
}) {
  const MAX_IMAGES = 5;
  var defaultIMG = defaultImage?.split("; ");
  defaultIMG?.pop();

  const [imgDefault, setImgDefault] = useState(defaultIMG || []);
  const [imageQueue, setImageQueue] = useState([]); // Queue for images to crop
  const [imageSrc, setImageSrc] = useState(null); // Current image being cropped
  const [croppedImages, setCroppedImages] = useState([]); // List of cropped images
  const [croppedFiles, setCroppedFiles] = useState([]); // List of cropped files
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      // Count total images
      const totalImages = imgDefault.length + croppedImages.length + acceptedFiles.length;
      if (totalImages > MAX_IMAGES) {
        // alert(`You can only upload up to ${MAX_IMAGES} images.`);
        swal("Accept Image", `You can only upload up to ${MAX_IMAGES} images`, "error");
        return;
      }

      const newImages = acceptedFiles.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImages).then((images) => {
        setImageQueue((prevQueue) => [...prevQueue, ...images]);
        if (!cropping) {
          setImageSrc(images[0]);
          setCropping(true);
        }
      });
    },
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
      const response = await fetch(croppedImg);
      const blob = await response.blob();
      const file = new File([blob], 'croppedImage.png', { type: 'image/png' });

      setCroppedImages((prev) => [...prev, croppedImg]);
      setCroppedFiles((prev) => [...prev, file]);

      fnChange([...croppedFiles, file], imgDefault);

      const remainingQueue = imageQueue.slice(1);
      setImageQueue(remainingQueue);

      if (remainingQueue.length > 0) {
        setImageSrc(remainingQueue[0]);
      } else {
        setCropping(false);
        setImageSrc(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = croppedImages.filter((_, i) => i !== index);
    const updatedFiles = croppedFiles.filter((_, i) => i !== index);
    setCroppedImages(updatedImages);
    setCroppedFiles(updatedFiles);
    fnChange(updatedFiles, imgDefault);
  };

  const handleRemoveDefaultImage = (index) => {
    const updatedImages = imgDefault.filter((_, i) => i !== index);
    setImgDefault(updatedImages);
    fnChange(croppedFiles, updatedImages);
  };

  return (
    <div style={{ width: '100%', paddingBottom: '1.5rem' }}>
      <Label>
        {Textlabel}
        {isRequire && <span>*</span>}
      </Label>
      <GridImage style={{ gridTemplateColumns: `repeat(${GirdColumn}, 1fr)` }}>
        {!cropping && !(imgDefault.length + croppedImages.length === MAX_IMAGES) && (
          <Container {...getRootProps()}>
            <input {...getInputProps()} />
            <p>+</p>
          </Container>
        )}
        {imgDefault &&
          imgDefault.map((image, index) => (
            <ImageWrapper key={index}>
              <ImagePreview
                src={GetImageFireBase(image)}
                style={{ aspectRatio: aspectWH }}
                alt="Preview"
              />
              <CloseButton onClick={() => handleRemoveDefaultImage(index)}>
                <i className="fa-regular fa-trash-can"></i>
              </CloseButton>
            </ImageWrapper>
          ))}
        {croppedImages.map((image, index) => (
          <ImageWrapper key={index}>
            <ImagePreview src={image} style={{ aspectRatio: aspectWH }} alt="Preview" />
            <CloseButton onClick={() => handleRemoveImage(index)}>
              <i className="fa-regular fa-trash-can"></i>
            </CloseButton>
          </ImageWrapper>
        ))}
      </GridImage>
      {cropping && (
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
      )}
      <Error>{err && err !== '' ? '* ' + err : ''}</Error>
    </div>
  );
}
