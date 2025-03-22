import { v4 as uuid } from "uuid";
import { SongData } from "../types/songs";

/**
 * Permite al usuario seleccionar una carpeta de canciones
 */
export const selectSongsFolder = async (): Promise<FileSystemDirectoryHandle | null> => {
  try {
    const directoryHandle = await window.showDirectoryPicker();
    return directoryHandle;
  } catch (error) {
    console.error("Error al seleccionar la carpeta:", error);
    return null;
  }
};

/**
 * Encuentra todos los archivos JSON en una carpeta y sus subcarpetas
 */
export const findJsonFiles = async (directoryHandle: FileSystemDirectoryHandle): Promise<Map<string, { file: FileSystemFileHandle, parentDir: FileSystemDirectoryHandle, path: string }>> => {
  const jsonFiles = new Map<string, { file: FileSystemFileHandle, parentDir: FileSystemDirectoryHandle, path: string }>();
  
  // Función recursiva para explorar carpetas
  async function exploreDirectory(handle: FileSystemDirectoryHandle, path: string) {
    for await (const [name, entry] of handle.entries()) {
      const newPath = path ? `${path}/${name}` : name;
      
      if (entry.kind === 'directory') {
        await exploreDirectory(entry, newPath);
      } else if (entry.kind === 'file' && name.endsWith('.rlrr')) {
        jsonFiles.set(newPath, { 
          file: entry, 
          parentDir: handle,
          path: newPath
        });
      }
    }
  }
  
  await exploreDirectory(directoryHandle, "");
  return jsonFiles;
};

/**
 * Lee y parsea un archivo JSON
 */
export const readJsonFile = async (fileHandle: FileSystemFileHandle): Promise<any> => {
  const file = await fileHandle.getFile();
  const contents = await file.text();
  return JSON.parse(contents);
};

/**
 * Valida si los datos corresponden al tipo SongData
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateSongData = (data: any): data is SongData => {
  return (
    data &&
    typeof data.version === 'number' &&
    data.recordingMetadata &&
    data.audioFileData &&
    Array.isArray(data.instruments) &&
    Array.isArray(data.events) &&
    Array.isArray(data.bpmEvents)
  );
};

/* Funcion para cargar todas las canciones y obtener un array de SongData */
export const loadAllSongs = async (): Promise<SongData[]> => {
  // Seleccionar carpeta de canciones
  const folderHandle = await selectSongsFolder();
  if (!folderHandle) return [];
  
  // Buscar archivos JSON en la carpeta
  const jsonFiles = await findJsonFiles(folderHandle);
  if (jsonFiles.size === 0) {
    console.error("No se encontraron archivos JSON en la carpeta seleccionada");
    return [];
  }
  
  // Cargar y validar cada archivo JSON
  const songs = [];
  for (const jsonFileEntry of jsonFiles.values()) {
    const { file: jsonFile } = jsonFileEntry;
    
    try {
      // Leer y parsear el archivo
      const songData = await readJsonFile(jsonFile);
      
      // Validar que coincida con el tipo SongData
      if (validateSongData(songData)) {
        // Añadir información sobre la carpeta de la canción
        const pathParts = jsonFileEntry.path.split('/');
        const folderName = pathParts.length > 1 ? pathParts[pathParts.length - 2] : '';
        
        songs.push({
          ...songData,
          id: uuid(),
          folderName,
          folderHandle: jsonFileEntry.parentDir
        });
      } else {
        console.error("El archivo no contiene datos de canción válidos");
      }
    } catch (error) {
      console.error("Error al leer el archivo de canción:", error);
    }
  }
  
  return songs;
};