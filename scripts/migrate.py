#!/usr/bin/env python3
"""Migrate Writefreely SQLite posts to Astro Markdown files."""

import sqlite3
import re
import os
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = Path(__file__).parent.parent.parent / "scriobh/writefreely-main/writefreely.db"
OUT_DIR = Path(__file__).parent.parent / "src/content/blog"
BASE_URL = "https://eamonn.org"

# Image extensions to recognize as cover images (exclude .gif)
COVER_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".svg", ".avif"}


def find_cover_image(content: str) -> str | None:
    """Return the first non-gif image URL found in the post content."""
    # Inline: ![alt](url)
    for url in re.findall(r"!\[.*?\]\((.*?)\)", content):
        if _is_cover(url):
            return _absolutize(url)

    # Reference-style definitions: [n]: url
    for url in re.findall(r"^\[.*?\]:\s*(\S+)", content, re.MULTILINE):
        ext = os.path.splitext(url.split("?")[0])[1].lower()
        if ext in {".png", ".jpg", ".jpeg", ".webp", ".svg", ".avif", ".gif"}:
            if _is_cover(url):
                return _absolutize(url)

    return None


def _is_cover(url: str) -> bool:
    ext = os.path.splitext(url.split("?")[0])[1].lower()
    return ext in COVER_EXTS


def _absolutize(url: str) -> str:
    if url.startswith("img/"):
        return f"{BASE_URL}/{url}"
    return url


def make_excerpt(content: str, length: int = 160) -> str:
    """Strip Markdown and return plain-text excerpt."""
    # Remove reference-style linked images: [![alt][ref]][ref]
    text = re.sub(r"\[!\[.*?\]\[.*?\]\]\[.*?\]", "", content)
    # Remove reference-style images: ![alt][ref]
    text = re.sub(r"!\[.*?\]\[.*?\]", "", text)
    # Remove inline images: ![alt](url)
    text = re.sub(r"!\[.*?\]\(.*?\)", "", text)
    # Remove reference link definitions [n]: url
    text = re.sub(r"^\[.*?\]:.*$", "", text, flags=re.MULTILINE)
    # Remove link syntax, keep text
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)
    # Remove inline code and fenced code blocks
    text = re.sub(r"```.*?```", "", text, flags=re.DOTALL)
    text = re.sub(r"`[^`]+`", "", text)
    # Remove headings markers
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    # Remove bold/italic
    text = re.sub(r"\*{1,3}(.*?)\*{1,3}", r"\1", text)
    text = re.sub(r"_{1,3}(.*?)_{1,3}", r"\1", text)
    # Collapse whitespace
    text = re.sub(r"\s+", " ", text).strip()
    return text[:length].rsplit(" ", 1)[0] + "…" if len(text) > length else text


def escape_yaml_string(s: str) -> str:
    """Wrap a string in double quotes, escaping internal double quotes."""
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def format_date(dt_str: str) -> str:
    """Parse Writefreely date and return ISO 8601 date string."""
    for fmt in ("%Y-%m-%d %H:%M:%S%z", "%Y-%m-%d %H:%M:%S"):
        try:
            dt = datetime.strptime(dt_str, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    return dt_str[:10]


def migrate():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute(
        "SELECT slug, title, content, created FROM posts "
        "WHERE collection_id IS NOT NULL AND slug IS NOT NULL AND slug != '' "
        "ORDER BY created DESC"
    )
    rows = cur.fetchall()
    conn.close()

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    written = 0
    skipped = 0
    for row in rows:
        slug = row["slug"].strip()
        title = (row["title"] or "").strip()
        content = (row["content"] or "").strip()
        date = format_date(row["created"])

        if not slug:
            skipped += 1
            continue

        cover = find_cover_image(content)
        excerpt = make_excerpt(content)

        # Build YAML frontmatter
        fm_lines = [
            "---",
            f"title: {escape_yaml_string(title)}",
            f"slug: {escape_yaml_string(slug)}",
            f"date: {date}",
            f"excerpt: {escape_yaml_string(excerpt)}",
        ]
        if cover:
            fm_lines.append(f"coverImage: {escape_yaml_string(cover)}")
        fm_lines.append("---")
        fm_lines.append("")

        # Absolutize img/ references in the content body
        body = re.sub(r'(?<!\w)(img/)', f'{BASE_URL}/\\1', content)

        out_path = OUT_DIR / f"{slug}.md"
        out_path.write_text("\n".join(fm_lines) + body + "\n", encoding="utf-8")
        written += 1

    print(f"Done. Written: {written}, Skipped: {skipped}")
    print(f"Output: {OUT_DIR}")


if __name__ == "__main__":
    migrate()
