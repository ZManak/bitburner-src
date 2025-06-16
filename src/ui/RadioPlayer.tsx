import React, { useEffect, useState } from "react";
import RadioPage from "./RadioPage";
import { ReactElement } from "react-markdown/lib/react-markdown";
import { Button, CircularProgress, List, ListItem, Paper, TextField } from "@material-ui/core";
interface Station {
  name: string;
  url_resolved: string;
  country: string;
  favicon: string;
  clickcount: number;
}

export function RadioPlayer(): ReactElement {
  const [stations, setStations] = useState<Station[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Station | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>(["jazz"]);

  // Fetch countries and genres on mount
  useEffect(() => {
    fetch("https://de1.api.radio-browser.info/json/countries")
      .then((res) => res.json())
      .then((data: { name: string }[]) => setCountries(data.map((c) => c.name.toLowerCase())))
      .catch((err) => console.error(err));

    fetch("https://de1.api.radio-browser.info/json/tags")
      .then((res) => res.json())
      .then((data: { name: string }[]) => setGenres(data.map((g) => g.name.toLowerCase())))
      .catch((err) => console.error(err));
  }, []);

  // Fetch stations when search changes
  useEffect(() => {
    if (!search) return;
    setLoading(true);

    // Determine if search term is a country or genre
    const term = search.trim().toLowerCase();
    let url = "";
    //if (countries.includes(term)) {
    //url = `https://de1.api.radio-browser.info/json/stations/search?country=${encodeURIComponent(term)}`;
    if (genres.includes(term)) {
      url = `https://de1.api.radio-browser.info/json/stations/search?tag=${encodeURIComponent(term)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data: Station[]) => {
        // Sort by clickcount
        data.sort((a, b) => b.clickcount - a.clickcount).slice(0, 5);
        setStations(data);
        setLoading(false);
        if (data.length > 0) {
          setSelected(data[0]); // Auto-select first station
        } else {
          setSelected(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [search, countries, genres]);

  function debounce(setSearch: React.Dispatch<React.SetStateAction<string>>): (search: string) => void {
    // ADD DEBOUNCE
    let timeoutId: NodeJS.Timeout;
    return (search: string): void => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setSearch(search), 300); // Adjust delay as needed
    };
  }

  return (
    <Paper elevation={3} title="Top Volume">
      <div style={{ padding: 16 }}>
        <TextField
          id="player"
          label="What do you want to listen to?"
          variant="outlined"
          value={search}
          onChange={(event) => debounce(() => setSearch(event.target.value))} // ADD DEBOUNCE
          fullWidth
          style={{ marginBottom: 8 }}
        />
        {loading ? (
          <CircularProgress />
        ) : (
          <List style={{ maxHeight: 200, overflow: "auto", padding: 0 }}>
            {stations.map((station) => (
              <ListItem key={station.url_resolved} style={{ padding: 0 }}>
                <Button
                  onClick={() => setSelected(station)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "#333",
                    color: "#fff",
                    border: "none",
                    padding: 8,
                    borderRadius: 4,
                  }}
                >
                  {station.favicon && (
                    <img src={station.favicon} alt="" width={16} style={{ verticalAlign: "middle", marginRight: 8 }} />
                  )}
                  {station.name} ({station.country}) —{" "}
                  <span style={{ color: "#aaa" }}>{station.clickcount} listeners</span>
                </Button>
              </ListItem>
            ))}
          </List>
        )}
        {selected && (
          <div style={{ marginTop: 16 }}>
            <h3>Listening to: {selected.name}</h3>
            <audio controls autoPlay src={selected.url_resolved} controlsList="compact" />
          </div>
        )}
      </div>
      <div style={{ padding: 16 }}>
        <h4>Search by Country or Genre</h4>
        <TextField
          label="Country or Genre"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          style={{ marginBottom: 8 }}
        />
        <div>
          <strong>Available Countries:</strong> {countries.join(", ")}
        </div>
        <div>
          <strong>Available Genres:</strong> {genres.join(", ")}
        </div>
      </div>
    </Paper>
  );
}

export const RadioWidget: React.FC = () => {
  return (
    <RadioPage title="Radio Player" isHidden>
      <RadioPlayer />
    </RadioPage>
  );
};
