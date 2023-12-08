// src/utils/fetchPlayersData.js
async function fetchPlayersData(sheetName) {
  const baseUrl =
    "https://docs.google.com/spreadsheets/d/12MDi-2EeeIvJ1Np61YZxXDxRhcHp0kiEqrMjPur1-MM/gviz/tq";
  const url = `${baseUrl}?tqx=out:json&sheet=${sheetName}`;

  const sanitizeText = (text) =>
    text.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();

  try {
    const response = await fetch(url);
    const text = await response.text();
    const jsonText = text.match(/(?<=\().*(?=\);)/)[0];
    const data = JSON.parse(jsonText);

    const headers = [
      "Position",
      ...data.table.cols.slice(1).map((col) => sanitizeText(col.label)),
    ];
    const rows = data.table.rows;

    const players = rows.map((row) => {
      const player = {};
      row.c.forEach((cell, index) => {
        const sanitizedHeader = headers[index];
        let cellValue = cell && cell.v !== null ? cell.v : "";
        cellValue =
          typeof cellValue === "string" ? sanitizeText(cellValue) : cellValue;
        if (index === 8 && cell && cell.f) {
          player[sanitizedHeader] = sanitizeText(cell.f);
        } else {
          player[sanitizedHeader] = cellValue;
        }
      });
      return player;
    });

    return players;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default fetchPlayersData;
