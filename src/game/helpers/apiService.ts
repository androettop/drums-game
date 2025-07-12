import { APISongsResponse, APISearchResponse, APIConfig } from '../../types/songs';

const DEFAULT_API_URL = "http://localhost:3000";
const API_CONFIG_KEY = "songs_api_config";

/**
 * Gets the API configuration from localStorage
 */
export const getAPIConfig = (): APIConfig => {
  const saved = localStorage.getItem(API_CONFIG_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Error parsing API config:", error);
    }
  }
  return { baseUrl: DEFAULT_API_URL };
};

/**
 * Saves the API configuration to localStorage
 */
export const saveAPIConfig = (config: APIConfig): void => {
  localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
};

/**
 * Fetches songs from the API with pagination
 */
export const fetchSongs = async (page: number = 1, limit: number = 20): Promise<APISongsResponse> => {
  const config = getAPIConfig();
  const url = new URL(`${config.baseUrl}/songs`);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("limit", limit.toString());

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as APISongsResponse;
  } catch (error) {
    console.error("Error fetching songs:", error);
    throw new Error("Failed to fetch songs from API");
  }
};

/**
 * Searches songs in the API
 */
export const searchSongs = async (
  query: string, 
  page: number = 1, 
  limit: number = 20
): Promise<APISearchResponse> => {
  const config = getAPIConfig();
  const url = new URL(`${config.baseUrl}/songs/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("limit", limit.toString());

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as APISearchResponse;
  } catch (error) {
    console.error("Error searching songs:", error);
    throw new Error("Failed to search songs in API");
  }
};

/**
 * Gets the download URL for a song by its ID
 */
export const getSongDownloadUrl = (songId: string): string => {
  return `https://paradb.net/api/maps/${songId}/download`;
};

/**
 * Downloads a song zip file using the song ID
 */
export const downloadSongZip = async (songId: string): Promise<Blob> => {
  try {
    const downloadUrl = getSongDownloadUrl(songId);
    const response = await fetch(downloadUrl, {
      method: 'GET',
      redirect: 'follow', // Follow redirects automatically
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Verify it's a valid ZIP file
    if (blob.size === 0) {
      throw new Error("Downloaded file is empty");
    }
    
    return blob;
  } catch (error) {
    console.error("Error downloading song zip:", error);
    throw new Error("Failed to download song");
  }
};

/**
 * Validates if the API URL is reachable
 */
export const validateAPIUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(`${url}/health`);
    return response.ok;
  } catch (error) {
    console.error("API validation failed:", error);
    return false;
  }
};
