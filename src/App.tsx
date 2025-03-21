import { useState } from "react";
import Highway from "./components/Highway/Highway";
import { loadFirstSong } from "./helpers/songLoader";
import { SongData } from "./types/songs";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";

function App() {
  const [song, setSong] = useState<SongData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectSongs = async () => {
    setLoading(true);
    setError(null);

    try {
      const songData = await loadFirstSong();
      if (songData) {
        setSong(songData);
      } else {
        setError("No se pudo cargar ninguna canción");
      }
    } catch (err) {
      setError(
        `Error al cargar las canciones: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSelectSongs} disabled={loading}>
        {loading ? "Cargando..." : "Seleccionar carpeta de canciones"}
      </button>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {song ? (
        <>
          <Highway song={song} />
          <AudioPlayer song={song} />
        </>
      ) : (
        <div>
          No hay canción seleccionada. Por favor, elija una carpeta de
          canciones.
        </div>
      )}
    </div>
  );
}

export default App;
