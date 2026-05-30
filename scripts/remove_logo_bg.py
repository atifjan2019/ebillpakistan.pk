#!/usr/bin/env python3
"""Make the white background of the logo transparent.

Uses a flood fill from the image borders so that white areas *inside* the
logo are preserved (only the connected outer background is removed). Edge
pixels are feathered based on how white they are to avoid a hard halo.
"""
from collections import deque
from PIL import Image

SRC = "public/images/logo.png"
DST = "public/images/logo.png"

# A pixel counts as background if it's near-white.
WHITE_MIN = 230          # min channel value to be treated as "white-ish"
FEATHER_MIN = 200        # below this stays fully opaque; between -> partial alpha

im = Image.open(SRC).convert("RGBA")
w, h = im.size
px = im.load()


def is_whiteish(p):
    r, g, b, a = p
    return r >= WHITE_MIN and g >= WHITE_MIN and b >= WHITE_MIN


# Flood fill the connected background region starting from every border pixel.
visited = [[False] * w for _ in range(h)]
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if is_whiteish(px[x, y]) and not visited[y][x]:
            visited[y][x] = True
            q.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if is_whiteish(px[x, y]) and not visited[y][x]:
            visited[y][x] = True
            q.append((x, y))

bg = set()
while q:
    x, y = q.popleft()
    bg.add((x, y))
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
            if is_whiteish(px[nx, ny]):
                visited[ny][nx] = True
                q.append((nx, ny))

# Apply: background -> fully transparent. Light edge pixels adjacent to the
# background get partial alpha so the logo edge stays smooth.
removed = 0
feathered = 0
for (x, y) in bg:
    r, g, b, a = px[x, y]
    px[x, y] = (r, g, b, 0)
    removed += 1

# Feather: any kept pixel that is light AND touches the background gets a
# proportional alpha based on its brightness (whiter -> more transparent).
for y in range(h):
    for x in range(w):
        if (x, y) in bg:
            continue
        r, g, b, a = px[x, y]
        if a == 0:
            continue
        bright = min(r, g, b)
        if bright <= FEATHER_MIN:
            continue
        touches_bg = any(
            (x + dx, y + dy) in bg
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))
        )
        if touches_bg:
            # map bright in (FEATHER_MIN, 255] -> alpha (255, 0]
            t = (bright - FEATHER_MIN) / (255 - FEATHER_MIN)
            px[x, y] = (r, g, b, int(round(255 * (1 - t))))
            feathered += 1

im.save(DST)
print(f"OK removed={removed} feathered={feathered} size={w}x{h}")
