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

// All playlist IDs from the backend configuration
const PLAYLIST_IDS = [
  'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I', // Fimathe Checkpoint | FOREX
  'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9', // Primórdios da Fimathe
  'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh', // Marcelão in London [2024]
  'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK', // As melhores do XAUUSD
  'PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5', // ESTUDOS EM EUR/USD
  'PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV', // FIMATHE NO OURO
  'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ', // FOREX SCALPER FIMATHE
  'PLWhqc48nlRWJpjKnjSaJpq4jMRE_ukg6V', // FIMATHE EM CRIPTOMOEDA
  'PLWhqc48nlRWJZyYdEi3gcSIHx6cy0Hxlb', // TRADE PARA INICIANTES
  'PLWhqc48nlRWITJy0wfqGdXprKLkEecXIv', // FOREX DO ZERO? COMECE AQUI
  'PLWhqc48nlRWLqE-RBi_RTBjKit-xFWeOC', // VLOG
  'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD', // IMERSÃO MÉTODO FIMATHE
  'PLWhqc48nlRWKu17t5xqL6Sr3T6Pwn1DcL', // COLLABS
  'PLWhqc48nlRWIKhZTuRMMy4vtOhN_HANlw', // MEU PORTFÓLIO NO DAYTRADE
  'PLWhqc48nlRWIuwZkiaLAfDfFKWWndWUxO', // ESTUDOS EM USD/JPY
];

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
  console.log('=== Sincronizando Playlists do YouTube para Supabase ===\n');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Playlists to sync: ${PLAYLIST_IDS.length}\n`);

  let totalPlaylists = 0;
  let totalLessons = 0;

  // Clear existing data (to avoid duplicates from re-runs)
  console.log('Step 1: Clearing existing courses/modules/lessons...');
  await supabase.from('lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('modules').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Cleared.\n');

  for (const [index, playlistId] of PLAYLIST_IDS.entries()) {
    console.log(`\n[${index + 1}/${PLAYLIST_IDS.length}] Processing playlist: ${playlistId}`);

    // Fetch playlist details
    const playlistDetails = await fetchPlaylistDetails(playlistId);
    if (!playlistDetails) {
      console.log('  ⚠️ Playlist not found or error');
      continue;
    }

    console.log(`  Title: ${playlistDetails.title}`);
    console.log(`  Thumbnail: ${playlistDetails.thumbnail}`);
    console.log(`  Item count: ${playlistDetails.itemCount}`);

    // Create course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert([{
        title: playlistDetails.title,
        description: playlistDetails.description || null,
        thumbnail: playlistDetails.thumbnail || null,
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
        description: `Aulas de ${playlistDetails.title}`,
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
