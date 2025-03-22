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
    time: string,
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
    // Additional fields to handle files (not present in the original JSON)
    id: string,
    folderName?: string,
    folderHandle?: FileSystemDirectoryHandle
}