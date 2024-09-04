import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Icon from "../Icon";
import {
  AttributionControl,
  MapContainer,
  Polygon,
  TileLayer,
  Popup,
  LayerGroup,
} from "react-leaflet";
import { SemiCircle, SemiCircleMarker } from "react-leaflet-semicircle";
import Regions from "../../assets/data/regions.json";
import RegionsCoordinates from "../../assets/data/regions_coordinates.json";
import { format } from "date-fns";

const Map = ({ filters, data, mapCenter, points, isPointsLoading }) => {
  const zoomOptions = { max: 10, min: 6, default: 7 };

  const [zoom, setZoom] = useState(zoomOptions.default);

  const [center, setCenter] = useState(mapCenter);

  const maxBounds = [
    [22, 116],
    [4, 128],
  ];

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

  const [showAttribution, setShowAttribution] = useState(false);

  const displayRegion = (id) => {
    const flag = filters.region.find((f) => f.value == id);
    if (flag !== undefined && flag !== null) return true;

    return false;
  };

  const mapLegends = [
    { id: "TB", label: "PTB", color: "#DBB324" },
    { id: "PN", label: "Pneumonia", color: "#007AFF" },
    { id: "COVID", label: "COVID", color: "#D82727" },
    { id: "AURI", label: "AURI", color: "#35CA3B" },
  ];

  const getColor = (id) => {
    const legend = mapLegends.find((v) => v.id == id);
    return legend.color;
  };

  return (
    <>
      {/* MAP CONTAINER */}
      <div className="map-container" id="trends-map-container">
        <div className="map-header">
          <div className="attribution-controls hidden xs:block">
            <div
              className="control-wrapper rounded-[6px]"
              onClick={() => {
                setShowAttribution(!showAttribution);
              }}
            >
              <Icon
                iconName="Information"
                height="20px"
                width="20px"
                fill="#465360"
              />
            </div>
          </div>
          <div className="map-legend-wrapper">
            <div className="map-date">
              Updated as of {format(new Date(), "MMMM dd, yyyy")}
            </div>
            <div className="map-legends">
              {mapLegends.map(({ label, color }, i) => {
                return (
                  <div className="map-legend-item" key={i}>
                    <div
                      className="color"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
              className={`control-wrapper rounded-t-[6px] ${
                zoom == zoomOptions.max ? "disabled" : ""
              }`}
              onClick={() => {
                if (zoom < zoomOptions.max) setZoom((zoom) => zoom + 1);
              }}
            >
              <Icon iconName="Plus" height="20px" width="20px" fill="#465360" />
            </div>
            <div
              className={`control-wrapper rounded-b-[6px] ${
                zoom == zoomOptions.min ? "disabled" : ""
              }`}
              onClick={() => {
                if (zoom > zoomOptions.min) setZoom((zoom) => zoom - 1);
              }}
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

              {showAttribution && <AttributionControl position="topleft" />}

              {!isPointsLoading && (
                <>
                  <LayerGroup>
                    {RegionsCoordinates.map(({ id, coordinates }, i) => {
                      return (
                        displayRegion(id) &&
                        filters.region.length !== Regions.regions.length && (
                          <Polygon
                            key={id}
                            pathOptions={{
                              color: "#88F",
                              fill: false,
                              weight: 5,
                            }}
                            positions={coordinates}
                          />
                        )
                      );
                    })}
                  </LayerGroup>

                  <LayerGroup>
                    {points &&
                      points.map(
                        ({ lat, long, region, annotations, keywords }, i) => {
                          const texts = keywords.slice(0, 3);
                          if (!annotations.includes("X")) {
                            return (
                              (displayRegion(region) ||
                                filters.region.length ==
                                  Regions.regions.length) && (
                                <Fragment key={i}>
                                  {annotations.map((v, i) => {
                                    const interval = 360 / annotations.length;
                                    return (
                                      <SemiCircleMarker
                                        className="z-10"
                                        key={i}
                                        position={[lat, long]}
                                        color={getColor(v)}
                                        radius={15}
                                        startAngle={
                                          interval * (i + 1) - interval
                                        }
                                        stopAngle={interval * (i + 1)}
                                      >
                                        <Popup>
                                          {texts.map(({ key }, i) => {
                                            return <p key={i}>{key}</p>;
                                          })}
                                        </Popup>
                                      </SemiCircleMarker>
                                    );
                                  })}
                                </Fragment>
                              )
                            );
                          }
                        }
                      )}
                  </LayerGroup>
                </>
              )}
            </MapContainer>
          ),
          [filters, showAttribution, data, points, isPointsLoading]
        )}
      </div>
    </>
  );
};
export default Map;
