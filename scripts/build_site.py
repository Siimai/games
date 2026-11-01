from html import escape
import os
from pathlib import Path
import re
import shutil
from urllib.parse import quote


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "_site"
GAMES_SOURCE = Path(os.environ.get("GAMES_SOURCE", ROOT))
if not GAMES_SOURCE.is_absolute():
    GAMES_SOURCE = ROOT / GAMES_SOURCE
START = "<!-- GAME_LIST_START -->"
END = "<!-- GAME_LIST_END -->"

games = sorted(
    (
        folder
        for folder in GAMES_SOURCE.iterdir()
        if folder.is_dir()
        and not folder.is_symlink()
        and not folder.name.startswith(".")
        and (folder / "index.html").is_file()
    ),
    key=lambda folder: (folder.name.casefold(), folder.name),
)

if OUTPUT.exists():
    shutil.rmtree(OUTPUT)
OUTPUT.mkdir()

items = "\n".join(
    f'<li><a href="./{quote(game.name, safe="")}/">{escape(game.name)}</a></li>'
    for game in games
)
if not items:
    items = "<li>No games found yet.</li>"

template = (ROOT / "index.html").read_text(encoding="utf-8")
pattern = re.escape(START) + r".*?" + re.escape(END)
rendered, count = re.subn(
    pattern,
    lambda _: f"{START}\n        {items}\n        {END}",
    template,
    count=1,
    flags=re.DOTALL,
)
if count != 1:
    raise ValueError("The games list markers must appear exactly once in index.html")

(OUTPUT / "index.html").write_text(rendered, encoding="utf-8")
for game in games:
    shutil.copytree(game, OUTPUT / game.name)
