import { Fragment, forwardRef, useMemo, useState } from "react";

import { LayerGroup, MapContainer, Polygon, TileLayer } from "react-leaflet";
import L from "leaflet";
import { SemiCircleMarker } from "react-leaflet-semicircle";

import DummyData from "../../assets/data/dummy_data_v3.json";

import Regions from "../../assets/data/regions.json";

import RegionsCoordinates from "../../assets/data/regions_coordinates.json";

const MapScreenshot = forwardRef(({ filters }, ref) => {
  const data = DummyData;

  const zoomOptions = { max: 10, min: 7 };

  const [zoom, setZoom] = useState(zoomOptions.min);

  const [map, setMap] = useState(null);

  const [center, setCenter] = useState([13, 122]);

  const maxBounds = [
    [22, 116],
    [4, 128],
  ];

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
    preferCanvas: true,
    ref: setMap,
  };

  const mapLegends = [
    { id: "TB", label: "Tuberculosis", color: "#DBB324" },
    { id: "PN", label: "Pneumonia", color: "#007AFF" },
    { id: "COVID", label: "COVID", color: "#D82727" },
    { id: "AURI", label: "AURI", color: "#35CA3B" },
  ];

  const getColor = (id) => {
    const legend = mapLegends.find((v) => v.id == id);
    return legend.color;
  };

  const displayRegion = (id) => {
    const flag = filters.region.find((f) => f.value == id);
    if (flag !== undefined && flag !== null) return true;

    return false;
  };

  return (
    <>
      {/* MAP CONTAINER */}
      <div
        className="map-container w-[1400px] h-[1700px] fixed z-50 top-0 left-[100%] map-screenshot"
        ref={ref}
      >
        {/* MAP */}
        {useMemo(
          () => (
            <MapContainer {...mapOptions} renderer={L.canvas()}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LayerGroup>
                {RegionsCoordinates.map(({ id, coordinates }, i) => {
                  return (
                    displayRegion(id) &&
                    filters.region.length !== Regions.regions.length && (
                      <Polygon
                        key={id}
                        pathOptions={{ color: "#88F", fill: false, weight: 5 }}
                        positions={coordinates}
                      />
                    )
                  );
                })}
              </LayerGroup>

              <LayerGroup>
                {data &&
                  data.map(
                    ({ latitude, longitude, region, sickness, text }, i) => {
                      return (
                        (displayRegion(region) ||
                          filters.region.length == Regions.regions.length) && (
                          <Fragment key={i}>
                            {sickness.map((v, i) => {
                              const interval = 360 / sickness.length;
                              return (
                                <SemiCircleMarker
                                  className="z-10"
                                  key={i}
                                  position={[latitude, longitude]}
                                  color={getColor(v)}
                                  radius={15}
                                  startAngle={interval * (i + 1) - interval}
                                  stopAngle={interval * (i + 1)}
                                ></SemiCircleMarker>
                              );
                            })}
                          </Fragment>
                        )
                      );
                    }
                  )}
              </LayerGroup>
            </MapContainer>
          ),
          [filters]
        )}
      </div>
    </>
  );
});
export default MapScreenshot;
