import * as d3 from "d3";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import GeoJSON from "geojson";

type QuakeList = {
  acd: string;
  anm: string;
  cod: string;
  ctt: string;
  eid: string;
  en_anm: string;
  en_ttl: string;
  ift: string;
  int: {
    code: string;
    maxi: string;
    city: {
      code: string;
      city: string;
    }[];
  }[];
  json: string;
  mag: string;
  maxi: string;
  rdt: string;
  ser: string;
  ttl: string;
}[];

// 地震データを取得する非同期関数
const getQuakeList = async () => {
  try {
    // APIから地震データを取得
    const res = await fetch("https://www.jma.go.jp/bosai/quake/data/list.json");
    if (!res.ok) {
      throw new Error("データの取得に失敗しました。");
    }
    // レスポンスをJSON形式で解析
    const dataList: QuakeList = await res.json();
    return dataList; // 解析したデータを返す
  } catch (error) {
    console.error("エラー:", error);
    return []; // エラーが発生した場合は空の配列を返す
  }
};

// getQuakeList関数を実行
getQuakeList();

// マグニチュードのリストを定義
const magnitudeList = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8];

// 選択されたマグニチュードを表示する関数
const filterBy = (mag = 0) => {
  // マグニチュードの値を表示するDOM要素を更新
  (document.getElementById("magnitude") as any).textContent = magnitudeList[mag];
};

// 初期マグニチュードを表示
filterBy();

// マグニチュードに基づいて地震データをフィルタリングする関数
const filterEarthquakesByMagnitude = (magIndex) => {
  // 選択されたマグニチュードに基づいてフィルタリングの範囲を設定
  const minMag = magnitudeList[magIndex];
  const maxMag = magIndex < magnitudeList.length - 1 ? magnitudeList[magIndex + 1] : Infinity;

  // マップ上の地震データをフィルタリング
  map.setFilter("earthquakes", [
    "all",
    [">=", ["get", "mag"], minMag],
    ["<", ["get", "mag"], maxMag],
  ]);

  // マグニチュードの表示を更新
  filterBy(magIndex);
};

// スライダー要素の最大値を設定
document.getElementById("slider").max = magnitudeList.length - 1;

// スライダーの値が変更された時のイベントリスナー
document.getElementById("slider")?.addEventListener("input", (e) => {
  const magIndex = parseInt(e.target.value, 10);
  filterEarthquakesByMagnitude(magIndex);
});

// 地震データから緯度と経度を抽出し、GeoJSON形式に変換する関数
const extractCoordinates = (dataList: any) => {
  return dataList.map((data: any) => {
    // 緯度と経度を抽出し、数値に変換
    const [latitude, longitude] = data.cod.split(/[\+\/]/).slice(1, 3);

    // マグニチュード（mag）を数値に変換
    const mag = parseFloat(data.mag);

    return { ...data, latitude: parseFloat(latitude), longitude: parseFloat(longitude), mag };
  });
};

// 地震データをGeoJSONに変換し、コンソールに出力する関数
const convertToGeoJSONAndPrint = async () => {
  const quakeList = await getQuakeList();
  if (!Array.isArray(quakeList) || quakeList.length === 0) {
    console.error("有効なデータがありません");
    return null;
  }
  const formattedData = extractCoordinates(quakeList);

  // GeoJSONに変換
  const geojsonData = GeoJSON.parse(formattedData, {
    Point: ["latitude", "longitude"],
  });

  console.log(JSON.stringify(geojsonData, null, 2));
  return geojsonData; // GeoJSONデータを返す
};

// 関数を実行してGeoJSONデータを取得
convertToGeoJSONAndPrint();

// Mapboxのアクセストークンを設定
mapboxgl.accessToken =
  "pk.eyJ1IjoibmFrYWhpcm8iLCJhIjoiY2xudHk2d2NhMDZuejJpcXhrYzRjZGh1cSJ9.85G_WO7bJpSqDCL7c9pFCw";

// Mapboxのマップを初期化
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  projection: "globe" as any,
  center: [139.76, 35.68],
  zoom: 5,
});

// 地図がロードされたらGeoJSONデータを追加
map.on("load", async () => {
  const geojsonData = await convertToGeoJSONAndPrint();
  if (!geojsonData) {
    console.error("GeoJSONデータが取得できませんでした。");
    return;
  }

  // 地図に地震データのソースを追加
  map.addSource("earthquakes", {
    type: "geojson",
    data: geojsonData,
  });

  // 地図に地震データを表示するレイヤーを追加
  map.addLayer({
    id: "earthquakes",
    type: "circle",
    source: "earthquakes",
    paint: {
      "circle-radius": 10,
      "circle-color": "#B42222",
    },
  });

  // 初期フィルタリングを適用
  filterEarthquakesByMagnitude(0);
});
