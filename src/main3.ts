import "mapbox-gl/dist/mapbox-gl.css";

import GeoJSON from "geojson";
import { QuakeList } from "./types";
import { map } from "./mapbox";

// マグニチュードのリストを定義
const magnitudeList = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8];

/**
 * 地震データを取得する非同期関数
 *
 * @returns データのリスト
 */
const getQuakeList = async () => {
  try {
    // APIから地震データを取得
    const res = await fetch("https://www.jma.go.jp/bosai/quake/data/list.json");
    if (!res.ok) {
      throw new Error("データの取得に失敗しました。");
    }
    // レスポンスをJSON形式で解析
    const dataList: QuakeList = await res.json();
    return dataList;
  } catch (error) {
    console.error("エラー:", error);
    return [];
  }
};

/**
 * 選択されたマグニチュードを表示する関数
 *
 * @param mag マグニチュードのリスト内の数値
 */
const filterBy = (mag = 0) => {
  // マグニチュードの値を表示するDOM要素を更新
  (document.getElementById("magnitude") as HTMLElement).textContent = String(
    magnitudeList[mag]
  );
};

/**
 * マグニチュードに基づいて地震データをフィルタリングする関数
 *
 * @param magIndex マグニチュードリストのインデックス番号
 */
const filterEarthquakesByMagnitude = (magIndex: number) => {
  // 選択されたマグニチュードに基づいてフィルタリングの範囲を設定
  const minMag = magnitudeList[magIndex];
  const maxMag =
    magIndex < magnitudeList.length - 1
      ? magnitudeList[magIndex + 1]
      : Infinity;

  // マップ上の地震データをフィルタリング
  map.setFilter("earthquakes", [
    "all",
    [">=", ["get", "mag"], minMag],
    ["<", ["get", "mag"], maxMag],
  ]);

  // マグニチュードの表示を更新
  filterBy(magIndex);
};

/**
 * 地震データから緯度と経度を抽出し、データをフォーマットする関数
 *
 * @param dataList 地震データのリスト
 * @returns GeoJSON形式に変換したオブジェクト
 */
const extractCoordinates = (dataList: QuakeList) => {
  return dataList.map((data) => {
    // 緯度と経度を抽出し、数値に変換
    const [latitude, longitude] = data.cod.split(/[\+\/]/).slice(1, 3);

    // マグニチュード（mag）を数値に変換
    const mag = parseFloat(data.mag);

    return {
      ...data,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      mag,
    };
  });
};

/**
 * 地震データをGeoJSONに変換し、コンソールに出力する関数
 *
 * @returns geojsonData GeoJsonデータ
 */
const convertToGeoJSONAndPrint = async () => {
  const quakeList = await getQuakeList();
  if (!Array.isArray(quakeList) || quakeList.length === 0) {
    console.error("有効なデータがありません");
    return null;
  }
  const formattedData = extractCoordinates(quakeList);

  // GeoJSONに変換
  const geojsonData = (GeoJSON as any).parse(formattedData, {
    Point: ["latitude", "longitude"],
  });

  console.log(JSON.stringify(geojsonData, null, 2));
  return geojsonData; // GeoJSONデータを返す
};

// getQuakeList関数を実行
getQuakeList();

// 初期マグニチュードを表示
filterBy();

// 関数を実行してGeoJSONデータを取得
convertToGeoJSONAndPrint();

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

// スライダーの値が変更された時のイベントリスナー
document.getElementById("slider")?.addEventListener("input", (e) => {
  const magIndex = parseInt((e.target as HTMLInputElement).value, 10);
  filterEarthquakesByMagnitude(magIndex);
});
