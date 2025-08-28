// import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  GeoJSON
} from "react-leaflet";
import indiaData from "../assets/india.json"; // path to your GeoJSON

import L from "leaflet";
// import { Modal } from 'flowbite-react';
import { useState } from "react";
import 'leaflet/dist/leaflet.css';

const statesData = [
  {
    id: 1,
    name: "Andhra Pradesh",
    latitude: 17.679,
    longitude: 83.221,
    color: "red",
    hubs: ["Visakhapatnam", "Vijayawada", "Tirupati"],
  },
  {
    id: 2,
    name: "Arunachal Pradesh",
    latitude: 27.1338,
    longitude: 93.6053,
    color: "blue",
    hubs: ["Itanagar", "Tawang", "Bomdila"],
  },
  {
    id: 3,
    name: "Assam",
    latitude: 26.2006,
    longitude: 92.9376,
    color: "green",
    hubs: ["Guwahati", "Jorhat", "Silchar"],
  },
  {
    id: 4,
    name: "Bihar",
    latitude: 25.0961,
    longitude: 85.3131,
    color: "orange",
    hubs: ["Patna", "Gaya", "Bhagalpur"],
  },
  {
    id: 5,
    name: "Chhattisgarh",
    latitude: 21.2787,
    longitude: 81.655,
    color: "yellow",
    hubs: ["Raipur", "Bilaspur", "Korba"],
  },
];

const stateConnections = [
  { from: 1, to: 2, type: "Bus" },  // Andhra Pradesh -> Arunachal Pradesh
  { from: 1, to: 3, type: "Bus" },  // Andhra Pradesh -> Assam
  { from: 1, to: 4, type: "Bus" }, // Andhra Pradesh -> Bihar
  { from: 1, to: 5, type: "Bus" }, // Andhra Pradesh -> Chhattisgarh
  
];

// Coordinates for India's bounds
// const indiaBounds = [
//     [6.4623, 68.1266], // South-west
//     [37.0902, 97.4181], // North-east
//   ];
const getEdgeStyle = (type) => {
  // Define styles for different types of transportation
  const styles = {
    Bus: { color: "blue", weight: 2, dashArray: "5,5" }, // Dashed blue line
    Flight: { color: "red", weight: 3, dashArray: null }, // Solid red line
    Ship: { color: "green", weight: 2, dashArray: "10,10" }, // Long dashed green line
    default: { color: "gray", weight: 1, dashArray: null }, // Default style
  };
  return styles[type] || styles.default;
};

const Graph = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleStateClick = (state) => {
    setShowModal(true);
    setModalContent(state);
  };

  const getConnectionLine = (from, to) => {
    const stateFrom = statesData.find((state) => state.id === from);
    const stateTo = statesData.find((state) => state.id === to);
    return [
      [stateFrom.latitude, stateFrom.longitude],
      [stateTo.latitude, stateTo.longitude],
    ];
  };
  const edgeTypes = [
    { type: "Bus", color: "blue" },
    { type: "Flight", color: "red" },
    { type: "Ship", color: "green" },
  ];

  return (
    <div className="relative w-full h-screen  rounded-2xl">
       {/* Badges for edge types */}
       <div className="absolute top-2 left-2 z-[1000] ml-10 bg-white p-3 rounded-lg shadow-md flex space-x-4">
        {edgeTypes.map(({ type, color }, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 border rounded px-3 py-1"
            style={{ borderColor: color }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-sm font-medium text-black">{type}</span>
          </div>
        ))}
      </div>
      <MapContainer
        // center={[20.5937, 78.9629]} // Center of India
        center={[22.9734, 78.6569]} // Center of India
        zoom={5}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        maxBounds={[
          [6.4623, 68.1266],
          [37.0902, 97.4181],
        ]}
        maxBoundsViscosity={1.0}
      >
         <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* India boundary outline */}
          <GeoJSON
            data={indiaData}
            style={() => ({
              color: "gray",
              weight: 2,
              fillColor: "#e0ffe0",
              fillOpacity: 0.3,
            })}
          />
        {stateConnections.map((connection, index) => {
          const { from, to, type } = connection;
          const line = getConnectionLine(from, to);
          const style = getEdgeStyle(type); // Get the style for the connection type

          return (
            <Polyline
              key={index}
              positions={line}
              color={style.color}
              weight={style.weight}
              dashArray={style.dashArray}
            />
          );
        })}
        {statesData.map((state) => (
          <Marker
            key={state.id}
            position={[state.latitude, state.longitude]}
            icon={
              new L.Icon({
                iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='${state.color}' /%3E%3C/svg%3E`,
                iconSize: [25, 25],
                iconAnchor: [12, 25],
              })
            }
            eventHandlers={{
              click: () => handleStateClick(state),
            }}
          >
            <Popup>{state.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Modal with absolute positioning and high z-index */}
      <div
        className={`absolute inset-0 z-[1000] flex items-center justify-center ${
          showModal ? "visible" : "invisible"
        }`}
        style={{
          backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "transparent",
          pointerEvents: showModal ? "auto" : "none",
        }}
      >
        {showModal && (
          <div className="bg-slate-200 rounded-lg shadow-xl max-w-md w-full border border-gray-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-300">
                <h3 className="text-xl font-semibold text-green-600">
                  {modalContent ? modalContent.name : ""}
                </h3>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-red-600 font-bold bg-red-200 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
                >
                  ✕
                </button>
              </div>
              <div>
                <h5 className="text-lg font-semibold mb-2 text-red-500 underline underline-offset-4">
                  Connected Hubs:
                </h5>
                {modalContent &&
                modalContent.hubs &&
                modalContent.hubs.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {modalContent.hubs.map((hub, index) => (
                      <li key={index}>{hub}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No hubs available</p>
                )}
              </div>
              <div className="mt-4 flex justify-end border-t pt-4 border-gray-300">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg transition duration-150 ease-in-out"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Graph;