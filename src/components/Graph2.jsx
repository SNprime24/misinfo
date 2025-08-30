import { useRef, useCallback, useMemo, useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat"; 
import indiaData from "../assets/india.json";

const stateConnections = [];

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

const Graph = ({ theme = "dark" }) => {
  const isDark = theme === "dark";
  const geojsonRef = useRef();
  const mapRef = useRef(null);
  const heatRef = useRef(null);

  const [data, setData] = useState([]); // will hold points array from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE = import.meta.env.VITE_API_URL || "";
  const API_URL = `${BASE}/api/v1/dashboard/heatmap`;

  // --- gradient sampled to mimic the image legend (cold -> hot)
  // stops go from 0.0 -> 1.0 (leaflet.heat uses 0..1 gradient)
  const heatGradient = {
    0.0: "#08306b", // deep cold blue
    0.12: "#2c7bb6", // lighter blue
    0.30: "#7fcdbb", // cyan / greenish
    0.50: "#ffffbf", // yellow
    0.70: "#fdae61", // orange
    0.88: "#d7191c", // red
    1.0: "#800026", // deep red (highest intensity)
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        // API returns { points: [...] } — protect against different shapes
        const points = response?.data?.points ?? response?.data ?? [];
        setData(points);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // convert API points to marker data and heat points
  const statesData = useMemo(() => {
    // If your original markers used one per "state", you can adapt this.
    // For now we create markers directly from returned points (if you prefer
    // aggregated state markers, do aggregation separately).
    return (data || []).map((pt, i) => ({
      id: `p-${i}`,
      name: pt.report_summary ?? `Point ${i}`,
      latitude: pt.latitude,
      longitude: pt.longitude,
      intensity: typeof pt.intensity === "number" ? pt.intensity : 0,
      raw: pt,
    }));
  }, [data]);

  // prepare india bounds (unchanged)
  const indiaBounds = useMemo(() => {
    if (!indiaData || !indiaData.features || indiaData.features.length === 0) {
      return L.latLngBounds(L.latLng(6, 68), L.latLng(35, 97));
    }
    const geoJsonLayer = L.geoJSON(indiaData);
    return geoJsonLayer.getBounds().pad(0.1);
  }, []);

  const setMapCreated = (map) => {
    mapRef.current = map;
    if (map && indiaBounds.isValid()) map.fitBounds(indiaBounds);
  };

  // styles (unchanged)
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

  // create marker icon (unchanged)
  const createCustomIcon = (color) => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px ${color};"></div>`,
      className: "custom-marker-icon",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  // --- Heat layer effect: create/replace heat layer whenever data or theme changes
  useEffect(() => {
    if (!mapRef.current) return;

    // prepare heat points: filter out invalid coords like 0,0
    const heatPoints = (data || [])
      .filter(
        (p) =>
          p &&
          typeof p.latitude === "number" &&
          typeof p.longitude === "number" &&
          !(p.latitude === 0 && p.longitude === 0)
      )
      .map((p) => {
        // clamp intensity to 0..1
        const intensity = Math.max(0, Math.min(1, Number(p.intensity) || 0));
        // leaflet.heat expects [lat, lng, intensity]
        return [p.latitude, p.longitude, intensity];
      });

    // remove existing heat layer if present
    if (heatRef.current) {
      try {
        heatRef.current.remove();
      } catch (err) {
        /* ignore */
      }
      heatRef.current = null;
    }

    // if no points, nothing to add
    if (!heatPoints.length) return;

    // Add heat layer with options tuned to your visual reference
    // radius controls the spread (in pixels), blur smooths it out
    heatRef.current = L.heatLayer(heatPoints, {
      radius: 25, // adjust to make patch sizes similar to reference
      blur: 18,
      maxZoom: 10,
      // the gradient uses 0..1 keys as strings in leaflet.heat
      gradient: heatGradient,
      // you can also tweak minOpacity or max to emphasize
      minOpacity: 0.2,
    }).addTo(mapRef.current);

    // cleanup on unmount
    return () => {
      if (heatRef.current) {
        try {
          heatRef.current.remove();
        } catch (err) {}
        heatRef.current = null;
      }
    };
  }, [data, isDark]); // re-run when data or theme changes

  // you already had connectionLines; adapt it to statesData or keep as before
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
      .filter(Boolean);
  }, [isDark, statesData]);

  // A small guard while loading or error (optional)
  if (error) {
    console.error(error);
  }

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
      whenCreated={setMapCreated}
    >
      <TileLayer {...currentTileLayer} />

      <GeoJSON
        ref={geojsonRef}
        data={indiaData}
        style={() => (isDark ? style.dark : style.light)}
      />

      {statesData.map((state) => {
        // small skip if lat/lng invalid
        if (
          !state.latitude ||
          !state.longitude ||
          (state.latitude === 0 && state.longitude === 0)
        )
          return null;

        // color marker by intensity using same gradient idea:
        const color = state.intensity >= 0.9
          ? "#d7191c"
          : state.intensity >= 0.7
          ? "#fdae61"
          : state.intensity >= 0.4
          ? "#ffffbf"
          : state.intensity >= 0.15
          ? "#7fcdbb"
          : "#2c7bb6";

        return (
          <Marker
            key={state.id}
            position={[state.latitude, state.longitude]}
            icon={createCustomIcon(color)}
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
                Intensity: {state.intensity}
              </div>
            </Popup>
          </Marker>
        );
      })}

      {connectionLines}
    </MapContainer>
  );
};

export default Graph;
