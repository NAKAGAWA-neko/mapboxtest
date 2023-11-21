import mapboxgl, { Projection } from "mapbox-gl";

const LONGITUDE = 139.76; // 経度
const LATITUDE = 35.68; // 緯度

// Mapboxのアクセストークンを設定
mapboxgl.accessToken =
  "pk.eyJ1IjoibmFrYWhpcm8iLCJhIjoiY2xudHk2d2NhMDZuejJpcXhrYzRjZGh1cSJ9.85G_WO7bJpSqDCL7c9pFCw";

const selectedProjection: Projection = {
  name: "globe",
};

// Mapboxのマップを初期化
export const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  projection: selectedProjection,
  center: [LONGITUDE, LATITUDE],
  zoom: 5,
});
