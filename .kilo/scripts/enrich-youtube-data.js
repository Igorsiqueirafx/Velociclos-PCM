/**
 * enrich-exact-videos.js
 *
 * Fetches YouTube metadata for the EXACT video_ids stored in the lessons table
 * and enriches them with real titles, thumbnails, durations, and descriptions.
 * Does NOT require playlist matching — uses videos.list by video ID directly.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables');
  console.error('   Set them in backend/.env or as environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function parseISO8601Duration(isoDuration) {
  if (!isoDuration) return null;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
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
      console.error('YouTube API error:', json.error.message);
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
      };
    }
  }

  return allResults;
}

async function main() {
  console.log('=== Enriching Lesson Videos from YouTube ===\n');

  // Step 1: Get all lessons with video_id from Supabase
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, title, video_id, order_index')
    .eq('is_published', true)
    .order('order_index');

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError.message);
    return;
  }

  console.log(`Found ${lessons.length} lessons to enrich:\n`);
  lessons.forEach(l => console.log(`  Aula ${l.order_index + 1}: video_id=${l.video_id}, current_title="${l.title}"`));

  // Step 2: Fetch YouTube metadata for all video IDs
  const videoIds = lessons.map(l => l.video_id).filter(Boolean);
  console.log(`\nFetching metadata for ${videoIds.length} video IDs from YouTube API v3...`);

  const videoDetails = await fetchVideoDetails(videoIds);

  console.log(`\nYouTube API returned ${Object.keys(videoDetails).length} results:\n`);
  for (const [videoId, meta] of Object.entries(videoDetails)) {
    console.log(`  ${videoId}:`);
    console.log(`    title: ${meta.title}`);
    console.log(`    duration: ${meta.duration}s`);
    console.log(`    thumbnail: ${meta.thumbnail}`);
    console.log(`    channel: ${meta.channelTitle}`);
    console.log(`    published: ${meta.publishedAt}`);
  }

  // Step 3: Update lessons in Supabase with enriched data
  console.log('\n=== Updating lessons in Supabase ===');
  for (const lesson of lessons) {
    if (!lesson.video_id || !videoDetails[lesson.video_id]) {
      console.log(`  ⚠️  No YouTube data for video_id: ${lesson.video_id}`);
      continue;
    }

    const meta = videoDetails[lesson.video_id];
    const { data, error } = await supabase
      .from('lessons')
      .update({
        title: meta.title || lesson.title,
        description: meta.description || null,
        thumbnail: meta.thumbnail || null,
        duration: meta.duration || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lesson.id)
      .select();

    if (error) {
      console.error(`  ❌ Error updating "${meta.title}": ${error.message}`);
    } else {
      console.log(`  ✅ Updated: "${meta.title}" (${meta.duration}s)`);
    }
  }

  // Step 4: Also fetch playlist metadata for the course
  console.log('\n=== Enriching Course ===');
  const playlistId = 'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD';
  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${YOUTUBE_API_KEY}`;
  const playlistRes = await fetch(playlistUrl);
  const playlistJson = await playlistRes.json();

  if (playlistJson.items?.[0]) {
    const snippet = playlistJson.items[0].snippet;
    const contentDetails = playlistJson.items[0].contentDetails;
    const thumbnail =
      snippet?.thumbnails?.maxres?.url ||
      snippet?.thumbnails?.high?.url ||
      snippet?.thumbnails?.default?.url ||
      '';

    console.log('Playlist metadata:');
    console.log(`  title: ${snippet.title}`);
    console.log(`  description: ${snippet.description?.substring(0, 100)}...`);
    console.log(`  itemCount: ${contentDetails.itemCount}`);
    console.log(`  thumbnail: ${thumbnail}`);

    const { error: courseError } = await supabase
      .from('courses')
      .update({
        title: snippet.title || undefined,
        description: snippet.description || null,
        thumbnail: thumbnail || null,
        updated_at: new Date().toISOString(),
      })
      .eq('playlist_id', playlistId);

    if (courseError) {
      console.error('  ❌ Error updating course:', courseError.message);
    } else {
      console.log('  ✅ Course updated with playlist metadata');
    }
  }

  // Step 5: Final verification
  console.log('\n=== Final Lesson Data ===');
  const { data: finalLessons } = await supabase
    .from('lessons')
    .select('title, video_id, thumbnail, duration, order_index')
    .order('order_index');

  for (const lesson of finalLessons || []) {
    const durationMin = lesson.duration ? `${Math.floor(lesson.duration / 60)}:${String(lesson.duration % 60).padStart(2, '0')}` : 'N/A';
    console.log(`  Aula ${lesson.order_index + 1}: "${lesson.title}" | ${durationMin} | thumbnail: ${lesson.thumbnail ? '✅' : '❌'}`);
  }

  console.log('\n✅ Enrichment complete!');
}

main().catch(console.error);
