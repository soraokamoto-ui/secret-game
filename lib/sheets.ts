import { CardData } from "@/types/card";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm7hU-U6_8wW_TJLyDZuS9IMdbjF_WiguVCcHr7dUArcqWgIY4kmAdB-gTQjWq0jE0k3-cKZ_y4_jF/pub?output=csv";

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split("\n");
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cols.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    cols.push(current);
    rows.push(cols);
  }
  return rows;
}

function convertDriveUrl(url: string): string {
  if (!url) return "";
  // https://drive.google.com/file/d/FILE_ID/view... → 直接表示URLに変換
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

export async function fetchCards(): Promise<CardData[]> {
  const res = await fetch(CSV_URL, { next: { revalidate: 3600 } });
  const text = await res.text();
  const rows = parseCSV(text);

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const dataRows = rows.slice(1);

  return dataRows
    .filter((row) => row.some((cell) => cell.trim()))
    .map((row) => {
      const get = (key: string) => (row[headers.indexOf(key)] ?? "").trim();
      return {
        id: Number(get("no.")) || 0,
        name: get("カード名"),
        sign: get("sign"),
        secretMessage: get("secret message"),
        mission: get("mission"),
        question: get("question"),
        imageUrl: convertDriveUrl(get("imageurl")),
      };
    })
    .filter((c) => c.name);
}