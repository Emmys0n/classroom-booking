// src/components/Parser.js
import React, { useState } from "react";

const Parser = () => {
  const [docUrl, setDocUrl] = useState("");

  const handleChange = (e) => setDocUrl(e.target.value);

  const handleParse = () => {
    console.log("Парсинг ссылки:", docUrl);
    // TODO: добавить логику парсинга Google Sheets API
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <h2>Ссылка на Google Таблицу</h2>
      <input
        type="text"
        placeholder="Вставьте ссылку"
        value={docUrl}
        onChange={handleChange}
        style={{ width: "60%", padding: "8px" }}
      />
      <button onClick={handleParse} style={{ marginLeft: 8, padding: "8px 16px" }}>
        Загрузить
      </button>
    </div>
  );
};

export default Parser;
