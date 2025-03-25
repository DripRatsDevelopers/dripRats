import { get, ref, set } from "firebase/database";
import { realtimeDB } from "./firebase";

/**
 * Fetch data from cache in Realtime Database
 * @param path - The path in Realtime Database
 * @param expiry - Time in milliseconds for cache expiration
 */
export async function getCache<T>(
  path: string,
  expiry: number
): Promise<T | null> {
  try {
    const cacheRef = ref(realtimeDB, path);
    const snapshot = await get(cacheRef);

    if (!snapshot.exists()) return null;

    const cachedData = snapshot.val();
    const isCacheValid = Date.now() - cachedData.timestamp < expiry;

    return isCacheValid ? cachedData.data : null;
  } catch (error) {
    console.error("Error fetching from cache:", error);
    return null;
  }
}

/**
 * Update data in Realtime Database cache
 * @param path - The path in Realtime Database
 * @param data - Data to be cached
 */
export async function setCache<T>(path: string, data: T): Promise<void> {
  try {
    const cacheRef = ref(realtimeDB, path);
    await set(cacheRef, { data, timestamp: Date.now() });
    console.log("✅ Cache updated at:", path);
  } catch (error) {
    console.error("Error updating cache:", error);
  }
}
