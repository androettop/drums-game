import { Sound } from "excalibur";
import { loadFile } from "../../../helpers/filesLoader";
import { SongData } from "../../../types/songs";

export class MusicFile extends Sound {
    song: SongData;
    
    constructor(song:SongData, path: string) {
        super(path);
        this.song = song;
    }

    async load(): Promise<AudioBuffer> {
        console.log(this.path);
        const blobUrl = await loadFile(this.song, this.path);
        console.log(blobUrl);
        if (!blobUrl) {
            throw new Error(`Error loading music file ${this.path}`);
        }
        console.log(blobUrl);
        this.path = blobUrl;
        return super.load();
    }
}

