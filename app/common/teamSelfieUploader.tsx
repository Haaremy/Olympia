"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "./cropImage";


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
const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  
  useEffect(() => {
    if (!teamUname) return;

    const fetchImage = async () => {
      try {
        const res = await fetch(`/uploads/${teamUname}.jpg`);
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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


  const handleShare = async () => {
    if (navigator.share && croppedImage) {
      const res = await fetch(croppedImage);
      const blob = await res.blob();
      const file = new File([blob], "team-selfie.png", { type: "image/png" });
      try {
        await navigator.share({ title: "Our Team Selfie", files: [file] });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  return (
    <div className="mt-8 mb-8">
      <h2 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-2 text-center">
        Share your Team Selfie #{teamUname}
      </h2>
      <div className="flex flex-col items-center">
        {croppedImage ? (
          <img
            src={croppedImage}
            alt="Team Selfie Preview"
            className="rounded-lg shadow-lg mb-4 object-cover w-44 h-44 cursor-pointer"
            onClick={() => setShowModal(true)}
          />
        ) : (
          <Image
            src={imageUrl || "/images/teamplaceholder.png"}
            alt="Placeholder"
            width={180}
            height={180}
            className="rounded-lg shadow-lg mb-4 object-cover"
            unoptimized
          />
        )}

        {croppedImage && (
          <div className="flex gap-3 mt-4">
            <button onClick={handleShare} className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700">Teilen</button>
            <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700">👀</button>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 dark:file:bg-gray-700 dark:file:text-pink-300"
        />

        
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
            <button onClick={() => setShowCropper(false)} className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600">Cancel</button>
            <button onClick={handleCropSave} className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700">Save</button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          {croppedImage && (
            <img
              src={croppedImage}
              alt="Full Size Team Selfie"
              className="rounded-xl shadow-lg max-h-[90%] max-w-[90%] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  );
}
