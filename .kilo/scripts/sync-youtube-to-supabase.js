/**
 * sync-youtube-to-supabase.js
 *
 * Synchronizes ALL YouTube playlists to Supabase courses/modules/lessons.
 *
 * This script:
 * 1. Fetches playlist metadata from YouTube Data API v3 for all configured playlist IDs
 * 2. Creates a `course` record in Supabase for each playlist (with playlist_id)
 * 3. Creates a single `module` ("Aulas") under each course
 * 4. Fetches all videos from each playlist
 * 5. Creates `lesson` records with REAL YouTube video IDs, titles, thumbnails, durations
 *
 * YouTube is used as a DATA SOURCE (API fetch), NOT as a redirect.
 * All data is stored in Supabase and served to the frontend directly.
 *
 * Uso:
 *   node .kilo/scripts/sync-youtube-to-supabase.js
 */

require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables');
  console.error('   Set them in backend/.env or as environment variables:');
  console.error('   SUPABASE_URL=https://iskzakpvxuowkbzovjxw.supabase.co');
  console.error('   SUPABASE_SECRET_KEY=sb_secret_...');
  console.error('   YOUTUBE_API_KEY=...');
  process.exit(1);
}

if (!YOUTUBE_API_KEY) {
  console.error('❌ Missing YOUTUBE_API_KEY environment variable');
  console.error('   Get one from: https://console.cloud.google.com/apis/library/youtube.googleapis.com');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Marcos Ferreira YouTube channel ID
// Fetched dynamically via: YouTube Data API v3 channels.list?forHandle=marceloferreirafx
const CHANNEL_ID = 'UCwk7RuafgXHRqSmS3qO8qQQ';

// Playlists to exclude from sync (shorts, auto-generated, etc.)
const EXCLUDE_PLAYLIST_TITLES = ['SHORTS'];
const EXCLUDE_PLAYLIST_IDS = [];

/**
 * Fetches ALL playlists from the marceloferreirafx YouTube channel.
 * Uses the YouTube Data API v3 playlists.list with channelId parameter.
 * Handles pagination automatically.
 */
async function fetchAllChannelPlaylists() {
  const allPlaylists = [];
  let nextPageToken = null;

  do {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      channelId: CHANNEL_ID,
      maxResults: '50',
      key: YOUTUBE_API_KEY,
      ...(nextPageToken ? { pageToken: nextPageToken } : {}),
    });

    const url = `https://www.googleapis.com/youtube/v3/playlists?${params.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`YouTube API error (playlists): ${res.status} - ${text}`);
    }

    const json = await res.json();

    if (json.error) {
      console.error('YouTube API error:', json.error.message);
      break;
    }

    for (const item of json.items || []) {
      const snippet = item.snippet || {};
      const contentDetails = item.contentDetails || {};
      const title = snippet.title || '';

      // Skip excluded playlists
      if (EXCLUDE_PLAYLIST_IDS.includes(item.id) ||
          EXCLUDE_PLAYLIST_TITLES.some((excluded) =>
            title.toUpperCase().includes(excluded))) {
        console.log(`  ⏭️  Skipping playlist: "${title}" (${item.id})`);
        continue;
      }

      const thumbnail =
        snippet?.thumbnails?.maxres?.url ||
        snippet?.thumbnails?.high?.url ||
        snippet?.thumbnails?.medium?.url ||
        snippet?.thumbnails?.standard?.url ||
        snippet?.thumbnails?.default?.url ||
        '';

      allPlaylists.push({
        id: item.id,
        title: title,
        description: snippet?.description || '',
        thumbnail,
        itemCount: contentDetails?.itemCount || 0,
      });
    }

    nextPageToken = json.nextPageToken;
  } while (nextPageToken);

  return allPlaylists;
}

// Backward compatibility: keep the old PLAYLIST_IDS for reference/manual overrides
const PLAYLIST_IDS = process.env.PLAYLIST_IDS
  ? process.env.PLAYLIST_IDS.split(',').filter(Boolean)
  : null;

function parseISO8601Duration(isoDuration) {
  if (!isoDuration) return null;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

async function fetchPlaylistDetails(playlistId) {
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.error) {
    console.error('  YouTube API error:', json.error.message);
    return null;
  }

  const item = json.items?.[0];
  if (!item) return null;

  const snippet = item.snippet;
  const contentDetails = item.contentDetails;

  const thumbnail =
    snippet?.thumbnails?.maxres?.url ||
    snippet?.thumbnails?.high?.url ||
    snippet?.thumbnails?.medium?.url ||
    snippet?.thumbnails?.standard?.url ||
    snippet?.thumbnails?.default?.url ||
    '';

  return {
    title: snippet?.title || 'Sem título',
    description: snippet?.description || '',
    thumbnail,
    itemCount: contentDetails?.itemCount || 0,
  };
}

async function fetchAllPlaylistVideos(playlistId) {
  const videos = [];
  let nextPageToken = null;

  do {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: '50',
      key: YOUTUBE_API_KEY,
      ...(nextPageToken ? { pageToken: nextPageToken } : {}),
    });

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.error) {
      console.error('  YouTube API error (playlistItems):', json.error.message);
      break;
    }

    for (const item of json.items || []) {
      const snippet = item.snippet;
      const thumbnail =
        snippet?.thumbnails?.maxres?.url ||
        snippet?.thumbnails?.high?.url ||
        snippet?.thumbnails?.medium?.url ||
        snippet?.thumbnails?.standard?.url ||
        snippet?.thumbnails?.default?.url ||
        '';

      videos.push({
        videoId: snippet?.resourceId?.videoId || null,
        title: snippet?.title || 'Sem título',
        description: snippet?.description || '',
        thumbnail,
        publishedAt: snippet?.publishedAt || null,
      });
    }

    nextPageToken = json.nextPageToken;
  } while (nextPageToken);

  return videos;
}

async function fetchVideoDetails(videoIds) {
  const batches = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    batches.push(videoIds.slice(i, i + 50));
  }

  const allResults = {};

  for (const batch of batches) {
    const ids = batch.join(',');
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids}&key=${YOUTUBE_API_KEY}`;

    const res = await fetch(url);
    const json = await res.json();

    if (json.error) {
      console.error('  YouTube API error:', json.error.message);
      continue;
    }

    for (const item of json.items || []) {
      const snippet = item.snippet;
      const contentDetails = item.contentDetails;
      const durationSec = parseISO8601Duration(contentDetails?.duration);
      const thumbnail =
        snippet?.thumbnails?.maxres?.url ||
        snippet?.thumbnails?.high?.url ||
        snippet?.thumbnails?.medium?.url ||
        snippet?.thumbnails?.standard?.url ||
        snippet?.thumbnails?.default?.url ||
        `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`;

      allResults[item.id] = {
        title: snippet?.title || '',
        description: snippet?.description || '',
        thumbnail,
        duration: durationSec,
        channelTitle: snippet?.channelTitle || '',
        publishedAt: snippet?.publishedAt || null,
        viewCount: parseInt(snippet?.tags?.length || 0),
      };
    }
  }

  return allResults;
}

async function main() {
  console.log('=== Sincronizando TODAS as playlists do canal marceloferreirafx para Supabase ===\n');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Channel ID: ${CHANNEL_ID}\n`);

  // Step 1: Discover ALL playlists from the channel
  console.log('Step 1: Discovering all playlists from channel...');
  let playlists;
  try {
    playlists = await fetchAllChannelPlaylists();
  } catch (error) {
    console.error('❌ Failed to discover playlists from channel:', error.message);
    console.error('   Falling back to PLAYLIST_IDS environment variable if set...');
    if (PLAYLIST_IDS && PLAYLIST_IDS.length > 0) {
      console.log(`   Using ${PLAYLIST_IDS.length} playlists from PLAYLIST_IDS env var`);
      playlists = await Promise.all(
        PLAYLIST_IDS.map(async (playlistId) => {
          const details = await fetchPlaylistDetails(playlistId);
          return details ? { id: playlistId, ...details } : null;
        })
      );
      playlists = playlists.filter(Boolean);
    } else {
      console.error('   No PLAYLIST_IDS available. Exiting.');
      process.exit(1);
    }
  }
  console.log(`Discovered ${playlists.length} playlists to sync\n`);

  let totalPlaylists = 0;
  let totalLessons = 0;

  // Step 2: Clear existing data (to avoid duplicates from re-runs)
  console.log('Step 2: Clearing existing courses/modules/lessons...');
  await supabase.from('lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('modules').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Cleared.\n');

  // Step 3: Process each playlist
  for (const [index, playlist] of playlists.entries()) {
    const playlistId = playlist.id;
    console.log(`\n[${index + 1}/${playlists.length}] Processing playlist: ${playlist.title} (${playlistId})`);
    console.log(`  Item count: ${playlist.itemCount}`);

    // Create course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert([{
        title: playlist.title,
        description: playlist.description || null,
        thumbnail: playlist.thumbnail || null,
        playlist_id: playlistId,
        is_published: true,
        order_index: index,
      }])
      .select()
      .single();

    if (courseError) {
      console.error('  ❌ Error creating course:', courseError.message);
      continue;
    }

    console.log(`  ✅ Course created: ${course.id}`);
    totalPlaylists++;

    // Create module
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .insert([{
        course_id: course.id,
        title: 'Aulas',
        description: `Aulas de ${playlist.title}`,
        order_index: 0,
      }])
      .select()
      .single();

    if (moduleError) {
      console.error('  ❌ Error creating module:', moduleError.message);
      continue;
    }

    // Fetch all videos from the playlist
    console.log(`  Fetching videos from playlist...`);
    const playlistVideos = await fetchAllPlaylistVideos(playlistId);
    console.log(`  Found ${playlistVideos.length} videos`);

    if (playlistVideos.length === 0) {
      console.log('  ⚠️ No videos found in playlist');
      continue;
    }

    // Fetch detailed video metadata (duration, better thumbnails)
    const videoIds = playlistVideos.map(v => v.videoId).filter(Boolean);
    const videoDetailsMap = await fetchVideoDetails(videoIds);

    // Create lessons
    let lessonIndex = 0;
    for (const video of playlistVideos) {
      if (!video.videoId) continue;

      const details = videoDetailsMap[video.videoId] || {};
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .insert([{
          module_id: module.id,
          course_id: course.id,
          title: details.title || video.title,
          description: details.description || video.description || null,
          video_id: video.videoId,
          thumbnail: details.thumbnail || video.thumbnail || null,
          duration: details.duration || null,
          order_index: lessonIndex,
          is_published: true,
        }])
        .select();

      if (lessonError) {
        console.error(`  ❌ Error creating lesson "${video.title}": ${lessonError.message}`);
      } else {
        lessonIndex++;
        totalLessons++;
      }
    }

    console.log(`  ✅ Created ${lessonIndex} lessons`);
  }

  // Final summary
  console.log('\n=== Summary ===');
  console.log(`Total courses created: ${totalPlaylists}`);
  console.log(`Total lessons created: ${totalLessons}`);

  // Verify final counts
  console.log('\n=== Final Counts ===');
  const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact' });
  const { count: moduleCount } = await supabase.from('modules').select('*', { count: 'exact' });
  const { count: lessonCount } = await supabase.from('lessons').select('*', { count: 'exact' });
  console.log(`Courses: ${courseCount}`);
  console.log(`Modules: ${moduleCount}`);
  console.log(`Lessons: ${lessonCount}`);

  console.log('\n✅ Sync complete!');
}

main().catch(console.error);
