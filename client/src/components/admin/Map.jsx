import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "../Icon";
import {
  AttributionControl,
  MapContainer,
  Polygon,
  TileLayer,
  CircleMarker,
  Circle,
  Popup,
  LayerGroup,
} from "react-leaflet";
import Regions from "../../assets/data/regions.json";
import RegionsCoordinates from "../../assets/data/regions_coordinates.json";

const Map = ({ filters, sample }) => {
  const zoomOptions = { max: 13, min: 7 };

  const [zoom, setZoom] = useState(zoomOptions.min);

  const center = [13, 122];

  const maxBounds = [
    [22, 116],
    [4, 128],
  ];

  const purpleOptions = { color: "purple" };

  const [map, setMap] = useState(null);

  const mapOptions = {
    center: center,
    zoom: zoom,
    scrollWheelZoom: true,
    minZoom: zoomOptions.min,
    maxZoom: zoomOptions.max,
    maxBounds: maxBounds,
    maxBoundsViscosity: 1,
    attributionControl: false,
    zoomControl: false,
    ref: setMap,
  };

  useEffect(() => {
    if (map) map.setZoom(zoom);
  }, [map, zoom]);

  const displayRegion = (id) => {
    const flag = filters.region.find((f) => f.value == id);
    if (flag !== undefined && flag !== null) return true;

    return false;
  };

  return (
    <>
      {/* MAP CONTAINER */}
      <div className="map-container">
        {/* MAP CONTROLS */}
        <div className="map-controls">
          <div
            className="control-wrapper mb-[16px] rounded-[6px]"
            onClick={useCallback(() => {
              map.panTo(center, { animate: true });
            }, [map])}
          >
            <Icon
              iconName="CurrentLocation"
              height="20px"
              width="20px"
              fill="#465360"
            />
          </div>
          <div className="zoom-controls">
            <div
              className="control-wrapper rounded-t-[6px]"
              onClick={() => setZoom((zoom) => zoom + 1)}
            >
              <Icon iconName="Plus" height="20px" width="20px" fill="#465360" />
            </div>
            <div
              className="control-wrapper rounded-b-[6px]"
              onClick={() => setZoom((zoom) => zoom - 1)}
            >
              <Icon
                iconName="Minus"
                height="20px"
                width="20px"
                fill="#465360"
              />
            </div>
          </div>
        </div>

        {/* MAP */}
        {useMemo(
          () => (
            <MapContainer {...mapOptions}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <AttributionControl position="topleft" />
              <LayerGroup>
                {sample &&
                  sample.map(({ longlat, radius, color }, i) => {
                    return (
                      <CircleMarker
                        key={i}
                        center={longlat}
                        pathOptions={{ color: color }}
                        radius={radius}
                        // radius={radius * 5}
                      >
                        <Popup>Sample Popup</Popup>
                      </CircleMarker>
                    );
                  })}
              </LayerGroup>
              {RegionsCoordinates.map(({ id, coordinates }, i) => {
                return (
                  displayRegion(id) &&
                  filters.region.length !== Regions.regions.length && (
                    <Polygon
                      key={id}
                      pathOptions={{ color: "#88F" }}
                      positions={coordinates}
                    />
                  )
                );
              })}
            </MapContainer>
          ),
          [filters]
        )}
      </div>
    </>
  );
};
export default Map;
