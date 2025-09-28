// components/ShareButton.tsx
'use client';

import { Share } from '@capacitor/share';

export default function ShareButton() {
  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Check this out!',
        text: 'This is some awesome content from my app.',
        url: 'https://olympia.haaremy.de',
        dialogTitle: 'Share with your friends',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <button onClick={handleShare} className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700">
      Share
    </button>
  );
}
