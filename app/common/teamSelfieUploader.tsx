"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "./cropImage"; 
import { Capacitor } from "@capacitor/core";

// TeamSelfieUploader Props
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
  const [fileName, setFileName] = useState<string | null>(null); // Dateiname für die Anzeige

  // Capacitor Platform Check
  const isAndroid = Capacitor.getPlatform() === "android"; 

  // Cropper Callback
  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
    if (!teamUname) return;

    const fetchImage = async () => {
      try {
        const res = await fetch(`/uploads/${teamUname.toLowerCase()}.jpg`);
        if (res.ok) {
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

  // Handle Image Change
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    setFileName(file?.name || null); // Setzt den Dateinamen
  };

  // Handle Image Crop Save
  const handleCropSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedDataUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
        setCroppedImage(croppedDataUrl);
        setShowCropper(false);

        const res = await fetch(croppedDataUrl);
        const blob = await res.blob();
        const formData = new FormData();
        formData.append("file", blob, "team-selfie.png");

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

  // Share Button Funktion
  const ShareButton = () => {
    const shareImage = async () => {
      try {
        if (navigator.share) {
          // Wenn der Browser Sharing unterstützt
          await navigator.share({
            title: "Team Selfie",
            text: "Schau dir unser Team-Selfie an!",
            url: croppedImage || imageUrl || "/images/teamplaceholder.png",
          });
        } else {
          // Wenn Sharing nicht unterstützt wird (z.B. auf Web)
          alert("Sharing is not supported on this platform.");
        }
      } catch (err) {
        console.error("Error sharing:", err);
        alert("Sharing failed.");
      }
    };

    return isAndroid ? (
      <button onClick={shareImage} className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
        {/* Einfaches SVG-Icon für Teilen */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H7m7-4h-7" />
        </svg>
        Teilen
      </button>
    ) : (
      <button onClick={shareImage} className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
        {/* Einfaches SVG-Icon für Teilen */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H7m7-4h-7" />
        </svg>
        Teilen
      </button>
    );
  };

  // Custom File Input
  const CustomFileInput = () => {
    return (
      <div className="mt-8 mb-8">
        <h2 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-2 text-center">
          Teile dein Team-Selfie #{teamUname}
        </h2>
        <div className="flex flex-col items-center">
          {croppedImage ? (
            <Image
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

          {(croppedImage || imageUrl) && (
            <div className="space-y-4">
              <div className="flex gap-3 mt-4">
                <label
                  htmlFor="file-upload"
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg cursor-pointer hover:bg-pink-700 transition flex items-center gap-2"
                  title="Wählen Sie ein Bild zum Hochladen"
                >
                  Wähle dein Bild aus
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {fileName && (
                <div className="text-sm text-gray-500 mt-2">
                  <strong>Ausgewählte Datei:</strong> {fileName}
                </div>
              )}
            </div>
          )}

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
                <button onClick={() => setShowCropper(false)} className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600">
                  Abbrechen
                </button>
                <button onClick={handleCropSave} className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700">
                  Speichern
                </button>
              </div>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
              {croppedImage && (
                <Image
                  src={croppedImage}
                  alt="Full Size Team Selfie"
                  className="rounded-xl shadow-lg max-h-[90%] max-w-[90%] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <CustomFileInput />
      <ShareButton />
    </div>
  );
}
