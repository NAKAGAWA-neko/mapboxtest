import * as d3 from "d3";

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

const getQuakeList = async () => {
  const res = await fetch("https://www.jma.go.jp/bosai/quake/data/list.json");
  const dataList: QuakeList = await res.json();
  const aboveThreeList = dataList.filter((data) => Number(data.mag) >= 3.5);
  console.log(aboveThreeList);
};
getQuakeList();

const magnitudeList = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8];

const filterBy = (mag = 0) => {
  (document.getElementById("magnitude") as any).textContent =
    magnitudeList[mag];
};
filterBy();

document.getElementById("slider")?.addEventListener("input", (e) => {
  const mag = parseInt((e.target as HTMLInputElement).value, 10);
  filterBy(mag);
});
