import "./style.css";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { geoJsonPoints, symbols } from "./geoJsonPoints";

mapboxgl.accessToken =
  "pk.eyJ1IjoibmFrYWhpcm8iLCJhIjoiY2xudHk2d2NhMDZuejJpcXhrYzRjZGh1cSJ9.85G_WO7bJpSqDCL7c9pFCw";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [139.8107, 35.710063], // starting position [lng, lat]
  zoom: 11, // starting zoom
});

map.on("load", () => {
  map.loadImage("https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png", (error, image) => {
    if (error) throw error;
    map.addImage("custom-marker", image as any);
    map.addSource("points", geoJsonPoints as mapboxgl.AnySourceData);
    map.addLayer(symbols as mapboxgl.AnyLayer);
  });
});
