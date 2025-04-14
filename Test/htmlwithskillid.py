from bs4 import BeautifulSoup
import json

# === 載入 HTML, tos_char.json, skilldesc.json ===
with open("monster_gallery.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

with open("tos_char.json", "r", encoding="utf-8") as f:
    tos_char = json.load(f)

with open("skilldesc.json", "r", encoding="utf-8") as f:
    skilldesc = json.load(f)

# === 建立 monsterid -> [normalskill1, normalskill2] 映射表 ===
monster_skill_map = {}
for char in tos_char:
    if isinstance(char.get("monsterid"), int):
        monster_id_str = str(char["monsterid"]).zfill(4)
        skill1 = str(char.get("normalskill1", "")).strip()
        skill2 = str(char.get("normalskill2", "")).strip()
        skills = [s for s in [skill1, skill2] if s]
        if skills:
            monster_skill_map[monster_id_str] = skills

# === 修改 HTML：新增 data-normalskill-id（用逗號分隔多個技能） ===
for div in soup.find_all("div", class_="monster"):
    monster_id = div.get("data-id")
    if monster_id in monster_skill_map:
        skills = monster_skill_map[monster_id]
        div["data-normalskill-id"] = ",".join(skills)

# === 輸出修改後 HTML ===
with open("monster_gallery_with_skillids.html", "w", encoding="utf-8") as f:
    f.write(soup.prettify())

# === 輸出 skilldesc.js（給前端使用） ===
skill_js_obj = {k: v for k, v in skilldesc.items() if k.isdigit()}
with open("skilldesc.js", "w", encoding="utf-8") as f:
    f.write("const skilldesc = ")
    json.dump(skill_js_obj, f, ensure_ascii=False, indent=2)
    f.write(";")
