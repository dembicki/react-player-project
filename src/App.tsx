import React, { useRef } from "react";
import { useImmer } from "use-immer";
import ReactPlayer from "react-player";
import "./App.scss";

function App() {
  const [config, setConfig] = useImmer<any>({
    url: null,
    pip: false,
    playing: true,
    controls: false,
    seeking: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
  });

  const inputRef = useRef(null);
  const playerRef = useRef<ReactPlayer>(null);

  const onSubmit = (): void => {
    if (!inputRef.current) return;
    const { value } = inputRef.current;
    load(value);
  };

  const load = (url: string) => {
    changeConfig("url", url);
    changeConfig("player", 0);
    changeConfig("loaded", 0);
    changeConfig("pip", false);
  };

  const handleSeekMouseDown = () => {
    changeConfig("seeking", true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeConfig("played", parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    changeConfig("seeking", false);
    const target = e.target as HTMLButtonElement;
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat(target.value));
    }
  };

  const changeConfig = (
    field: string,
    value: string | boolean | number
  ): void => {
    setConfig((draft: { [x: string]: string | number | boolean }) => {
      draft[field] = value;
    });
  };

  return (
    <main className="header">
      <h2>Video player example</h2>
      <em>State: {JSON.stringify(config)}</em>
      <div className="controls">
        <input
          className="controls__input"
          type="text"
          placeholder="Place your video URL here..."
          ref={inputRef}
        />
        <button onClick={onSubmit} className="controls__submit">
          Load video
        </button>
      </div>
      <div className="options">
        <div className="options--item">
          <button
            id="controls"
            onClick={() => {
              changeConfig("playing", !config.playing);
              load(config.url);
            }}
          >
            {config.playing ? "Pause ⏸" : "Play ▶️"}
          </button>
        </div>
        <div className="options--item">
          <input
            id="muted"
            type="checkbox"
            onChange={(e) => changeConfig("muted", e.target.checked)}
          />
          <label htmlFor="muted">Muted 🔇</label>
        </div>
        <div className="options--item">
          <input
            id="muted"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={config.volume}
            onChange={(e) => changeConfig("volume", parseFloat(e.target.value))}
          />
          <label htmlFor="muted">Volume 🔈</label>
        </div>
        <div className="options--item">
          <input
            id="seek"
            style={{ minWidth: "600px" }}
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={config.played}
            onMouseDown={() => handleSeekMouseDown}
            onChange={(e) => handleSeekChange(e)}
            onMouseUp={(e) => handleSeekMouseUp(e)}
          />
          <label htmlFor="seek">Seek</label>
        </div>
      </div>
      <div className="player">
        <ReactPlayer
          ref={playerRef}
          width="100%"
          height="100%"
          controls={config.controls}
          muted={config.muted}
          url={config.url}
          playing={config.playing}
          volume={config.volume}
        />
      </div>
    </main>
  );
}

export default App;
