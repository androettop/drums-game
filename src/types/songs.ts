export type RecordingMetadata = {
    title: string,
    description: string,
    coverImagePath: string,
    artist: string,
    creator: string,
    length: number,
    complexity: number
}

export type AudioFileData = {
    songTracks: string[],
    drumTracks: string[],
    calibrationOffset: number
}

export type InstrumentData = {
    class: string,
    location: [number, number, number]
}

export type EventData = {
    name: string,
    vel: number,
    loc: number,
    time: number
}

export type BPMEventData = {
    bpm: number,
    time: number
}

export type SongData = {
    version: number,
    recordingMetadata: RecordingMetadata,
    audioFileData: AudioFileData,
    instruments: InstrumentData[],
    events: EventData[],
    bpmEvents: BPMEventData[],
    // Campos adicionales para manejar los archivos (no existen en el JSON original)
    folderName?: string,
    folderHandle?: FileSystemDirectoryHandle
}