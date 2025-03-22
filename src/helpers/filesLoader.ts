import { SongData } from "../types/songs";

/**
 * Loads an audio file from the song folder
 */
export const loadAudioFile = async (
  song: SongData,
  trackFilename: string
): Promise<string | null> => {
  if (!song.folderHandle) {
    console.error("No access to the song folder");
    return null;
  }

  try {
    // Try to get the file directly from the song folder
    let fileHandle: FileSystemFileHandle;

    try {
      fileHandle = await song.folderHandle.getFileHandle(trackFilename);
    } catch {
      // If the file is not directly in the song folder,
      // look in a common "audio" subfolder
      try {
        const audioFolder = await song.folderHandle.getDirectoryHandle("audio");
        fileHandle = await audioFolder.getFileHandle(trackFilename);
      } catch (innerError) {
        console.error(`File ${trackFilename} not found`, innerError);
        return null;
      }
    }

    // Convert the file to a URL object
    const file = await fileHandle.getFile();
    return URL.createObjectURL(file);
  } catch (error) {
    console.error(`Error loading audio file ${trackFilename}:`, error);
    return null;
  }
};

/**
 * Releases the resources used by a URL object
 */
export const releaseFileUrl = (url: string | null): void => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Loads an image file from the song folder
 */
export const loadImageFile = async (
  song: SongData,
  imageFilename: string
): Promise<string | null> => {
  if (!song.folderHandle) {
    console.error("No access to song folder");
    return null;
  }

  try {
    // Try to get the file directly from the song folder
    let fileHandle: FileSystemFileHandle;

    try {
      fileHandle = await song.folderHandle.getFileHandle(imageFilename);
    } catch {
      // If not found, try in an "images" or "img" subfolder
      try {
        const imgFolder = await song.folderHandle.getDirectoryHandle("images");
        fileHandle = await imgFolder.getFileHandle(imageFilename);
      } catch {
        // Try another common folder name
        try {
          const imgFolder = await song.folderHandle.getDirectoryHandle("img");
          fileHandle = await imgFolder.getFileHandle(imageFilename);
        } catch {
          console.error(`Image file ${imageFilename} not found`);
          return null;
        }
      }
    }

    // Convert the file to a URL object
    const file = await fileHandle.getFile();
    return URL.createObjectURL(file);
  } catch (error) {
    console.error(`Error loading image file ${imageFilename}:`, error);
    return null;
  }
};
