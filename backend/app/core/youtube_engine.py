import json
import subprocess
import time
from typing import Any, Dict, List, Optional


class YouTubeEngine:
    def __init__(self):
        self.last_request_time: float = 0.0
        self.rate_limit_delay: float = 0.5

    def _rate_limit(self) -> None:
        """Simple rate limiting simulation."""
        elapsed = time.time() - self.last_request_time
        if elapsed < self.rate_limit_delay:
            time.sleep(self.rate_limit_delay - elapsed)
        self.last_request_time = time.time()

    def _run_yt_dlp(
        self,
        args: List[str],
        timeout: int = 60,
        fallback: bool = True,
    ) -> str:
        """Run yt-dlp with the given arguments and return stdout.

        Tries with cookies first, then without, then with no-check-certificate.
        """
        self._rate_limit()
        base_cmd = ["yt-dlp", "--no-warnings", "--skip-download"]

        # Primary attempt: with cookies from firefox and extractor args
        primary = base_cmd + [
            "--cookies-from-browser", "firefox",
            "--extractor-args", "youtube:player-client=web",
        ] + args
        try:
            result = subprocess.run(
                primary,
                capture_output=True,
                text=True,
                timeout=timeout,
            )
            if result.returncode == 0:
                return result.stdout
        except subprocess.TimeoutExpired:
            raise TimeoutError("yt-dlp command timed out.")
        except Exception:
            pass

        if not fallback:
            stderr = result.stderr if "result" in dir() else "unknown error"
            raise RuntimeError(f"yt-dlp failed: {stderr}")

        # Fallback 1: without cookies
        fallback1 = base_cmd + args
        try:
            result = subprocess.run(
                fallback1,
                capture_output=True,
                text=True,
                timeout=timeout,
            )
            if result.returncode == 0:
                return result.stdout
        except subprocess.TimeoutExpired:
            raise TimeoutError("yt-dlp command timed out.")
        except Exception:
            pass

        # Fallback 2: no-check-certificate
        fallback2 = base_cmd + ["--no-check-certificate"] + args
        try:
            result = subprocess.run(
                fallback2,
                capture_output=True,
                text=True,
                timeout=timeout,
            )
            if result.returncode == 0:
                return result.stdout
        except subprocess.TimeoutExpired:
            raise TimeoutError("yt-dlp command timed out.")
        except Exception:
            pass

        stderr = result.stderr if "result" in dir() else "unknown error"
        raise RuntimeError(f"yt-dlp failed after fallbacks: {stderr}")

    def _parse_json_lines(self, stdout: str) -> List[Dict[str, Any]]:
        """Parse newline-delimited JSON output from yt-dlp."""
        entries = []
        for line in stdout.strip().splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                entries.append(json.loads(line))
            except json.JSONDecodeError:
                continue
        return entries

    def _clean_video_entry(self, entry: Dict[str, Any]) -> Dict[str, Any]:
        """Return a consistent, clean video metadata dict."""
        return {
            "id": entry.get("id"),
            "title": entry.get("title"),
            "url": entry.get("webpage_url") or entry.get("url"),
            "duration": entry.get("duration"),
            "duration_string": entry.get("duration_string"),
            "view_count": entry.get("view_count"),
            "like_count": entry.get("like_count"),
            "upload_date": entry.get("upload_date"),
            "uploader": entry.get("uploader"),
            "uploader_id": entry.get("uploader_id"),
            "channel": entry.get("channel"),
            "channel_id": entry.get("channel_id"),
            "channel_url": entry.get("channel_url"),
            "description": entry.get("description"),
            "thumbnail": entry.get("thumbnail"),
            "tags": entry.get("tags"),
            "categories": entry.get("categories"),
        }

    def fetch_video(self, url: str, include_transcript: bool = False) -> Dict[str, Any]:
        stdout = self._run_yt_dlp(["--dump-json", url])
        entries = self._parse_json_lines(stdout)
        if not entries:
            raise ValueError("No video data found.")
        data = self._clean_video_entry(entries[0])

        if include_transcript:
            try:
                subs = self.fetch_subtitles(url)
                data["transcript"] = subs.get("subtitles", [])
            except Exception:
                data["transcript"] = []
        return data

    def bulk_fetch(self, urls: List[str]) -> List[Dict[str, Any]]:
        results = []
        for url in urls:
            try:
                stdout = self._run_yt_dlp(["--dump-json", url])
                entries = self._parse_json_lines(stdout)
                if entries:
                    results.append({"url": url, "success": True, "data": self._clean_video_entry(entries[0])})
                else:
                    results.append({"url": url, "success": False, "error": "No data found."})
            except Exception as e:
                results.append({"url": url, "success": False, "error": str(e)})
        return results

    def search(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        search_url = f"ytsearch{max_results}:{query}"
        stdout = self._run_yt_dlp(["--dump-json", search_url])
        entries = self._parse_json_lines(stdout)
        return [self._clean_video_entry(e) for e in entries]

    def category_search(
        self, query: str, category: str, max_results: int = 10
    ) -> List[Dict[str, Any]]:
        search_url = f"ytsearch{max_results}:{query}"
        stdout = self._run_yt_dlp(["--dump-json", search_url])
        entries = self._parse_json_lines(stdout)
        results = []
        for e in entries:
            cats = e.get("categories") or []
            if category.lower() in [c.lower() for c in cats]:
                results.append(self._clean_video_entry(e))
        return results

    def trending(self, category: Optional[str] = None, max_results: int = 20) -> List[Dict[str, Any]]:
        base = "https://www.youtube.com/feed/trending"
        if category:
            base = f"https://www.youtube.com/feed/trending?bp=4gINGgt5dG1hX2NoYXJ0cw%3D%3D"
        stdout = self._run_yt_dlp(["--dump-json", "--playlist-end", str(max_results), base])
        entries = self._parse_json_lines(stdout)
        return [self._clean_video_entry(e) for e in entries]

    def playlist(self, url: str, max_results: int = 50) -> List[Dict[str, Any]]:
        stdout = self._run_yt_dlp(
            ["--dump-json", "--playlist-end", str(max_results), url]
        )
        entries = self._parse_json_lines(stdout)
        return [self._clean_video_entry(e) for e in entries]

    def stats_table(self, urls: List[str]) -> List[Dict[str, Any]]:
        results = []
        for url in urls:
            try:
                stdout = self._run_yt_dlp(["--dump-json", url])
                entries = self._parse_json_lines(stdout)
                if entries:
                    e = entries[0]
                    results.append({
                        "url": url,
                        "id": e.get("id"),
                        "title": e.get("title"),
                        "views": e.get("view_count"),
                        "likes": e.get("like_count"),
                        "comments": e.get("comment_count"),
                        "duration": e.get("duration"),
                        "upload_date": e.get("upload_date"),
                    })
                else:
                    results.append({"url": url, "error": "No data found."})
            except Exception as e:
                results.append({"url": url, "error": str(e)})
        return results

    def channel_info(self, url: str) -> Dict[str, Any]:
        stdout = self._run_yt_dlp(["--dump-json", "--playlist-end", "1", url])
        entries = self._parse_json_lines(stdout)
        if not entries:
            raise ValueError("No channel data found.")
        e = entries[0]
        return {
            "channel_id": e.get("channel_id"),
            "channel": e.get("channel"),
            "channel_url": e.get("channel_url"),
            "uploader": e.get("uploader"),
            "uploader_id": e.get("uploader_id"),
        }

    def channel_videos(self, url: str, max_results: int = 30) -> List[Dict[str, Any]]:
        stdout = self._run_yt_dlp(
            ["--dump-json", "--playlist-end", str(max_results), url]
        )
        entries = self._parse_json_lines(stdout)
        return [self._clean_video_entry(e) for e in entries]

    def compare(self, urls: List[str]) -> List[Dict[str, Any]]:
        results = []
        for url in urls:
            try:
                stdout = self._run_yt_dlp(["--dump-json", url])
                entries = self._parse_json_lines(stdout)
                if entries:
                    e = entries[0]
                    results.append({
                        "url": url,
                        "id": e.get("id"),
                        "title": e.get("title"),
                        "views": e.get("view_count"),
                        "likes": e.get("like_count"),
                        "duration": e.get("duration"),
                        "upload_date": e.get("upload_date"),
                        "uploader": e.get("uploader"),
                    })
                else:
                    results.append({"url": url, "error": "No data found."})
            except Exception as e:
                results.append({"url": url, "error": str(e)})
        return results

    def duration_filter(
        self, urls: List[str], min_seconds: int = 0, max_seconds: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        results = []
        for url in urls:
            try:
                stdout = self._run_yt_dlp(["--dump-json", url])
                entries = self._parse_json_lines(stdout)
                if entries:
                    e = entries[0]
                    dur = e.get("duration") or 0
                    if dur >= min_seconds and (max_seconds is None or dur <= max_seconds):
                        results.append(self._clean_video_entry(e))
            except Exception:
                continue
        return results

    def batch_info(self, urls: List[str]) -> List[Dict[str, Any]]:
        results = []
        for url in urls:
            try:
                stdout = self._run_yt_dlp(["--dump-json", url])
                entries = self._parse_json_lines(stdout)
                if entries:
                    e = entries[0]
                    results.append({
                        "url": url,
                        "id": e.get("id"),
                        "title": e.get("title"),
                        "duration": e.get("duration"),
                        "views": e.get("view_count"),
                        "uploader": e.get("uploader"),
                    })
                else:
                    results.append({"url": url, "error": "No data found."})
            except Exception as e:
                results.append({"url": url, "error": str(e)})
        return results

    def export_data(self, urls: List[str], fmt: str) -> Dict[str, Any]:
        raw = self.bulk_fetch(urls)
        if fmt == "json":
            return {"format": "json", "data": raw}
        elif fmt == "txt":
            lines = []
            for item in raw:
                if item.get("success"):
                    d = item["data"]
                    lines.append(f"{d.get('title')} | {d.get('url')} | {d.get('duration_string')} | views: {d.get('view_count')}")
                else:
                    lines.append(f"FAILED | {item.get('url')} | {item.get('error')}")
            return {"format": "txt", "content": "\n".join(lines)}
        elif fmt == "csv":
            import csv
            import io
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(["url", "title", "duration", "views", "uploader", "status"])
            for item in raw:
                if item.get("success"):
                    d = item["data"]
                    writer.writerow([
                        d.get("url"),
                        d.get("title"),
                        d.get("duration_string"),
                        d.get("view_count"),
                        d.get("uploader"),
                        "ok",
                    ])
                else:
                    writer.writerow([item.get("url"), "", "", "", "", item.get("error")])
            return {"format": "csv", "content": output.getvalue()}
        elif fmt == "md":
            lines = ["# YouTube Export\n"]
            for item in raw:
                if item.get("success"):
                    d = item["data"]
                    lines.append(f"## {d.get('title')}")
                    lines.append(f"- URL: {d.get('url')}")
                    lines.append(f"- Duration: {d.get('duration_string')}")
                    lines.append(f"- Views: {d.get('view_count')}")
                    lines.append(f"- Uploader: {d.get('uploader')}\n")
                else:
                    lines.append(f"## FAILED: {item.get('url')}")
                    lines.append(f"- Error: {item.get('error')}\n")
            return {"format": "md", "content": "\n".join(lines)}
        elif fmt == "html":
            rows = []
            for item in raw:
                if item.get("success"):
                    d = item["data"]
                    rows.append(
                        f"<tr><td>{self._html_escape(d.get('title', ''))}</td>"
                        f"<td><a href='{d.get('url')}'>{self._html_escape(d.get('url', ''))}</a></td>"
                        f"<td>{d.get('duration_string', '')}</td>"
                        f"<td>{d.get('view_count', '')}</td></tr>"
                    )
                else:
                    rows.append(
                        f"<tr style='color:red'><td colspan='4'>FAILED: {self._html_escape(item.get('url', ''))} - {self._html_escape(item.get('error', ''))}</td></tr>"
                    )
            html = (
                "<html><head><title>YouTube Export</title></head><body>"
                "<table border='1'><tr><th>Title</th><th>URL</th><th>Duration</th><th>Views</th></tr>"
                f"{''.join(rows)}</table></body></html>"
            )
            return {"format": "html", "content": html}
        else:
            raise ValueError(f"Unsupported export format: {fmt}")

    @staticmethod
    def _html_escape(text: str) -> str:
        return (
            text.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
        )

    def mp3_info(self, url: str) -> Dict[str, Any]:
        stdout = self._run_yt_dlp(["-F", url])
        audio_formats = []
        for line in stdout.splitlines():
            if "audio only" in line.lower():
                parts = line.split()
                if parts:
                    audio_formats.append(line)
        return {
            "url": url,
            "audio_formats": audio_formats,
            "note": "Use yt-dlp -x --audio-format mp3 URL to download.",
        }

    def mp4_info(self, url: str) -> Dict[str, Any]:
        stdout = self._run_yt_dlp(["-F", url])
        video_formats = []
        for line in stdout.splitlines():
            low = line.lower()
            if "video only" in low or ("mp4" in low and "audio only" not in low):
                parts = line.split()
                if parts and not line.startswith("WARNING"):
                    video_formats.append(line)
        return {
            "url": url,
            "video_formats": video_formats,
            "note": "Use yt-dlp -f 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best' URL to download.",
        }

    def live_check(self, url: str) -> Dict[str, Any]:
        stdout = self._run_yt_dlp(["--dump-json", url])
        entries = self._parse_json_lines(stdout)
        if not entries:
            raise ValueError("No data found for live check.")
        e = entries[0]
        is_live = e.get("is_live") or e.get("live_status") == "is_live"
        was_live = e.get("was_live") or e.get("live_status") == "was_live"
        return {
            "url": url,
            "is_live": bool(is_live),
            "was_live": bool(was_live),
            "live_status": e.get("live_status"),
            "title": e.get("title"),
        }

    def fetch_subtitles(self, url: str, lang: str = "en") -> Dict[str, Any]:
        try:
            stdout = self._run_yt_dlp(["--list-subs", url], timeout=30, fallback=True)
        except RuntimeError:
            stdout = ""

        # Try to fetch actual subtitles
        try:
            sub_stdout = self._run_yt_dlp(
                [
                    "--write-sub",
                    "--sub-langs", lang,
                    "--skip-download",
                    "--print", "subtitles",
                    url,
                ],
                timeout=30,
                fallback=True,
            )
        except RuntimeError:
            sub_stdout = ""

        subtitles = []
        for line in sub_stdout.splitlines():
            line = line.strip()
            if line and not line.startswith("WARNING"):
                subtitles.append(line)

        return {
            "url": url,
            "language": lang,
            "available_subtitles_raw": stdout,
            "subtitles": subtitles,
        }

    def quality(self, url: str) -> Dict[str, Any]:
        stdout = self._run_yt_dlp(["-F", url])
        formats = []
        for line in stdout.splitlines():
            low = line.lower()
            if line.strip() and not line.startswith("WARNING") and ("audio" in low or "video" in low or "mp4" in low or "webm" in low):
                if any(c.isdigit() for c in line):
                    formats.append(line)
        return {
            "url": url,
            "formats": formats,
        }


engine = YouTubeEngine()
