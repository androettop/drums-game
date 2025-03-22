import { useState } from "react";
import GamePlayer from "./components/GamePlayer/GamePlayer";
import { SongData } from "./types/songs";
import { loadAllSongs } from "./helpers/songLoader";
import SmallCover from "./components/SmallCover/SmallCover";

function App() {
  const [selectedSong, setSelectedSong] = useState<SongData | null>(null);
  const [songList, setSongList] = useState<SongData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectSongs = async () => {
    setLoading(true);
    setError(null);

    loadAllSongs()
      .then((songs) => {
        setSongList(songs);
      })
      .catch((err) => {
        setError(
          `Error al cargar las canciones: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleExit = () => {
    setSelectedSong(null);
  };

  if (selectedSong) {
    return <GamePlayer song={selectedSong} onExit={handleExit} />;
  } else {
    return (
      <div>
        <button onClick={handleSelectSongs} disabled={loading}>
          {loading ? "Cargando..." : "Seleccionar carpeta de canciones"}
        </button>

        {songList ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {songList.map((song) => (
              <SmallCover
                key={song.id}
                song={song}
                onClick={() => {
                  console.log(song);
                  setSelectedSong(song);
                }}
              />
            ))}
          </div>
        ) : (
          <p>
            No hay canción seleccionada. Por favor, elija una carpeta de
            canciones.
          </p>
        )}

        {error && <div>{error}</div>}
      </div>
    );
  }
}

export default App;
