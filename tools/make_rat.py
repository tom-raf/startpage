"""Pixel-art rat cook GIF for the start page header.

Drawn at 83x45 pixels and scaled up 3x by CSS (image-rendering: pixelated).
Three rounds: fetch an ingredient from the fridge, chop it, fry it, flip it onto the plate.
"""
from PIL import Image

W, H = 83, 45
DY = 5  # the scene was drawn for 40 rows; extra wall goes on top
PAL = {
    "K": (35, 42, 68),     # ink outline
    "G": (150, 148, 156),  # rat grey
    "g": (118, 116, 126),  # rat shade
    "P": (226, 150, 150),  # pink
    "W": (250, 248, 240),  # apron white
    "B": (47, 95, 168),    # blue
    "O": (224, 123, 42),   # carrot
    "o": (240, 160, 80),   # carrot piece
    "r": (200, 58, 48),    # tomato
    "e": (232, 104, 84),   # tomato piece
    "c": (70, 135, 65),    # cucumber
    "C": (170, 205, 125),  # cucumber piece
    "L": (70, 140, 80),    # leaf green
    "D": (185, 138, 90),   # wood
    "d": (140, 98, 60),    # wood dark
    "b": (218, 186, 136),  # board
    "S": (60, 64, 82),     # pan
    "s": (95, 100, 120),   # pan rim
    "F": (232, 120, 40),   # flame
    "Y": (245, 196, 80),   # flame tip
    "M": (205, 200, 192),  # steam
    "X": (200, 205, 215),  # knife blade
    "R": (193, 122, 63),   # copper
    "q": (240, 238, 232),  # fridge
    "Q": (200, 197, 190),  # fridge shade
    "i": (196, 214, 226),  # fridge inside
    "t": (236, 228, 212),  # tile
    "T": (218, 207, 186),  # tile line
    "v": (176, 204, 236),  # sky
    "w": (255, 255, 255),  # plate
}

RAT = [
    "...KK.KK......",
    "..KPPKPPK.....",
    "..KPPKPPK.....",
    "..KGGGGGGK....",
    ".KGGGGGGGGKK..",
    ".KGGGGGKGGGGK.",
    ".KgGGGGGGGGGPK",
    "..KgGGGGGGKK..",
    "...KgGGGGK....",
    "..KBBBBBBBK...",
    "..KBWWWWWBK...",
    "..KBWWWWWBK...",
    "..KBWWWWWBK...",
    "..KBBBBBBBK...",
    "...KGGGGGK....",
    "...KPK.KPK....",
    "...KK...KK....",
]
WALK_LEGS = ["..KPK...KPK...", "..KK.....KK..."]
BLINK = ".KGGGGGGGGGGK."
RW = len(RAT[0])
RAT_Y = 14  # feet rest on the counter / floor line at y=30

FRIDGE_X1 = 13
BOARD = (17, 33)
PAN = (55, 64)
PLATE = (69, 75)

INGREDIENTS = [
    # name, body colour, piece colour, leaf colour
    ("carrot", "O", "o", "L"),
    ("tomato", "r", "e", "L"),
    ("cucumber", "c", "C", "c"),
]


class Frame:
    def __init__(self):
        self.px = {}

    def put(self, x, y, c):
        y += DY
        if 0 <= x < W and 0 <= y < H and c != ".":
            self.px[(x, y)] = c

    def rect(self, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.put(x, y, c)

    def image(self):
        img = Image.new("P", (W, H))
        names = ["."] + list(PAL)
        flat = [255, 0, 255] + [v for k in PAL for v in PAL[k]]
        img.putpalette(flat + [0] * (768 - len(flat)))
        for (x, y), c in self.px.items():
            img.putpixel((x, y), names.index(c))
        return img


def kitchen(f, t, fridge_open, plate_food, flames_on=True):
    # tiled backsplash
    f.rect(FRIDGE_X1 + 1, 19, W - 1, 30, "t")
    for y in (19, 23, 27):
        f.rect(FRIDGE_X1 + 1, y, W - 1, y, "T")
    for y0 in (19, 23, 27):
        off = 0 if (y0 // 4) % 2 else 3
        for x in range(FRIDGE_X1 + 1 + off, W, 6):
            f.rect(x, y0, x, y0 + 3, "T")
    # window
    f.rect(47, 2, 63, 14, "K")
    f.rect(48, 3, 62, 13, "v")
    f.rect(55, 3, 55, 13, "K")
    f.rect(48, 8, 62, 8, "K")
    f.put(51 + (t // 6) % 3, 5, "w"); f.put(52 + (t // 6) % 3, 5, "w"); f.put(52 + (t // 6) % 3, 4, "w")
    # shelf with jars
    f.rect(19, 11, 40, 11, "d")
    for x, col in ((21, "R"), (26, "B"), (31, "L"), (36, "o")):
        f.rect(x, 7, x + 2, 10, col)
        f.rect(x, 6, x + 2, 6, "K")
    # hanging spoon and whisk
    f.rect(66, 1, 73, 1, "K")
    f.rect(68, 2, 68, 7, "R"); f.rect(67, 8, 69, 9, "R")
    f.rect(71, 2, 71, 5, "K"); f.rect(70, 6, 72, 9, "X")
    # counter
    f.rect(FRIDGE_X1 + 1, 31, W - 1, 31, "K")
    f.rect(FRIDGE_X1 + 1, 32, W - 1, 39, "D")
    for x in range(FRIDGE_X1 + 1, W, 15):
        f.rect(x, 32, x, 39, "d")
    f.rect(FRIDGE_X1 + 1, 35, W - 1, 35, "d")
    # fridge, standing on the floor next to the counter
    f.rect(0, 6, FRIDGE_X1, 39, "K")
    f.rect(1, 31, FRIDGE_X1 - 1, 38, "q")
    f.rect(1, 35, FRIDGE_X1 - 1, 35, "Q")
    if fridge_open:
        f.rect(1, 7, FRIDGE_X1 - 3, 29, "i")
        f.rect(1, 15, FRIDGE_X1 - 3, 15, "Q")
        f.rect(1, 22, FRIDGE_X1 - 3, 22, "Q")
        f.rect(2, 13, 4, 14, "O"); f.rect(6, 13, 8, 14, "r")
        f.rect(2, 20, 5, 21, "c"); f.rect(7, 19, 8, 21, "w")
        f.rect(2, 27, 4, 29, "B"); f.rect(6, 28, 9, 29, "Y")
        # open door seen edge-on on the right
        f.rect(FRIDGE_X1 - 2, 7, FRIDGE_X1, 29, "Q")
    else:
        f.rect(1, 7, FRIDGE_X1 - 1, 29, "q")
        f.rect(1, 16, FRIDGE_X1 - 1, 16, "K")
        f.rect(FRIDGE_X1 - 3, 10, FRIDGE_X1 - 3, 13, "Q")
        f.rect(FRIDGE_X1 - 3, 19, FRIDGE_X1 - 3, 24, "Q")
        f.put(4, 10, "B"); f.put(5, 10, "r")  # magnets
    # cutting board
    f.rect(BOARD[0], 29, BOARD[1], 30, "b")
    f.rect(BOARD[0], 30, BOARD[1], 30, "d")
    # stove and pan
    f.rect(PAN[0] - 1, 30, PAN[1] + 1, 30, "K")
    for i, x in enumerate(range(PAN[0], PAN[1] + 1, 2)):
        f.put(x, 29, "F" if flames_on else "K")
        if flames_on and (i + t) % 2 == 0:
            f.put(x, 28, "Y")
    f.rect(PAN[0], 24, PAN[1], 27, "S")
    f.rect(PAN[0], 24, PAN[1], 24, "s")
    f.rect(PAN[1] + 1, 25, PAN[1] + 3, 25, "K")
    # salt and pepper on the end of the counter
    f.rect(77, 27, 78, 30, "w"); f.rect(77, 26, 78, 26, "K")
    f.rect(80, 27, 81, 30, "S"); f.rect(80, 26, 81, 26, "K")
    # plate with the food made so far
    f.rect(PLATE[0], 30, PLATE[1], 30, "w")
    f.rect(PLATE[0] + 1, 30, PLATE[1] - 1, 30, "Q")
    f.rect(PLATE[0], 29, PLATE[1], 29, "w")
    for i, col in enumerate(plate_food):
        for j in range(3):
            f.put(PLATE[0] + 1 + (i * 2 + j) % 5, 28 - (i * 3 + j) // 5, col)


def rat(f, ox, facing, t, walking=False, blink=False, oy=RAT_Y):
    rows = list(RAT)
    if blink:
        rows[5] = BLINK
    if walking and t % 2:
        rows[15], rows[16] = WALK_LEGS
    for y, row in enumerate(rows):
        for x, c in enumerate(row):
            f.put(ox + (x if facing > 0 else RW - 1 - x), oy + y, c)
    tx = ox - 1 if facing > 0 else ox + RW
    d = -facing
    for px, py in [(0, 13), (d, 14), (2 * d, 14), (3 * d, 13), (3 * d + (d if t % 2 else 0), 12)]:
        f.put(tx + px, oy + py, "P")


def arm(f, ox, facing, pts, oy=RAT_Y):
    """Points in right-facing sprite coords; the last one is the paw. Returns the paw's world x, y."""
    for i, (x, y) in enumerate(pts):
        f.put(ox + (x if facing > 0 else RW - 1 - x), oy + y, "P" if i == len(pts) - 1 else "G")
    x, y = pts[-1]
    return ox + (x if facing > 0 else RW - 1 - x), oy + y


def ingredient_on_board(f, ing, amount):
    """Whole ingredient on the board, right end fixed at x=29, shrinking from the right."""
    name, body, _, leaf = ing
    right = 29
    left = right - amount + 1
    if amount <= 0:
        return
    if name == "carrot":
        f.rect(left, 27, right, 28, body)
        f.put(right, 27, "."), f.put(left - 1, 28, body)
        f.put(left - 2, 26, leaf); f.put(left - 2, 28, leaf); f.put(left - 3, 27, leaf)
    elif name == "tomato":
        f.rect(left, 26, right, 28, body)
        f.put(left, 26, "b"); f.put(left, 28, "b")
        f.put(left + amount // 2, 25, leaf)
    else:
        f.rect(left, 27, right, 28, body)
        f.rect(left, 27, right, 27, "C")
        f.put(left - 1, 28, body)


def held_item(f, x, y, ing):
    _, body, _, leaf = ing
    f.rect(x, y, x + 2, y + 1, body)
    f.put(x + 3, y, leaf)


def steam(f, t):
    for x, start in ((57, 0), (60, 3), (63, 6)):
        age = (t + start) % 9
        if age < 7:
            f.put(x + (1 if age % 4 in (1, 2) else 0), 22 - age, "M")


frames, durations = [], []


def add(f, ms):
    frames.append(f)
    durations.append(ms)


def round_frames(ing, plate_before):
    clock = len(frames)
    _, body, piece, _ = ing

    def base(t, fridge_open=False, plate=plate_before):
        f = Frame()
        kitchen(f, clock + t, fridge_open, plate)
        return f

    t = 0
    # 1. walk from the stove to the fridge
    for ox in range(40, 15, -3):
        f = base(t)
        rat(f, ox, -1, t, walking=True)
        arm(f, ox, -1, [(10, 10), (11, 11)])
        add(f, 110); t += 1
    # 2. open the fridge, reach in, take the ingredient
    for step in range(4):
        f = base(t, fridge_open=step > 0)
        rat(f, 15, -1, t, blink=step == 2)
        if step in (1, 2):
            arm(f, 15, -1, [(10, 10), (11, 9), (12, 9), (13, 8)])
        else:
            px, py = arm(f, 15, -1, [(10, 10), (11, 10), (12, 10)])
            if step == 3:
                held_item(f, px - 3, py - 2, ing)
        add(f, 260 if step == 2 else 180); t += 1
    # 3. walk back to the board carrying it
    for ox in range(18, 32, 3):
        f = base(t)
        rat(f, ox, 1, t, walking=True)
        px, py = arm(f, ox, 1, [(10, 10), (11, 10), (12, 9)])
        held_item(f, px + 1, py - 2, ing)
        add(f, 110); t += 1
    # 4. chop: knife at x=30, ingredient slides right after each cut
    amount, pieces = 8, 0
    for chop in range(4):
        for down in (False, True):
            f = base(t)
            ingredient_on_board(f, ing, amount)
            for i in range(pieces):
                f.put(BOARD[0] + 1 + i % 4, 28 - i // 4, piece)
            rat(f, 31, -1, t)
            if down:
                arm(f, 31, -1, [(10, 10), (11, 11), (12, 12), (13, 12)])
                f.rect(30, 24, 30, 28, "X")
                f.put(31, 25, "K")
            else:
                arm(f, 31, -1, [(10, 10), (11, 9), (12, 8), (13, 8)])
                f.rect(30, 18, 30, 22, "X")
                f.put(31, 21, "K")
            add(f, 150 if down else 190); t += 1
        amount -= 2
        pieces += 2
    # 5. scoop the pieces and carry them to the pan
    for ox in range(31, 41, 3):
        f = base(t)
        rat(f, ox, 1, t, walking=True)
        px, py = arm(f, ox, 1, [(10, 10), (11, 10), (12, 10)])
        for k in range(4):
            f.put(px + 1 + k % 2, py - 1 - k // 2, piece)
        add(f, 120); t += 1
    # 6. stir and sizzle
    food = [(57, 23), (59, 23), (61, 23), (63, 23), (58, 22), (62, 22)]
    for s in range(8):
        f = base(t)
        rat(f, 41, 1, t, blink=s == 5)
        px, py = arm(f, 41, 1, [(10, 10), (11, 10), (12, 10)])
        tip = (57, 60, 63, 60)[s % 4]
        x0, y0 = px + 1, py - 1
        n = max(abs(tip - x0), abs(23 - y0))
        for i in range(n + 1):
            f.put(round(x0 + (tip - x0) * i / n), round(y0 + (23 - y0) * i / n), "R")
        for x, y in food:
            f.put(x, y - (1 if (x + s) % 3 == 0 else 0), piece if x % 4 else body)
        steam(f, t)
        add(f, 140); t += 1
    # 7. flip it in an arc onto the plate
    arc = [(60, 18), (64, 13), (68, 12), (71, 16), (72, 22), (72, 26)]
    for i, (cx, cy) in enumerate(arc):
        f = base(t)
        rat(f, 41, 1, t)
        arm(f, 41, 1, [(10, 10), (11, 9), (12, 8)] if i < 2 else [(10, 10), (11, 10), (12, 10)])
        for dx, dy in ((0, 0), (1, 0), (-1, 1), (1, 1), (0, -1)):
            f.put(cx + dx, cy + dy, piece if (dx + dy) % 2 else body)
        steam(f, t)
        add(f, 110); t += 1
    # 8. admire the plate
    plate_after = plate_before + [piece, body]
    for s in range(3):
        f = base(t, plate=plate_after)
        rat(f, 41, 1, t, blink=s == 1, oy=RAT_Y - (1 if s == 1 else 0))
        arm(f, 41, 1, [(10, 10), (11, 9), (12, 8)], oy=RAT_Y - (1 if s == 1 else 0))
        add(f, 300); t += 1
    return plate_after


plate = []
for ing in INGREDIENTS:
    plate = round_frames(ing, plate)

imgs = [fr.image() for fr in frames]
imgs[0].save(
    "public/rat-cook.gif",
    save_all=True, append_images=imgs[1:], duration=durations, loop=0,
    transparency=0, disposal=2, optimize=False,
)

import os
print(len(imgs), "frames,", sum(durations) / 1000, "s loop,", os.path.getsize("public/rat-cook.gif"), "bytes")
