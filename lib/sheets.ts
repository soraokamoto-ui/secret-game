import { CardData } from "@/types/card";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm7hU-U6_8wW_TJLyDZuS9IMdbjF_WiguVCcHr7dUArcqWgIY4kmAdB-gTQjWq0jE0k3-cKZ_y4_jF/pub?output=csv";

// クォート内の改行も正しく扱う文字単位のCSVパーサー
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        cell += ch;
        i++;
        continue;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (ch === ",") {
        row.push(cell);
        cell = "";
        i++;
        continue;
      } else if (ch === "\r") {
        // CRは無視（\r\nの場合）
        i++;
        continue;
      } else if (ch === "\n") {
        row.push(cell);
        cell = "";
        rows.push(row);
        row = [];
        i++;
        continue;
      } else {
        cell += ch;
        i++;
        continue;
      }
    }
  }

  // 最後の行を追加
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function convertDriveUrl(url: string): string {
  if (!url) return "";
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