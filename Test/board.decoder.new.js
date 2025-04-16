function decode1(data) {
  const board = Array(30).fill(0);
  let i = 0;
  while (i < data.length) {
    const r = data.charCodeAt(i++);
    if (r < 1) continue;
    let rpt = 0;
    while (true) {
      const a = data.charCodeAt(i++);
      const b = a & 127;
      let j = 7 * rpt;
      let bb = b;
      while (bb > 0) {
        if (bb % 2) board[j] = r;
        j++;
        bb = bb >> 1;
      }
      rpt++;
      if ((a & 128) === 0) break;
    }
  }
  return board;
}

function decode2(data) {
  const c = [];
  let i = 0, rpt = 0;
  while (true) {
    const a = data.charCodeAt(i++);
    const b = a & 127;
    let j = 7 * rpt;
    let bb = b;
    while (bb > 0) {
      if (bb % 2 > 0) c.push(j);
      j++;
      bb = bb >> 1;
    }
    rpt++;
    if ((a & 128) === 0) break;
  }
  const board = Array(30).fill(0);
  let j = 0;
  while (i < data.length) {
    const r = data.charCodeAt(i++);
    if (r < 1) continue;
    let l = data.charCodeAt(i++);
    while (l-- > 0) board[c[j++]] = r;
  }
  return board;
}

function decodeBoardToElement(base64, icons) {
  try {
    const decoded = atob(base64);
    const type = decoded.charCodeAt(2);
    const data = decoded.slice(6);
    const board = type === 1 ? decode1(data) : decode2(data);

    console.log("🔍 board type =", type);
    console.log("🧩 解出棋盤 index：", board);

    const table = document.createElement('table');
    let row;
    for (let i = 0; i < board.length; i++) {
      if (i % 6 === 0) {
        row = document.createElement('tr');
        table.insertBefore(row, table.firstChild); // 下→上排列
      }
      const td = document.createElement('td');
      const img = document.createElement('img');
      const index = board[i];
      console.log(`第 ${i + 1} 格: board=${index}, 使用 icons[${index}]`, icons[index] ? "✅ OK" : "❌ 缺圖");
      img.src = icons[index] || icons[0];
      img.style.width = '40px';
      img.style.height = '40px';
      td.appendChild(img);
      row.appendChild(td);
    }

    return table;
  } catch (err) {
    console.error("❌ decodeBoardToElement error:", err);
    return document.createTextNode("❌ 無法解析棋盤");
  }
}
