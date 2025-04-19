import React, { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import * as satellite from "satellite.js";
import "leaflet/dist/leaflet.css";

// Collection of real satellite TLEs
const SATELLITES = {
  ISS: [
    "1 25544U 98067A   24109.61461966  .00001376  00000-0  34815-4 0  9990",
    "2 25544  51.6419  37.9119 0006901  72.6430  41.0500 15.50042489442051",
  ],
  STARLINK: [
    "1 48274U 21021Q   24099.13229708  .00010374  00000+0  68171-3 0  9993",
    "2 48274  53.0520 167.6711 0001367  92.2012 267.9119 15.06419990166746",
  ],
  NOAA: [
    "1 28654U 05018A   24099.53299558  .00000090  00000+0  77082-4 0  9997",
    "2 28654  98.7301 156.3346 0014072 115.5890 244.6853 14.12627084972865",
  ],
  HUBBLE: [
    "1 20580U 90037B   24099.25919242  .00000522  00000+0  23605-4 0  9997",
    "2 20580  28.4698 282.6045 0002429 324.4097  35.6553 15.09757100231598",
  ],
};

// Better satellite icons with improved visibility
const SATELLITE_ICONS = {
  ISS: L.icon({
    iconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/International_Space_Station.svg/48px-International_Space_Station.svg.png",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    className: "satellite-icon iss-icon",
  }),
  STARLINK: L.divIcon({
    html: '<div class="satellite-dot starlink"></div>',
    className: "satellite-icon-container",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  }),
  NOAA: L.divIcon({
    html: '<div class="satellite-dot noaa"></div>',
    className: "satellite-icon-container",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  }),
  HUBBLE: L.divIcon({
    html: '<div class="satellite-dot hubble"></div>',
    className: "satellite-icon-container",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  }),
};

// Track colors
const TRACK_COLORS = {
  ISS: "#ff4136",
  STARLINK: "#f8c537",
  NOAA: "#4287f5",
  HUBBLE: "#9c42f5",
};

const getLatLngFromTLE = (tle, timestamp = new Date()) => {
  try {
    const satrec = satellite.twoline2satrec(tle[0], tle[1]);
    const positionAndVelocity = satellite.propagate(
      satrec,
      timestamp.getUTCFullYear(),
      timestamp.getUTCMonth() + 1,
      timestamp.getUTCDate(),
      timestamp.getUTCHours(),
      timestamp.getUTCMinutes(),
      timestamp.getUTCSeconds()
    );
    if (!positionAndVelocity.position) return null;
    const gmst = satellite.gstime(timestamp);
    const geodetic = satellite.eciToGeodetic(
      positionAndVelocity.position,
      gmst
    );
    const longitude = satellite.degreesLong(geodetic.longitude);
    const latitude = satellite.degreesLat(geodetic.latitude);
    const altitude = geodetic.height; // in km
    return [latitude, longitude, altitude];
  } catch (e) {
    console.error("Error calculating satellite position:", e);
    return null;
  }
};

function useSatelliteTrack(tle, { minutes = 90, stepSec = 20 } = {}) {
  const now = new Date();
  const tracks = useMemo(() => {
    let past = [];
    let future = [];

    for (let i = minutes * 60; i > 0; i -= stepSec) {
      const t = new Date(now.getTime() - i * 1000);
      const pos = getLatLngFromTLE(tle, t);
      if (pos) past.push([pos[0], pos[1]]);
    }

    for (let i = 0; i < minutes * 60; i += stepSec) {
      const t = new Date(now.getTime() + i * 1000);
      const pos = getLatLngFromTLE(tle, t);
      if (pos) future.push([pos[0], pos[1]]);
    }

    return [past, future];
  }, [tle, minutes, stepSec]);

  return tracks;
}

function SatelliteMarker({ tle, name, color, icon, autoPan }) {
  const map = useMap();
  const [position, setPosition] = useState(getLatLngFromTLE(tle));

  useEffect(() => {
    const interval = setInterval(() => {
      const pos = getLatLngFromTLE(tle);
      if (pos) {
        setPosition(pos);
        if (autoPan) {
          map.setView([pos[0], pos[1]], map.getZoom(), { animate: true });
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [tle, map, autoPan]);

  if (!position) return null;

  return (
    <Marker position={[position[0], position[1]]} icon={icon}>
      <Tooltip
        className="satellite-tooltip"
        direction="top"
        offset={[0, -5]}
        permanent
      >
        <div className="satellite-name">{name}</div>
        <div className="satellite-coords">
          Lat: {position[0].toFixed(2)}°<br />
          Lon: {position[1].toFixed(2)}°<br />
          Alt: {position[2].toFixed(1)} km
        </div>
      </Tooltip>
    </Marker>
  );
}

function MapControls({
  onFollowSatellite,
  followingSatellite,
  onToggleSatellite,
  activeSatellites,
}) {
  return (
    <div className="map-controls bg-white p-4 rounded shadow-lg absolute top-4 right-4 z-50 w-64">
      <h3 className="text-lg font-bold mb-2">Satellites</h3>
      {Object.keys(SATELLITES).map((satName) => (
        <div key={satName} className="flex items-center mb-2">
          <input
            type="checkbox"
            id={`sat-${satName}`}
            checked={activeSatellites.includes(satName)}
            onChange={() => onToggleSatellite(satName)}
            className="mr-2"
          />
          <label htmlFor={`sat-${satName}`} className="flex-1">
            {satName}
          </label>
          <button
            onClick={() => onFollowSatellite(satName)}
            className={`px-2 py-1 text-xs rounded ${
              followingSatellite === satName
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {followingSatellite === satName ? "Following" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
}

const MapStyleSelector = () => {
  const map = useMap();

  const setMapStyle = (style) => {
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (style === "dark") {
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "©OpenStreetMap, ©CartoDB",
          maxZoom: 19,
        }
      ).addTo(map);
    } else if (style === "satellite") {
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri",
          maxZoom: 19,
        }
      ).addTo(map);
    } else {
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);
    }
  };

  return (
    <div className="map-style-selector bg-white p-2 rounded shadow-lg absolute bottom-8 left-4 z-50">
      <div className="flex space-x-2">
        <button
          onClick={() => setMapStyle("light")}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          Light
        </button>
        <button
          onClick={() => setMapStyle("dark")}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          Dark
        </button>
        <button
          onClick={() => setMapStyle("satellite")}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          Satellite
        </button>
      </div>
    </div>
  );
};

function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="time-display bg-white bg-opacity-80 p-2 rounded shadow absolute bottom-8 right-4 z-50 text-sm font-mono">
      {currentTime.toUTCString()}
    </div>
  );
}

const RealtimeSatelliteMap = () => {
  const [activeSatellites, setActiveSatellites] = useState(["ISS", "HUBBLE"]);
  const [followingSatellite, setFollowingSatellite] = useState(null);

  const handleToggleSatellite = (name) => {
    setActiveSatellites((current) =>
      current.includes(name)
        ? current.filter((sat) => sat !== name)
        : [...current, name]
    );

    // If we're unfollowing the satellite we're following, stop following
    if (followingSatellite === name && !activeSatellites.includes(name)) {
      setFollowingSatellite(null);
    }
  };

  const handleFollowSatellite = (name) => {
    // If already following this satellite, stop following
    if (followingSatellite === name) {
      setFollowingSatellite(null);
    } else {
      setFollowingSatellite(name);
      // Make sure the satellite is active if we start following it
      if (!activeSatellites.includes(name)) {
        setActiveSatellites((current) => [...current, name]);
      }
    }
  };

  return (
    <div className="relative w-full">
      <div className="h-screen w-full">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
          worldCopyJump
          minZoom={2}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          <ZoomControl position="bottomleft" />

          {/* Add satellite markers and tracks for active satellites */}
          {Object.entries(SATELLITES).map(([name, tle]) => {
            if (!activeSatellites.includes(name)) return null;

            const [pastTrack, futureTrack] = useSatelliteTrack(tle);
            const color = TRACK_COLORS[name];

            return (
              <React.Fragment key={name}>
                <Polyline
                  positions={pastTrack}
                  color={color}
                  weight={3}
                  opacity={0.7}
                />
                <Polyline
                  positions={futureTrack}
                  color={color}
                  weight={2.5}
                  opacity={0.5}
                  dashArray="4 8"
                />
                <SatelliteMarker
                  tle={tle}
                  name={name}
                  color={color}
                  icon={SATELLITE_ICONS[name]}
                  autoPan={followingSatellite === name}
                />
              </React.Fragment>
            );
          })}

          <MapStyleSelector />
          <TimeDisplay />
        </MapContainer>
      </div>

      <MapControls
        onFollowSatellite={handleFollowSatellite}
        followingSatellite={followingSatellite}
        onToggleSatellite={handleToggleSatellite}
        activeSatellites={activeSatellites}
      />

      {/* Custom CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        .satellite-tooltip {
          background: rgba(0, 0, 0, 0.7) !important;
          border: none !important;
          border-radius: 4px;
          color: white;
          padding: 6px 8px;
          font-size: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        
        .satellite-tooltip:before {
          border-top-color: rgba(0, 0, 0, 0.7) !important;
        }
        
        .satellite-name {
          font-weight: bold;
          margin-bottom: 2px;
        }
        
        .satellite-coords {
          font-size: 10px;
          opacity: 0.9;
        }
        
        .map-controls {
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .satellite-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          box-shadow: 0 0 10px 4px rgba(255, 255, 255, 0.4);
        }
        
        .satellite-dot.starlink {
          background-color: #f8c537;
          box-shadow: 0 0 10px 4px rgba(248, 197, 55, 0.6);
        }
        
        .satellite-dot.noaa {
          background-color: #4287f5;
          box-shadow: 0 0 10px 4px rgba(66, 135, 245, 0.6);
        }
        
        .satellite-dot.hubble {
          background-color: #9c42f5;
          box-shadow: 0 0 10px 4px rgba(156, 66, 245, 0.6);
        }
        
        .iss-icon {
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8));
        }
        
        @media (max-width: 640px) {
          .map-controls {
            width: auto;
            right: 10px;
            left: 10px;
            top: 10px;
          }
        }
      `,
        }}
      />
    </div>
  );
};

export default RealtimeSatelliteMap;
