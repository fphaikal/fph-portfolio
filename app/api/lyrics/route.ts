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
    // Build LRCLIB API URL
    const params = new URLSearchParams({
      artist_name: artist,
      track_name: track,
    });

    if (album) {
      params.append('album_name', album);
    }

    const response = await fetch(`https://lrclib.net/api/get?${params.toString()}`, {
      headers: {
        'User-Agent': 'fph-portfolio/1.0.0 (https://fph.my.id)',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      // If not found, try searching without album
      if (response.status === 404 && album) {
        const fallbackParams = new URLSearchParams({
          artist_name: artist,
          track_name: track,
        });

        const fallbackResponse = await fetch(
          `https://lrclib.net/api/get?${fallbackParams.toString()}`,
          {
            headers: {
              'User-Agent': 'fph-portfolio/1.0.0 (https://fph.my.id)',
            },
            next: { revalidate: 3600 },
          }
        );

        if (!fallbackResponse.ok) {
          return NextResponse.json(
            { success: false, error: 'Lyrics not found' },
            { status: 404 }
          );
        }

        const fallbackData: LRCLibResponse = await fallbackResponse.json();
        return NextResponse.json({
          success: true,
          data: {
            syncedLyrics: fallbackData.syncedLyrics || null,
            plainLyrics: fallbackData.plainLyrics || null,
            instrumental: fallbackData.instrumental || false,
          },
        });
      }

      return NextResponse.json(
        { success: false, error: 'Lyrics not found' },
        { status: 404 }
      );
    }

    const data: LRCLibResponse = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        syncedLyrics: data.syncedLyrics || null,
        plainLyrics: data.plainLyrics || null,
        instrumental: data.instrumental || false,
      },
    });
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lyrics' },
      { status: 500 }
    );
  }
}
