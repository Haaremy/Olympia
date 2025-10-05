"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "./cropImage";//#endregion
import ShareButton from "./shareButton";
import { Capacitor } from "@capacitor/core";
import { useTranslation } from "next-i18next";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Button } from "@/cooperateDesign";


type TeamSelfieUploaderProps = {
  teamUname?: string; // optional username for fetching server image
};

export default function TeamSelfieUploader({ teamUname }: TeamSelfieUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [croppedImage, setCroppedImage] = useState<string | undefined>(undefined);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  
  useEffect(() => {
    if (!teamUname) return;

    const fetchImage = async () => {
      try {
        const res = await fetch(`https://olympia.haaremy.de/uploads/${teamUname.toLowerCase()}.jpg?t=${Date.now()}`);
        if (res.ok) {
          // Create a blob URL to use in img src
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        } else {
          console.error("Image not found");
        }
      } catch (err) {
        console.error("Failed to fetch image:", err);
      }
    };

    fetchImage();
  }, [teamUname]);

  const handleTakePhoto = async () => {
  try {
    const permission = await Camera.requestPermissions();
    if (permission.camera !== 'granted') {
      return;
    }
    alert('Kamera-Zugriff erlaubt. Öffne Kamera.');

    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    if (photo?.dataUrl) {
      setImageSrc(photo.dataUrl);
      setShowCropper(true);
    }
  } catch (error) {
    console.error('Camera error:', error);
  }
};



  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const MAX_FILE_SIZE_MB = 5;
    if (!file) return;
     const fileSizeMB = file.size / (1024 * 1024); // Byte → MB
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    alert(`Datei zu groß! Maximal ${MAX_FILE_SIZE_MB} MB erlaubt.`);
    return;
  }
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };


 const handleCropSave = async () => {
  if (imageSrc && croppedAreaPixels) {
    try {
      // Get cropped image as data URL
      const croppedDataUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedDataUrl);
      setShowCropper(false);

      // Convert data URL to blob
      const res = await fetch(croppedDataUrl);
      const blob = await res.blob();

      // Create FormData to send to server
      const formData = new FormData();
      formData.append("file", blob, "team-selfie.png");

      // POST to API route
      const uploadRes = await fetch("/api/image/upload", { 
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      console.log("Image uploaded successfully!");
    } catch (err) {
      console.error("Error cropping or uploading image:", err);
    }
  }
};


  const imageLoader = ({ src }: { src: string }) => {
  return src;
}

  return (
    <div className="mt-8 mb-8">
      <h2 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-2 text-center">
        Share your Team Selfie #{teamUname}
      </h2>
      <div className="flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {croppedImage ? (
          <img
            src={croppedImage}
            alt="Team Selfie Preview"
            className="rounded-lg shadow-lg mb-4 object-cover w-44 h-44 cursor-pointer"
            onClick={() => setShowModal(true)}
          />
        ) : (
          <Image
            src={imageUrl || "/images/teamplaceholder.svg"}
            loader={imageLoader}
            alt="Placeholder"
            width={180}
            height={180}
            className={"rounded-lg shadow-lg mb-4 object-cover" + (imageUrl ? "" : " dark:invert invert-0")}
            unoptimized
          />
        )}

        {(croppedImage || imageUrl) && (
          <div className="flex gap-3 mt-4">
            {Capacitor.getPlatform() === 'android' && <ShareButton teamUname={teamUname}/>}
            <Button onClick={() => setShowModal(true)}>👀</Button>
          </div>
        )}
        
        {/* Unsichtbares File Input mit Label */}
        <div className="flex flex-col items-center mt-4">
          <label
            htmlFor="file-upload"
          >
            <Button className="pointer-events-none">
            {t("chooseImage")}
            </Button>
          </label>
          {/* Unsichtbares Input für die Dateiauswahl */}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {Capacitor.getPlatform() === 'android' && (
                    <Button
                      className="mt-2"
                      onClick={handleTakePhoto}
                    >
                      {t("takePhoto")}
                    </Button>
                  )}
        </div>
        

        
      </div>

      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md h-96 bg-gray-900 rounded-lg overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={() => setShowCropper(false)}>Cancel</Button>
            <Button onClick={handleCropSave}>{t("save")}</Button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          {croppedImage ? (
            <Image
              src={croppedImage}
              loader={imageLoader}
              alt="Full Size Team Selfie"
              className="rounded-xl shadow-lg max-h-[90%] max-w-[90%] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              loader={imageLoader}
              alt="Full Size Team Selfie"
              className="rounded-xl shadow-lg max-h-[90%] max-w-[90%] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Image
              src={"/images/teamplaceholder.svg"}
              loader={imageLoader}
              alt="Full Size Team Selfie"
              className="rounded-xl shadow-lg max-h-[90%] max-w-[90%] object-contain dark:invert invert-0"
              onClick={(e) => e.stopPropagation()}
              width={180}
              height={180}
            />
          )}
        </div>
      )}
    </div>
  );
}
