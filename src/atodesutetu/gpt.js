const GeoJSON = require("geojson");

const data = {
  acd: "550",
  anm: "和歌山県北部",
  at: "2023-11-07T18:59:00+09:00",
  cod: "+34.2+135.2+0/",
  ctt: "20231107190309",
  eid: "20231107185949",
  en_anm: "Northern Wakayama Prefecture",
  en_ttl: "Earthquake and Seismic Intensity Information",
  ift: "発表",
  int: [
    {
      city: [
        {
          code: "3020100",
          maxi: "1",
        },
      ],
      code: "30",
      maxi: "1",
    },
  ],
  json: "20231107190309_20231107185949_VXSE5k_1.json",
  mag: "2.2",
  maxi: "1",
  rdt: "2023-11-07T19:03:00+09:00",
  ser: "1",
  ttl: "震源・震度情報",
};

// Convert data to GeoJSON
const geojsonData = GeoJSON.parse(data, {
  Point: ["cod[1]", "cod[0]"], // Using the cod values as coordinates, make sure to parse them as numbers
});

console.log(JSON.stringify(geojsonData, null, 2));
