from pydantic import BaseModel, Field
from typing import Optional, List


class URLRequest(BaseModel):
    url: str = Field(..., description="YouTube URL")


class FetchRequest(BaseModel):
    url: str = Field(..., description="YouTube video URL")
    include_transcript: bool = Field(default=False, description="Include transcript if available")


class BulkFetchRequest(BaseModel):
    urls: List[str] = Field(..., description="List of YouTube video URLs")


class SearchRequest(BaseModel):
    query: str = Field(..., description="Search keyword")
    max_results: int = Field(default=10, ge=1, le=50, description="Maximum results to return")


class CategorySearchRequest(BaseModel):
    query: str = Field(..., description="Search keyword")
    category: str = Field(..., description="Category to search in (e.g., Music, Gaming, Education)")
    max_results: int = Field(default=10, ge=1, le=50, description="Maximum results to return")


class TrendingRequest(BaseModel):
    category: Optional[str] = Field(default=None, description="Trending category: music, gaming, movies")
    max_results: int = Field(default=20, ge=1, le=50, description="Maximum results to return")


class PlaylistRequest(BaseModel):
    url: str = Field(..., description="YouTube playlist URL")
    max_results: int = Field(default=50, ge=1, le=100, description="Maximum videos to fetch")


class StatsRequest(BaseModel):
    urls: List[str] = Field(..., description="List of YouTube video URLs for stats")


class ChannelRequest(BaseModel):
    url: str = Field(..., description="YouTube channel URL")


class ChannelVideosRequest(BaseModel):
    url: str = Field(..., description="YouTube channel URL")
    max_results: int = Field(default=30, ge=1, le=100, description="Maximum videos to fetch")


class CompareRequest(BaseModel):
    urls: List[str] = Field(..., description="List of YouTube video URLs to compare")


class DurationFilterRequest(BaseModel):
    urls: List[str] = Field(..., description="List of YouTube video URLs")
    min_seconds: int = Field(default=0, ge=0, description="Minimum duration in seconds")
    max_seconds: Optional[int] = Field(default=None, ge=0, description="Maximum duration in seconds")


class BatchInfoRequest(BaseModel):
    urls: List[str] = Field(..., description="List of YouTube video URLs")


class ExportRequest(BaseModel):
    urls: List[str] = Field(..., description="List of YouTube video URLs")
    format: str = Field(default="json", description="Export format: json, txt, csv, md, html")


class MP3Request(BaseModel):
    url: str = Field(..., description="YouTube video URL")


class MP4Request(BaseModel):
    url: str = Field(..., description="YouTube video URL")


class LiveCheckRequest(BaseModel):
    url: str = Field(..., description="YouTube video or channel URL")


class SubtitlesRequest(BaseModel):
    url: str = Field(..., description="YouTube video URL")
    lang: Optional[str] = Field(default="en", description="Language code for subtitles")


class QualityRequest(BaseModel):
    url: str = Field(..., description="YouTube video URL")
