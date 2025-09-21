"use client";
"use client";
import React from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';



const hapticsTest = async () => {
    try {
        // Impact (light, medium, heavy)
        await Haptics.impact({ style: ImpactStyle.Light });
        await Haptics.impact({ style: ImpactStyle.Medium });
        await Haptics.impact({ style: ImpactStyle.Heavy });

        // Notification (success, warning, error)
        await Haptics.notification({ type: NotificationType.Success });
        await Haptics.notification({ type: NotificationType.Warning });
        await Haptics.notification({ type: NotificationType.Error });

        // Vibrate (custom duration)
        await Haptics.vibrate({ duration: 300 });

        // Selection
        await Haptics.selectionStart();
        await Haptics.selectionChanged();
        await Haptics.selectionEnd();
    } catch (error) {
        console.error('Haptics error:', error);
    }
};

export default function DebugPage() {
    return (
        <main className="w-full flex flex-col items-center min-h-screen p-6 bg-gray-900 text-white">
            <h1 className='mt-16'>Debug Haptics</h1>
            <button onClick={hapticsTest} className="py-2 px-6 bg-pink-500 hover:bg-pink-600 rounded-lg text-white mt-2">Vibrations</button>
        </main>
    );
}
