#!/usr/bin/env python3
"""Convert ToV-Players-Guide.pdf (two-column) into a single-column HTML file."""
import fitz, base64, html, hashlib, io, sys

SRC = "ToV-Players-Guide.pdf"
OUT = "ToV-Players-Guide.html"

PAGE_W, PAGE_H = 612.0, 792.0
MID = PAGE_W / 2
FOOTER_Y = 748          # drop lines below this (running footer / page no.)
HEADER_Y = 30           # drop lines above this
MAX_IMG_DIM = 1000      # downscale images so longest side <= this
JPEG_Q = 72

doc = fitz.open(SRC)
PAGES = range(doc.page_count)
if len(sys.argv) > 1:                       # optional page range for testing: start end
    a = int(sys.argv[1]); b = int(sys.argv[2]); PAGES = range(a, b)

# ---- precompute how many pages each image xref appears on (repeated = decorative) ----
xref_pages = {}
for pno in range(doc.page_count):
    for im in doc[pno].get_images(full=True):
        xref_pages[im[0]] = xref_pages.get(im[0], 0) + 1

img_cache = {}   # xref -> data URI (so identical art embeds once)

def font_class(font, size):
    f = font
    if "ModestoPoster" in f and size >= 22:        return "h1"
    if "Modesto" in f and size >= 28:              return "h1"  # chapter title
    if "Modesto" in f and size >= 15:              return "h2"  # section head
    if "Modesto" in f and size >= 10.5:            return "h3"  # subsection / callout title
    if "SegoeUIBlack" in f:                        return "h4"  # sidebar header
    if f.startswith("SegoeUI") and ("Semibold" in f or "Bold" in f) and size >= 10.5:
        return "h3"                                             # bold subheading
    if f.startswith("SegoeUI"):                    return "side"
    return "body"

def is_bold(font):
    return any(k in font for k in ("-Bd", "Bold", "Semibold", "Black"))
def is_ital(font):
    return "It" in font or "Italic" in font

BULLET_CHARS = "\t •◦‣· "

def strip_bullet(spans):
    """Return a copy of spans with a leading bullet/tab/space prefix removed."""
    spans = [dict(s) for s in spans]
    while spans:
        t = spans[0]["text"]
        stripped = t.lstrip(BULLET_CHARS)
        if stripped != t:
            spans[0]["text"] = stripped
            if stripped == "":
                spans.pop(0); continue
        break
    return spans

def spans_html(spans):
    # coalesce consecutive spans sharing the same bold/italic state
    runs = []
    for s in spans:
        b, i = is_bold(s["font"]), is_ital(s["font"])
        if runs and runs[-1][1] == b and runs[-1][2] == i:
            runs[-1][0] += s["text"]
        else:
            runs.append([s["text"], b, i])
    out = []
    for text, b, i in runs:
        t = html.escape(text)
        if not t.strip() and not out:
            continue
        if b: t = f"<strong>{t}</strong>"
        if i: t = f"<em>{t}</em>"
        out.append(t)
    return "".join(out).strip()

def embed_image(page, xref, rect):
    if xref in img_cache:
        return img_cache[xref]
    try:
        pix = fitz.Pixmap(doc, xref)
        if pix.alpha or (pix.n - pix.alpha) not in (1, 3):  # gray/RGB only for jpeg
            pix = fitz.Pixmap(fitz.csRGB, pix)
        # downscale by integer halving until longest side <= MAX_IMG_DIM
        while max(pix.width, pix.height) > MAX_IMG_DIM * 2:
            pix.shrink(1)
        data = pix.tobytes("jpeg", jpg_quality=JPEG_Q)
        uri = "data:image/jpeg;base64," + base64.b64encode(data).decode()
    except Exception:
        return None
    img_cache[xref] = uri
    return uri

def extract_table(page, t):
    """Re-extract a detected table by bucketing words into columns by x-position.
    PyMuPDF's own extract() collapses alternate rows on these gridless tables."""
    cells = [c for c in t.cells if c]
    if not cells:
        return t.extract()
    xedges = sorted(set([round(c[0], 1) for c in cells] +
                        [round(c[2], 1) for c in cells]))
    cols = list(zip(xedges, xedges[1:]))
    if len(cols) < 1:
        return t.extract()
    ybands = sorted(set((round(c[1], 1), round(c[3], 1)) for c in cells))
    tb = fitz.Rect(t.bbox)
    words = [w for w in page.get_text("words") if fitz.Rect(w[:4]).intersects(tb)]
    rows = []
    for y0, y1 in ybands:
        rw = [w for w in words if y0 - 1 <= (w[1] + w[3]) / 2 <= y1 + 1]
        if not rw:
            continue
        rc = [""] * len(cols)
        for w in sorted(rw, key=lambda w: w[0]):
            cx = (w[0] + w[2]) / 2
            ci = len(cols) - 1
            for i, (a, b) in enumerate(cols):
                if a - 1 <= cx <= b + 1:
                    ci = i; break
            rc[ci] = (rc[ci] + " " + w[4]).strip()
        if any(c.strip() for c in rc):
            rows.append(rc)
    return rows or t.extract()

def collect_elements(page, pno):
    elements = []   # each: dict(kind, bbox, ...)

    # --- tables ---
    table_rects = []
    try:
        tabs = page.find_tables()
        for t in tabs.tables:
            rows = extract_table(page, t)
            if not rows: continue
            r = fitz.Rect(t.bbox)
            table_rects.append(r)
            elements.append({"kind": "table", "bbox": tuple(t.bbox), "rows": rows})
    except Exception:
        pass

    def in_table(x, y):
        return any(r.contains(fitz.Point(x, y)) for r in table_rects)

    # --- text lines (collect first so images can test overlap) ---
    line_items = []
    for blk in page.get_text("dict")["blocks"]:
        if blk["type"] != 0: continue
        for ln in blk["lines"]:
            spans = [s for s in ln["spans"] if s["text"]]
            if not spans: continue
            x0, y0, x1, y1 = ln["bbox"]
            cy = (y0 + y1) / 2; cx = (x0 + x1) / 2
            if y0 >= FOOTER_Y or y1 <= HEADER_Y:   # footer/header
                continue
            if in_table(cx, cy):                    # belongs to a table
                continue
            txt = "".join(s["text"] for s in spans)
            if not txt.strip(): continue
            fc = font_class(spans[0]["font"], round(spans[0]["size"], 1))
            line_items.append({"bbox": (x0, y0, x1, y1), "cx": cx, "cy": cy,
                               "fc": fc, "spans": spans, "text": txt,
                               "blk": blk["number"]})

    # --- images ---
    for im in page.get_images(full=True):
        xref = im[0]
        if xref_pages.get(xref, 0) > 8:        # repeated decorative element
            continue
        for rect in page.get_image_rects(xref):
            w, h = rect.width, rect.height
            if w < 8 or h < 8: continue
            area = w * h
            page_area = PAGE_W * PAGE_H
            # skip if any text line sits ON the image -> it's a background/box
            has_text_on = any(rect.contains(fitz.Point(li["cx"], li["cy"]))
                              for li in line_items)
            if has_text_on:
                continue
            if area > 0.62 * page_area and (rect.x0 < 5 or rect.y0 < 5):
                # full-bleed background with no text detected; keep only if it
                # looks like real art (skip near-page-size frames)
                if area > 0.92 * page_area:
                    continue
            aspect = max(w / h, h / w)
            if aspect > 7 and min(w, h) < 60:   # thin rule/border
                continue
            uri = embed_image(page, xref, rect)
            if not uri: continue
            elements.append({"kind": "image", "bbox": tuple(rect), "uri": uri})

    # add text lines as elements
    for li in line_items:
        elements.append({"kind": "line", **li})

    return elements

def column_order(elements):
    """Single-column reading order: left col, right col, full-width flushes."""
    elements = sorted(elements, key=lambda e: (e["bbox"][1], e["bbox"][0]))
    left, right, out = [], [], []
    def flush():
        for buf in (left, right):
            buf.sort(key=lambda e: (e["bbox"][1], e["bbox"][0]))
            out.extend(buf)
        left.clear(); right.clear()
    TOL = 18
    for e in elements:
        x0, y0, x1, y1 = e["bbox"]
        cx = (x0 + x1) / 2
        full = x0 < MID - TOL and x1 > MID + TOL
        if full:
            flush(); out.append(e)
        elif cx < MID:
            left.append(e)
        else:
            right.append(e)
    flush()
    return out

def render(ordered):
    """Turn ordered elements into HTML, grouping paragraphs/lists/asides."""
    html_parts = []
    para = []        # accumulating body spans-lines
    para_y = None
    list_open = False
    aside_open = False
    aside_title = None
    aside_blocks = []   # finished <p> strings collected while a callout is open
    pending = None      # a small heading (h3/h4) held until we see what follows it

    import re as _re
    def _textlen(blocks):
        return sum(len(_re.sub("<[^>]+>", "", b)) for b in blocks)

    def close_para():
        nonlocal para, para_y
        if para:
            block = "<p>" + " ".join(para) + "</p>"
            (aside_blocks if aside_open else html_parts).append(block)
            para = []; para_y = None
    def close_list():
        nonlocal list_open
        if list_open:
            html_parts.append("</ul>"); list_open = False
    def close_aside():
        nonlocal aside_open, aside_title, aside_blocks
        if not aside_open:
            return
        close_para()
        # only box it if it has a title or enough text; else emit as plain paragraphs
        if aside_title or _textlen(aside_blocks) >= 60 or len(aside_blocks) >= 2:
            head = f"<h4>{html.escape(aside_title)}</h4>\n" if aside_title else ""
            html_parts.append("<aside>\n" + head + "\n".join(aside_blocks) + "\n</aside>")
        else:
            html_parts.extend(aside_blocks)
        aside_open = False; aside_title = None; aside_blocks = []
    def flush_pending():
        # a held heading turned out NOT to start a callout -> emit normally
        nonlocal pending
        if pending:
            close_para(); close_list(); close_aside()
            lvl, t = pending
            html_parts.append(f"<{lvl}>{html.escape(t)}</{lvl}>")
            pending = None

    prev_bottom = None
    for e in ordered:
        k = e["kind"]
        if k == "image":
            flush_pending(); close_para(); close_list(); close_aside()
            html_parts.append(f'<figure><img src="{e["uri"]}" alt=""></figure>')
            prev_bottom = e["bbox"][3]; continue
        if k == "table":
            flush_pending(); close_para(); close_list(); close_aside()
            html_parts.append(render_table(e["rows"]))
            prev_bottom = e["bbox"][3]; continue

        fc = e["fc"]; text = e["text"]; y0 = e["bbox"][1]
        t = text.strip()

        # ---- sidebar / callout body (SegoeUI) ----
        if fc == "side":
            if not aside_open:
                close_para(); close_list()
                aside_open = True
                aside_title = pending[1] if pending else None
                pending = None
            inner = spans_html(e["spans"])
            gap = prev_bottom is not None and (y0 - prev_bottom) > 6
            if gap or para_y is None:
                close_para(); para.append(inner); para_y = y0
            else:
                para.append(inner)
            prev_bottom = e["bbox"][3]; continue

        # any non-side content ends an open callout
        close_aside()

        # ---- headings ----
        if fc in ("h1", "h2", "h3", "h4"):
            if not (t and any(ch.isalpha() for ch in t)):   # skip decorative numbers
                prev_bottom = e["bbox"][3]; continue
            if len(t) <= 2 and fc in ("h1", "h2"):           # A/B/C glossary dividers
                fc = "h3"
            if fc in ("h1", "h2"):
                flush_pending(); close_para(); close_list()
                html_parts.append(f"<{fc}>{html.escape(t)}</{fc}>")
            else:
                # small heading: hold it; it becomes a callout title only if the
                # next element is sidebar text, else it is a normal subheading
                flush_pending()
                pending = (fc, t)
            prev_bottom = e["bbox"][3]; continue

        # real body content arrived: any held heading is a normal subheading
        flush_pending()

        # ---- body / bullets ----
        raw = text.replace("\t", " ").strip()
        is_bullet = (raw[:1] in BULLET_CHARS.strip()) or raw.startswith("- ")
        if is_bullet:
            inner = spans_html(strip_bullet(e["spans"]))
        else:
            inner = spans_html(e["spans"]).lstrip()
        if is_bullet:
            close_para()
            if not list_open:
                html_parts.append("<ul>"); list_open = True
            html_parts.append(f"<li>{inner}</li>")
        else:
            if list_open:
                # continuation of a bullet (wrapped line) -> append to last li
                if html_parts and html_parts[-1].startswith("<li>"):
                    html_parts[-1] = html_parts[-1][:-5] + " " + inner + "</li>"
                else:
                    close_list()
                    para.append(inner); para_y = y0
            else:
                gap = prev_bottom is not None and (y0 - prev_bottom) > 7
                if gap:
                    close_para()
                if not para: para_y = y0
                para.append(inner)
        prev_bottom = e["bbox"][3]

    flush_pending(); close_para(); close_list(); close_aside()
    return "\n".join(html_parts)

def render_table(rows):
    out = ["<table>"]
    for ri, row in enumerate(rows):
        cells = [c if c is not None else "" for c in row]
        tag = "th" if ri == 0 else "td"
        out.append("<tr>" + "".join(
            f"<{tag}>{html.escape(str(c)).strip()}</{tag}>" for c in cells) + "</tr>")
    out.append("</table>")
    return "\n".join(out)

# ---------------- main ----------------
body = []
for pno in PAGES:
    page = doc[pno]
    els = collect_elements(page, pno)
    ordered = column_order(els)
    body.append(f'<section class="page" id="p{pno+1}" data-page="{pno+1}">')
    body.append(render(ordered))
    body.append("</section>")
    if (pno + 1) % 25 == 0:
        print(f"  ...page {pno+1}", file=sys.stderr)

CSS = """
:root{--fg:#1c1208;--muted:#6b5a42;--rule:#d8c7a8;--bg:#fbf7ef;--accent:#7a2e1d}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);
  font:18px/1.6 Georgia,'Iowan Old Style',serif;}
.wrap{max-width:46rem;margin:0 auto;padding:2rem 1.25rem 6rem;}
h1,h2,h3,h4{font-family:'Trebuchet MS','Segoe UI',sans-serif;line-height:1.2;
  color:var(--accent);}
h1{font-size:2.1rem;margin:3rem 0 1rem;border-bottom:3px solid var(--accent);padding-bottom:.3rem}
h2{font-size:1.55rem;margin:2.2rem 0 .6rem}
h3{font-size:1.2rem;margin:1.6rem 0 .4rem}
h4{font-size:1rem;margin:1.2rem 0 .3rem;letter-spacing:.04em;text-transform:uppercase}
p{margin:0 0 1rem}
ul{margin:0 0 1rem 1.2rem;padding:0}
li{margin:.2rem 0}
figure{margin:1.5rem 0;text-align:center}
img{max-width:100%;height:auto;border-radius:4px;box-shadow:0 1px 6px rgba(0,0,0,.18)}
aside{background:#f3ead8;border:1px solid var(--rule);border-left:4px solid var(--accent);
  border-radius:6px;padding:.8rem 1.1rem;margin:1.5rem 0;font-size:.95em}
aside h4{margin-top:.2rem;color:var(--accent)}
table{border-collapse:collapse;width:100%;margin:1.2rem 0;font-size:.92em}
th,td{border:1px solid var(--rule);padding:.35rem .6rem;text-align:left}
th{background:#efe2c8}
tr:nth-child(even) td{background:#f6efe1}
.page{}
hr{border:0;border-top:1px solid var(--rule);margin:0}
@media (prefers-color-scheme:dark){
 :root{--fg:#e8ddca;--muted:#b3a482;--rule:#4a3c28;--bg:#1a140d;--accent:#e0916f}
 aside{background:#241c12}th{background:#2c2316}tr:nth-child(even) td{background:#221a10}
 img{box-shadow:0 1px 6px rgba(0,0,0,.5)}
}
"""

doc_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tales of the Valiant — Player's Guide (single column)</title>
<style>{CSS}</style>
</head>
<body>
<main class="wrap">
{''.join(body)}
</main>
</body>
</html>
"""

with open(OUT, "w", encoding="utf-8") as f:
    f.write(doc_html)
print(f"wrote {OUT}: {len(doc_html)/1e6:.1f} MB, images embedded: {len(img_cache)}",
      file=sys.stderr)
