/**
 * Clear all browser caches and storage to prevent stale data on subsequent visits
 */
function clearBrowserCache() {
  // Clear localStorage
  localStorage.clear();

  // Clear sessionStorage
  sessionStorage.clear();

  // Clear IndexedDB if available
  if (typeof indexedDB !== "undefined") {
    indexedDB.databases?.().then((databases) => {
      databases.forEach((db) => {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      });
    });
  }

  // Clear Service Worker cache if available
  if ("caches" in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
}

export async function submitAssessment(
  payload: unknown
) {
  const response = await fetch(
    "https://submitassessmenteprom-d4ghcfctaugph7ge.uksouth-01.azurewebsites.net/api/SubmitAssessmentEprom",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Prevent caching of the response
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Submission failed");
  }

  // Clear all caches after successful submission
  clearBrowserCache();

  return await response.json();
}