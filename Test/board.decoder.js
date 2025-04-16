function decode1(data) {
  const board = Array(30).fill(0);
  let i = 0;
  while (i < data.length) {
    const r = data.charCodeAt(i); i++;
    let rpt = 0;
    while (true) {
      const a = data.charCodeAt(i); i++;
      const b = a & 127;
      let j = 7 * rpt;
      let bb = b;
      while (bb > 0) {
        if (bb % 2 === 1) board[j] = r;
        j++;
        bb = Math.floor(bb / 2);
      }
      rpt++;
      if ((a & 128) === 0) break;
    }
  }
  return board;
}

function decode2(data) {
  const result = [];
  for (let i = 0; i < 45; i += 3) {
    const v1 = data.charCodeAt(i);
    const v2 = data.charCodeAt(i + 1);
    const v3 = data.charCodeAt(i + 2);
    result.push((v1 & 0b11111100) >> 2);
    result.push(((v1 & 0b00000011) << 4) | ((v2 & 0b11110000) >> 4));
    result.push(((v2 & 0b00001111) << 2) | ((v3 & 0b11000000) >> 6));
    result.push(v3 & 0b00111111);
  }
  return result.slice(0, 30);
}

function decodeBoardToElement(base64) {
  const decoded = atob(base64);
  const type = decoded.charCodeAt(2);
  const data = decoded.slice(6);
  const board = (type === 1 ? decode1(data) : decode2(data));

  console.log("🔍 board type =", type);
  console.log("🧩 解出棋盤 index：", board);

  board.forEach((val, i) => {
    const index = val;
    console.log("第 " + (i + 1) + " 格: board=" + val + ", 使用 icons[" + index + "]", icons[index] ? "✅ OK" : "❌ 缺圖");
  });

  const table = document.createElement('table');
  let row;
  for (let i = 0; i < board.length; i++) {
    if (i % 6 === 0) {
      row = document.createElement('tr');
      table.appendChild(row);
    }
    const td = document.createElement('td');
    const img = document.createElement('img');
    const index = board[i];
    img.src = icons[index] || icons[1];  // fallback 為 icons[1]
    img.style.width = '40px';
    img.style.height = '40px';
    td.appendChild(img);
    row.appendChild(td);
  }
  return table;
}