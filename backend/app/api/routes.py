from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Any

from app.schemas.youtube import (
    FetchRequest,
    BulkFetchRequest,
    SearchRequest,
    CategorySearchRequest,
    TrendingRequest,
    PlaylistRequest,
    StatsRequest,
    ChannelRequest,
    ChannelVideosRequest,
    CompareRequest,
    DurationFilterRequest,
    BatchInfoRequest,
    ExportRequest,
    MP3Request,
    MP4Request,
    LiveCheckRequest,
    SubtitlesRequest,
    QualityRequest,
)
from app.core.youtube_engine import engine

router = APIRouter()


def _handle(func, *args, **kwargs) -> Any:
    try:
        return func(*args, **kwargs)
    except TimeoutError as e:
        raise HTTPException(status_code=504, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health() -> JSONResponse:
    return JSONResponse(content={"status": "healthy"})


@router.post("/fetch")
async def fetch(body: FetchRequest) -> JSONResponse:
    result = _handle(engine.fetch_video, body.url, body.include_transcript)
    return JSONResponse(content={"success": True, "data": result})


@router.post("/bulk-fetch")
async def bulk_fetch(body: BulkFetchRequest) -> JSONResponse:
    result = _handle(engine.bulk_fetch, body.urls)
    return JSONResponse(content={"success": True, "data": result})


@router.post("/search")
async def search(body: SearchRequest) -> JSONResponse:
    result = _handle(engine.search, body.query, body.max_results)
    return JSONResponse(content={"success": True, "results": result})


@router.post("/category-search")
async def category_search(body: CategorySearchRequest) -> JSONResponse:
    result = _handle(engine.category_search, body.query, body.category, body.max_results)
    return JSONResponse(content={"success": True, "results": result})


@router.get("/trending")
async def trending(category: str | None = None, max_results: int = 20) -> JSONResponse:
    result = _handle(engine.trending, category, max_results)
    return JSONResponse(content={"success": True, "results": result})


@router.post("/playlist")
async def playlist(body: PlaylistRequest) -> JSONResponse:
    result = _handle(engine.playlist, body.url, body.max_results)
    return JSONResponse(content={"success": True, "results": result})


@router.post("/stats")
async def stats(body: StatsRequest) -> JSONResponse:
    result = _handle(engine.stats_table, body.urls)
    return JSONResponse(content={"success": True, "stats": result})


@router.post("/channel")
async def channel(body: ChannelRequest) -> JSONResponse:
    result = _handle(engine.channel_info, body.url)
    return JSONResponse(content={"success": True, "channel": result})


@router.post("/channel-videos")
async def channel_videos(body: ChannelVideosRequest) -> JSONResponse:
    result = _handle(engine.channel_videos, body.url, body.max_results)
    return JSONResponse(content={"success": True, "videos": result})


@router.post("/compare")
async def compare(body: CompareRequest) -> JSONResponse:
    result = _handle(engine.compare, body.urls)
    return JSONResponse(content={"success": True, "comparison": result})


@router.post("/duration-filter")
async def duration_filter(body: DurationFilterRequest) -> JSONResponse:
    result = _handle(
        engine.duration_filter, body.urls, body.min_seconds, body.max_seconds
    )
    return JSONResponse(content={"success": True, "videos": result})


@router.post("/batch-info")
async def batch_info(body: BatchInfoRequest) -> JSONResponse:
    result = _handle(engine.batch_info, body.urls)
    return JSONResponse(content={"success": True, "infos": result})


@router.post("/export")
async def export(body: ExportRequest) -> JSONResponse:
    result = _handle(engine.export_data, body.urls, body.format)
    return JSONResponse(content={"success": True, **result})


@router.post("/mp3")
async def mp3(body: MP3Request) -> JSONResponse:
    result = _handle(engine.mp3_info, body.url)
    return JSONResponse(content={"success": True, "data": result})


@router.post("/mp4")
async def mp4(body: MP4Request) -> JSONResponse:
    result = _handle(engine.mp4_info, body.url)
    return JSONResponse(content={"success": True, "data": result})


@router.post("/live-check")
async def live_check(body: LiveCheckRequest) -> JSONResponse:
    result = _handle(engine.live_check, body.url)
    return JSONResponse(content={"success": True, "data": result})


@router.post("/subtitles")
async def subtitles(body: SubtitlesRequest) -> JSONResponse:
    result = _handle(engine.fetch_subtitles, body.url, body.lang)
    return JSONResponse(content={"success": True, "data": result})


@router.post("/quality")
async def quality(body: QualityRequest) -> JSONResponse:
    result = _handle(engine.quality, body.url)
    return JSONResponse(content={"success": True, "data": result})
