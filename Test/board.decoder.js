// board.decoder.js

function decode1(seq) {
  let p = 0;
  const len = seq.charCodeAt(p++);
  const board = [];
  while (board.length < 30) {
    const id = seq.charCodeAt(p++);
    const bits = seq.charCodeAt(p++);
    for (let i = 0; i < 8; i++) {
      if (bits & (1 << i)) {
        board.push(id);
      }
      if (board.length >= 30) break;
    }
  }
  return board;
}

function decode2(seq) {
  let p = 0;
  const len = seq.charCodeAt(p++);
  const board = new Array(30).fill(0);
  const positions = [];
  for (let i = 0; i < 30; i++) {
    const b = seq.charCodeAt(p++);
    for (let j = 0; j < 8; j++) {
      if (b & (1 << j)) {
        positions.push(i * 8 + j);
      }
    }
  }
  for (let i = 0; i < positions.length; i++) {
    board[positions[i]] = seq.charCodeAt(p++);
  }
  return board;
}

function decodeBoardToElement(base64) {
  const decoded = atob(base64);
  const type = decoded.charCodeAt(2);
  const data = decoded.slice(6);
  const board = (type === 1 ? decode1(data) : decode2(data));

  const table = document.createElement('table');
  table.style.borderSpacing = '2px';
  table.style.borderCollapse = 'separate';

  let row;
  for (let i = 0; i < board.length; i++) {
    if (i % 6 === 0) {
      row = document.createElement('tr');
      table.appendChild(row);
    }
    const td = document.createElement('td');
    const img = document.createElement('img');
    img.src = icons[board[i]] || icons[0]; // 若圖示 index 錯，就用第 0 張預設圖
    img.style.width = '40px';
    img.style.height = '40px';
    td.appendChild(img);
    row.appendChild(td);
  }
  return table;
}
