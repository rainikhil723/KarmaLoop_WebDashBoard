/**
 * DevAuthContext.jsx
 * -------------------------------------------
 * PURPOSE:
 * Controls access to developer-only features like
 * "Purge Logs", "Synthesize Data" (Dashboard), and
 * "Developer Access" panel (Settings > System Config).
 *
 * HOW IT WORKS:
 * - By default, `isDevMode` is false → dev features are hidden.
 * - User enters the correct password in Settings → `isDevMode` becomes true.
 * - Dev mode persists in sessionStorage so it survives page navigations
 *   but resets when the browser tab is closed (security).
 * - Call `lockDevMode()` to manually re-lock dev features.
 *
 * USAGE:
 *   import { useDevAuth } from '../context/DevAuthContext';
 *   const { isDevMode, unlockDevMode, lockDevMode } = useDevAuth();
 * -------------------------------------------
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const DevAuthContext = createContext();

// ─── The developer password (hashed comparison would be better for production) ───
const DEV_PASSWORD = "Karma9711152@";

export const DevAuthProvider = ({ children }) => {
  // Check sessionStorage on mount so dev mode survives page refresh (but not tab close)
  const [isDevMode, setIsDevMode] = useState(() => {
    return sessionStorage.getItem('karmaloop_dev_mode') === 'true';
  });

  // Keep sessionStorage in sync whenever isDevMode changes
  useEffect(() => {
    if (isDevMode) {
      sessionStorage.setItem('karmaloop_dev_mode', 'true');
    } else {
      sessionStorage.removeItem('karmaloop_dev_mode');
    }
  }, [isDevMode]);

  /**
   * unlockDevMode(password)
   * @param {string} password - The password the user typed
   * @returns {boolean} - true if password was correct, false otherwise
   */
  const unlockDevMode = (password) => {
    if (password === DEV_PASSWORD) {
      setIsDevMode(true);
      return true; // ✅ Correct password
    }
    return false; // ❌ Wrong password
  };

  /**
   * lockDevMode()
   * Re-locks developer features (e.g. user clicks "Lock" button)
   */
  const lockDevMode = () => {
    setIsDevMode(false);
  };

  return (
    <DevAuthContext.Provider value={{ isDevMode, unlockDevMode, lockDevMode }}>
      {children}
    </DevAuthContext.Provider>
  );
};

/**
 * Hook to consume dev auth state anywhere in the app
 * @returns {{ isDevMode: boolean, unlockDevMode: (pwd: string) => boolean, lockDevMode: () => void }}
 */
export const useDevAuth = () => {
  const context = useContext(DevAuthContext);
  if (!context) {
    throw new Error('useDevAuth must be used within a DevAuthProvider');
  }
  return context;
};
