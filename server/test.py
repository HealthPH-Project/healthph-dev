import re
import geopandas as gpd
import fiona
import pandas as pd
import pyproj as proj
from pyproj import Transformer, CRS
import json

import cv2

def xy_to_latlon(x, y):
    # Specify the CRS of your data (replace with your actual CRS)
    # Example for UTM zone 38N
    wgs84_32651_crs = CRS.from_epsg(32651)  # UTM zone numbering convention

    # Target CRS (assuming WGS84 for longitude and latitude)
    wgs84_4326_crs = CRS.from_epsg(4326)

    # Create a Transformer object for UTM to WGS84 conversion (longitude, latitude)
    transformer = Transformer.from_crs(wgs84_32651_crs, wgs84_4326_crs, always_xy=True)

    # Perform the conversion
    lat, lon = transformer.transform(x, y)
    
    return lat, lon

if __name__ == "__main__":
    pass