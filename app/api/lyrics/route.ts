import { NextRequest, NextResponse } from 'next/server';

interface LRCLibResponse {
  id?: number;
  trackName?: string;
  artistName?: string;
  albumName?: string;
  duration?: number;
  instrumental?: boolean;
  plainLyrics?: string;
  syncedLyrics?: string;
}

const LRCLIB_HEADERS = {
  'User-Agent': 'fph-portfolio/1.0.0 (https://fph.my.id)',
};

function cleanTrackQuery(track: string): string {
  return track
    .replace(/\s*\((?:feat\.?|ft\.?|with|remaster(?:ed)?|live|version)[^)]*\)/gi, '')
    .replace(/\s*\[(?:feat\.?|ft\.?|with|remaster(?:ed)?|live|version)[^\]]*\]/gi, '')
    .replace(/\s*-\s*(?:remaster(?:ed)?(?:\s+\d{4})?|single\s+version|radio\s+edit).*$/i, '')
    .trim();
}

function formatPayload(item: LRCLibResponse) {
  return {
    syncedLyrics: item.syncedLyrics || null,
    plainLyrics: item.plainLyrics || null,
    instrumental: item.instrumental || false,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const artist = searchParams.get('artist');
  const track = searchParams.get('track');
  const album = searchParams.get('album');

  if (!artist || !track) {
    return NextResponse.json(
      { success: false, error: 'Artist and track are required' },
      { status: 400 }
    );
  }

  try {
    // 1. Primary exact match via /api/get
    const params = new URLSearchParams({
      artist_name: artist,
      track_name: track,
    });

    if (album) {
      params.append('album_name', album);
    }

    const response = await fetch(`https://lrclib.net/api/get?${params.toString()}`, {
      headers: LRCLIB_HEADERS,
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data: LRCLibResponse = await response.json();
      if (data.syncedLyrics || data.plainLyrics || data.instrumental) {
        return NextResponse.json({
          success: true,
          data: formatPayload(data),
        });
      }
    }

    // 2. Fallback: try /api/get without album if album was provided
    if (album) {
      const noAlbumParams = new URLSearchParams({
        artist_name: artist,
        track_name: track,
      });

      const fallbackResponse = await fetch(
        `https://lrclib.net/api/get?${noAlbumParams.toString()}`,
        {
          headers: LRCLIB_HEADERS,
          next: { revalidate: 3600 },
        }
      );

      if (fallbackResponse.ok) {
        const fallbackData: LRCLibResponse = await fallbackResponse.json();
        if (fallbackData.syncedLyrics || fallbackData.plainLyrics || fallbackData.instrumental) {
          return NextResponse.json({
            success: true,
            data: formatPayload(fallbackData),
          });
        }
      }
    }

    // 3. Fallback: search via /api/search using primary artist and cleaned track name
    const primaryArtist = artist.split(',')[0].trim();
    const cleanedTrack = cleanTrackQuery(track) || track;

    const searchQueries = [
      new URLSearchParams({ track_name: track, artist_name: primaryArtist }),
      ...(cleanedTrack !== track
        ? [new URLSearchParams({ track_name: cleanedTrack, artist_name: primaryArtist })]
        : []),
      new URLSearchParams({ q: `${primaryArtist} ${cleanedTrack}` }),
    ];

    for (const searchQuery of searchQueries) {
      const searchRes = await fetch(
        `https://lrclib.net/api/search?${searchQuery.toString()}`,
        {
          headers: LRCLIB_HEADERS,
          next: { revalidate: 3600 },
        }
      );

      if (!searchRes.ok) continue;

      const results: LRCLibResponse[] = await searchRes.json();
      if (!Array.isArray(results) || results.length === 0) continue;

      const syncedMatch = results.find((item) => Boolean(item.syncedLyrics));
      if (syncedMatch) {
        return NextResponse.json({
          success: true,
          data: formatPayload(syncedMatch),
        });
      }

      const plainMatch = results.find((item) => Boolean(item.plainLyrics) || item.instrumental);
      if (plainMatch) {
        return NextResponse.json({
          success: true,
          data: formatPayload(plainMatch),
        });
      }
    }

    return NextResponse.json(
      { success: false, error: 'Lyrics not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lyrics' },
      { status: 500 }
    );
  }
}
