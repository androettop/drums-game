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
export const findJsonFiles = async (directoryHandle: FileSystemDirectoryHandle): Promise<Map<string, FileSystemFileHandle>> => {
  const jsonFiles = new Map<string, FileSystemFileHandle>();
  
  // Función recursiva para explorar carpetas
  async function exploreDirectory(handle: FileSystemDirectoryHandle, path: string) {
    for await (const [name, entry] of handle.entries()) {
      const newPath = path ? `${path}/${name}` : name;
      
      if (entry.kind === 'directory') {
        await exploreDirectory(entry, newPath);
      } else if (entry.kind === 'file' && name.endsWith('.rlrr')) {
        jsonFiles.set(newPath, entry);
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

/**
 * Carga la primera canción que encuentre en la carpeta seleccionada
 */
export const loadFirstSong = async (): Promise<SongData | null> => {
  // Seleccionar carpeta de canciones
  const folderHandle = await selectSongsFolder();
  if (!folderHandle) return null;
  
  // Buscar archivos JSON en la carpeta
  const jsonFiles = await findJsonFiles(folderHandle);
  if (jsonFiles.size === 0) {
    console.error("No se encontraron archivos JSON en la carpeta seleccionada");
    return null;
  }
  
  // Tomar el primer archivo JSON encontrado
  const firstJsonFile = [...jsonFiles.values()][0];
  
  try {
    // Leer y parsear el archivo
    const songData = await readJsonFile(firstJsonFile);
    
    // Validar que coincida con el tipo SongData
    if (validateSongData(songData)) {
      return songData;
    } else {
      console.error("El archivo no contiene datos de canción válidos");
      return null;
    }
  } catch (error) {
    console.error("Error al leer el archivo de canción:", error);
    return null;
  }
};
