import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const Map = ({ lat, lng }) => {
  const API_KEY = import.meta.env.VITE_GOOGLEMAP_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
  });

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0.5rem",
  };

  const center = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span>Loading map...</span>
      </div>
    );
  }

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15}>
      <Marker position={center} />
    </GoogleMap>
  );
};

export default Map;
