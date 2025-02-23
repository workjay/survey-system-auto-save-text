import { useDebounce } from "./hooks/useDebounce";
import "./App.css";
import { useCallback, useEffect, useState } from "react";

function App() {
  const [value, setValue] = useState<string>("");
  const [delay, setDelay] = useState<number | null>(null);
  const debouncedValue = useDebounce(value, (delay || 4) * 1000);

  const saveChanges = useCallback((text: string) => {
    localStorage.setItem("text", text);
  }, []);

  const handleSave = useCallback(() => {
    saveChanges(value);
    alert("Text saved successfully!");
  }, [value, saveChanges]);

  useEffect(() => {
    const text = localStorage.getItem("text");
    if (text) {
      setValue(text);
    }
    const delay = localStorage.getItem("delay");
    setDelay(delay ? Number(delay) : 4);
  }, []);

  useEffect(() => {
    if (delay) {
      localStorage.setItem("delay", delay.toString());
    }
  }, [delay]);

  useEffect(() => {
    saveChanges(debouncedValue);
  }, [debouncedValue, saveChanges]);

  useEffect(() => {
    const saveBeforeUnload = () => {
      console.log("Saving text before leaving:", value);
      localStorage.setItem("text", value);
    };

    window.addEventListener("beforeunload", saveBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", saveBeforeUnload);
    };
  }, [value]);

  return (
    <div className="app">
      <h1>Auto Save Text</h1>
      <div className="delay-container">
        <div className="delay-container-input">
          <label htmlFor="delay">Delay in seconds: </label>
          <input
            id="delay"
            type="number"
            min="0"
            value={delay || ""}
            onChange={(e) =>
              setDelay(e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>
        <p>By default, the text will be saved every 4 seconds.</p>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter your text here"
        autoFocus
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default App;
