export type QuakeList = {
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
