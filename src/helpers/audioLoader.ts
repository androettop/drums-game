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
export const releaseAudioUrl = (url: string | null): void => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};
