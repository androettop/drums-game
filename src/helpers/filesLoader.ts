import { SongData } from "../types/songs";

/**
 * Carga un archivo de audio desde la carpeta de la canción
 */
export const loadAudioFile = async (song: SongData, trackFilename: string): Promise<string | null> => {
  if (!song.folderHandle) {
    console.error("No hay acceso a la carpeta de la canción");
    return null;
  }

  try {
    // Intentar obtener el archivo directamente desde la carpeta de la canción
    let fileHandle: FileSystemFileHandle;
    
    try {
      fileHandle = await song.folderHandle.getFileHandle(trackFilename);
    } catch (error) {
      // Si el archivo no está directamente en la carpeta de la canción, 
      // buscamos en una subcarpeta "audio" que suele ser común
      try {
        const audioFolder = await song.folderHandle.getDirectoryHandle('audio');
        fileHandle = await audioFolder.getFileHandle(trackFilename);
      } catch (innerError) {
        console.error(`No se encontró el archivo ${trackFilename}`, innerError);
        return null;
      }
    }

    // Convertir el archivo a un objeto URL
    const file = await fileHandle.getFile();
    return URL.createObjectURL(file);
    
  } catch (error) {
    console.error(`Error al cargar el archivo de audio ${trackFilename}:`, error);
    return null;
  }
};

/**
 * Libera los recursos utilizados por una URL de objeto
 */
export const releaseFileUrl = (url: string | null): void => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};


/**
 * Loads an image file from the song folder
 */
export const loadImageFile = async (song: SongData, imageFilename: string): Promise<string | null> => {
  if (!song.folderHandle) {
    console.error("No access to song folder");
    return null;
  }

  try {
    // Try to get the file directly from the song folder
    let fileHandle: FileSystemFileHandle;
    
    try {
      fileHandle = await song.folderHandle.getFileHandle(imageFilename);
    } catch (error) {
      // If not found, try in an "images" or "img" subfolder
      try {
        const imgFolder = await song.folderHandle.getDirectoryHandle('images');
        fileHandle = await imgFolder.getFileHandle(imageFilename);
      } catch (innerError) {
        // Try another common folder name
        try {
          const imgFolder = await song.folderHandle.getDirectoryHandle('img');
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