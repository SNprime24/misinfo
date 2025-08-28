import { useRef, useCallback, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import indiaData from "../assets/india.json";

const statesData = [
  {
    id: 1,
    name: "Andhra Pradesh",
    latitude: 17.679,
    longitude: 83.221,
    color: "#FF5733", // Using hex colors for better styling
    hubs: ["Visakhapatnam", "Vijayawada", "Tirupati"],
  },
  {
    id: 2,
    name: "Arunachal Pradesh",
    latitude: 27.1338,
    longitude: 93.6053,
    color: "#33CFFF",
    hubs: ["Itanagar", "Tawang", "Bomdila"],
  },
  {
    id: 3,
    name: "Assam",
    latitude: 26.2006,
    longitude: 92.9376,
    color: "#57FF33",
    hubs: ["Guwahati", "Jorhat", "Silchar"],
  },
  {
    id: 4,
    name: "Bihar",
    latitude: 25.0961,
    longitude: 85.3131,
    color: "#FFC300",
    hubs: ["Patna", "Gaya", "Bhagalpur"],
  },
  {
    id: 5,
    name: "Chhattisgarh",
    latitude: 21.2787,
    longitude: 81.655,
    color: "#C70039",
    hubs: ["Raipur", "Bilaspur", "Korba"],
  },
];

const stateConnections = [
  { from: 1, to: 2, type: "Bus" }, // Andhra Pradesh -> Arunachal Pradesh
  { from: 1, to: 3, type: "Bus" }, // Andhra Pradesh -> Assam
  { from: 1, to: 4, type: "Bus" }, // Andhra Pradesh -> Bihar
  { from: 1, to: 5, type: "Bus" }, // Andhra Pradesh -> Chhattisgarh
];

// --- Color Palettes ---
const darkColors = {
  bg: "rgb(11, 22, 44)",
  card: "rgb(18, 32, 58)",
  border: "rgb(30, 48, 80)",
  accentBlue: "rgb(6, 165, 225)",
  midBlue: "rgb(50, 110, 220)",
  darkBlue: "rgb(10, 40, 120)",
  accentGreen: "rgb(0, 255, 135)",
  line: "rgba(0, 255, 135, 0.6)",
};

const lightColors = {
  bg: "rgb(248, 250, 252)",
  border: "rgba(15, 23, 42, 0.1)",
  accent: "rgb(0, 110, 255)",
  midBlue: "rgb(200, 220, 255)",
  line: "rgba(0, 110, 255, 0.7)",
};

// --- Main Graph Component ---
const App = ({ theme = "dark" }) => {
  const isDark = theme === "dark";
  const geojsonRef = useRef();

  // Memoize the calculation of India's map boundaries
  const indiaBounds = useMemo(() => {
    // If the GeoJSON data is empty, provide fallback coordinates for India
    if (!indiaData || !indiaData.features || indiaData.features.length === 0) {
      return L.latLngBounds(L.latLng(6, 68), L.latLng(35, 97));
    }
    const geoJsonLayer = L.geoJSON(indiaData);
    return geoJsonLayer.getBounds().pad(0.1);
  }, []);

  // --- Use the 'whenCreated' prop to set initial bounds ---
  // This avoids context issues with the useMap hook in a child component
  const setMapBounds = (map) => {
    if (map && indiaBounds.isValid()) {
      map.fitBounds(indiaBounds);
    }
  };

  // --- Styles ---
  const style = useMemo(
    () => ({
      dark: {
        color: darkColors.accentBlue,
        weight: 1,
        fillColor: darkColors.darkBlue,
        fillOpacity: 0.6,
      },
      light: {
        color: lightColors.border,
        weight: 1.5,
        fillColor: lightColors.midBlue,
        fillOpacity: 0.7,
      },
    }),
    []
  );

  const highlightStyle = useMemo(
    () => ({
      dark: { fillColor: darkColors.midBlue, fillOpacity: 0.8, weight: 2 },
      light: { fillColor: lightColors.accent, fillOpacity: 0.9, weight: 2 },
    }),
    []
  );

  // --- Event Handlers ---
  const onEachFeature = useCallback(
    (feature, layer) => {
      layer.on({
        mouseover: (e) => {
          const targetLayer = e.target;
          targetLayer.setStyle(
            isDark ? highlightStyle.dark : highlightStyle.light
          );
          targetLayer.bringToFront();
        },
        mouseout: (e) => {
          geojsonRef.current?.resetStyle(e.target);
        },
      });
    },
    [isDark, highlightStyle]
  );

  // --- Tile Layer Configuration ---
  const tileLayer = useMemo(
    () => ({
      dark: {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
      light: {
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    }),
    []
  );

  const currentTileLayer = isDark ? tileLayer.dark : tileLayer.light;

  // --- Create Custom Marker Icons ---
  const createCustomIcon = (color) => {
    // This is a common fix for Leaflet in some bundlers/environments
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px ${color};"></div>`,
      className: "custom-marker-icon", // Avoids conflicts with default styles
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  // --- Prepare Connection Lines ---
  const connectionLines = useMemo(() => {
    const statesById = statesData.reduce((acc, state) => {
      acc[state.id] = state;
      return acc;
    }, {});

    return stateConnections
      .map((conn, index) => {
        const fromState = statesById[conn.from];
        const toState = statesById[conn.to];

        if (fromState && toState) {
          return (
            <Polyline
              key={`line-${index}`}
              positions={[
                [fromState.latitude, fromState.longitude],
                [toState.latitude, toState.longitude],
              ]}
              pathOptions={{
                color: isDark ? darkColors.line : lightColors.line,
                weight: 2,
                dashArray: "5, 10",
              }}
            />
          );
        }
        return null;
      })
      .filter(Boolean); // Filter out any null entries
  }, [isDark]);

  return (
    <MapContainer
      style={{
        height: "100%",
        width: "100%",
        background: isDark ? darkColors.bg : lightColors.bg,
      }}
      center={[22.97, 78.65]}
      zoom={4}
      zoomControl={false}
      attributionControl={false}
      maxBounds={indiaBounds}
      minZoom={3.5}
      whenCreated={setMapBounds}
    >
      <TileLayer {...currentTileLayer} />

      <GeoJSON
        ref={geojsonRef}
        data={indiaData}
        style={() => (isDark ? style.dark : style.light)}
        onEachFeature={onEachFeature}
      />

      {statesData.map((state) => (
        <Marker
          key={`marker-${state.id}`}
          position={[state.latitude, state.longitude]}
          icon={createCustomIcon(state.color)}
        >
          <Popup>
            <div
              style={{
                color: isDark ? "white" : "black",
                backgroundColor: isDark ? darkColors.card : "white",
                border: `1px solid ${
                  isDark ? darkColors.border : lightColors.border
                }`,
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <strong>{state.name}</strong>
              <br />
              Hubs: {state.hubs.join(", ")}
            </div>
          </Popup>
        </Marker>
      ))}

      {connectionLines}
    </MapContainer>
  );
};

export default App;
