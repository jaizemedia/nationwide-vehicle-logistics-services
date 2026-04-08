"use client";
import { useState } from "react";

export function EnableNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subscribe() {
    setError(null);
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setError('Push notifications not supported');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      setError('Permission denied');
      return;
    }
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'BAs3mf9YuDuG3DwiLDIJL3QthQwVscDW6AKB0bwe5Hp_cbFBvuVqVgEUqesRZQFCSL_jAPhm5ED6oEQ-kVlFIMA',
    });
    // Send sub to your backend
    await fetch('/api/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub),
    });
    setEnabled(true);
  }

  return (
    <button onClick={subscribe} disabled={enabled} style={{marginLeft: 8}}>
      {enabled ? 'Notifications Enabled' : 'Enable Notifications'}
      {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
    </button>
  );
}
