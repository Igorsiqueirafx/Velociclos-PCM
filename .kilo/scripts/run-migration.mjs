/**
 * run-migration.mjs (v3 - Full YouTube Sync)
 *
 * Este script sincroniza completamente as playlists do YouTube para o Supabase.
 * Substitui a abordagem antiga que usava IDs de vídeo inválidos (33 chars).
 *
 * Uso:
 *   SUPABASE_SECRET_KEY=sb_secret_... node .kilo/scripts/run-migration.mjs
 *
 * Resultado: 15 courses, 15 modules, 165 lessons (com video_ids reais do YouTube)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || !YOUTUBE_API_KEY) {
  console.error('❌ Missing environment variables.');
  console.error('   Required: SUPABASE_URL, SUPABASE_SECRET_KEY, YOUTUBE_API_KEY');
  console.error('   Set them in backend/.env or as environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PLAYLIST_IDS = [
  'PLWhqc48nlRWLhDr-YqQhwVGhCFwUCcw7I',
  'PLWhqc48nlRWIBLg85_VDOcqRAq-BWi-J9',
  'PLWhqc48nlRWKnmtTenj21hAdK3Lasx-Yh',
  'PLWhqc48nlRWJKFtMeqiQjWAtGRitoYSFK',
  'PLWhqc48nlRWL8F5Tl7UtqY2S4SXlYG6B5',
  'PLWhqc48nlRWJ-8YQA16dpId_6L1w4ySKV',
  'PLWhqc48nlRWKWGyAfGr0iLpwtsGexhnaZ',
  'PLWhqc48nlRWJpjKnjSaJpq4jMRE_ukg6V',
  'PLWhqc48nlRWJZyYdEi3gcSIHx6cy0Hxlb',
  'PLWhqc48nlRWITJy0wfqGdXprKLkEecXIv',
  'PLWhqc48nlRWLqE-RBi_RTBjKit-xFWeOC',
  'PLWhqc48nlRWLahmd1buhzix23XcAFJkqD',
  'PLWhqc48nlRWKu17t5xqL6Sr3T6Pwn1DcL',
  'PLWhqc48nlRWIKhZTuRMMy4vtOhN_HANlw',
  'PLWhqc48nlRWIuwZkiaLAfDfFKWWndWUxO',
];

function parseISO8601Duration(iso) {
  if (!iso) return null;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return null;
  return (parseInt(m[1]||0)*3600 + parseInt(m[2]||0)*60 + parseInt(m[3]||0));
}

async function fetchPlaylistDetails(id) {
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${id}&key=${YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  const item = json.items?.[0];
  if (!item) return null;
  const s = item.snippet;
  const cd = item.contentDetails;
  const thumb = s?.thumbnails?.maxres?.url || s?.thumbnails?.high?.url || s?.thumbnails?.default?.url || '';
  return { title: s?.title||'', description: s?.description||'', thumbnail: thumb, itemCount: cd?.itemCount||0 };
}

async function fetchPlaylistVideos(id) {
  const videos = [];
  let page = null;
  do {
    const params = new URLSearchParams({ part:'snippet,contentDetails', playlistId:id, maxResults:'50', key:YOUTUBE_API_KEY });
    if (page) params.set('pageToken', page);
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?${params}`;
    const res = await fetch(url);
    const json = await res.json();
    for (const item of json.items || []) {
      const s = item.snippet;
      const thumb = s?.thumbnails?.maxres?.url || s?.thumbnails?.high?.url || s?.thumbnails?.default?.url || '';
      videos.push({ videoId: s?.resourceId?.videoId, title: s?.title||'', description: s?.description||'', thumbnail: thumb, publishedAt: s?.publishedAt||null });
    }
    page = json.nextPageToken;
  } while (page);
  return videos;
}

async function fetchVideoDetails(ids) {
  const batches = [];
  for (let i=0;i<ids.length;i+=50) batches.push(ids.slice(i,i+50));
  const results = {};
  for (const batch of batches) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${batch.join(',')}&key=${YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    for (const item of json.items || []) {
      const s = item.snippet;
      const cd = item.contentDetails;
      const thumb = s?.thumbnails?.maxres?.url || s?.thumbnails?.high?.url || s?.thumbnails?.default?.url || '';
      results[item.id] = { title: s?.title||'', description: s?.description||'', thumbnail: thumb, duration: parseISO8601Duration(cd?.duration) };
    }
  }
  return results;
}

async function main() {
  console.log('=== Full YouTube → Supabase Migration ===\n');

  // Clear existing
  console.log('Clearing existing data...');
  await supabase.from('lessons').delete().neq('id','00000000-0000-0000-0000-000000000000');
  await supabase.from('modules').delete().neq('id','00000000-0000-0000-0000-000000000000');
  await supabase.from('courses').delete().neq('id','00000000-0000-0000-0000-000000000000');

  let totalCourses = 0;
  let totalLessons = 0;

  for (const [i, pid] of PLAYLIST_IDS.entries()) {
    console.log(`\n[${i+1}/${PLAYLIST_IDS.length}] ${pid}`);
    const pd = await fetchPlaylistDetails(pid);
    if (!pd) continue;

    const { data: course, error: ce } = await supabase.from('courses').insert([{
      title: pd.title, description: pd.description, thumbnail: pd.thumbnail,
      playlist_id: pid, is_published: true, order_index: i,
    }]).select().single();
    if (ce) { console.error('  Course error:', ce.message); continue; }
    totalCourses++;

    const { data: mod, error: me } = await supabase.from('modules').insert([{
      course_id: course.id, title: 'Aulas', description: pd.description, order_index: 0,
    }]).select().single();
    if (me) { console.error('  Module error:', me.message); continue; }

    const vids = await fetchPlaylistVideos(pid);
    console.log(`  Videos found: ${vids.length}`);
    const details = await fetchVideoDetails(vids.map(v=>v.videoId).filter(Boolean));

    let idx = 0;
    for (const v of vids) {
      if (!v.videoId) continue;
      const d = details[v.videoId] || {};
      const { error: le } = await supabase.from('lessons').insert([{
        module_id: mod.id, course_id: course.id,
        title: d.title || v.title,
        description: d.description || v.description || null,
        video_id: v.videoId,
        thumbnail: d.thumbnail || v.thumbnail || null,
        duration: d.duration || null,
        order_index: idx,
        is_published: true,
      }]);
      if (le) console.error(`  Lesson error: ${le.message}`);
      else idx++;
    }
    totalLessons += idx;
    console.log(`  Lessons created: ${idx}`);
  }

  console.log('\n=== Final Counts ===');
  const { count } = await supabase.from('courses').select('*', { count: 'exact' });
  console.log(`courses: ${count}`);
  const { count: mc } = await supabase.from('modules').select('*', { count: 'exact' });
  console.log(`modules: ${mc}`);
  const { count: lc } = await supabase.from('lessons').select('*', { count: 'exact' });
  console.log(`lessons: ${lc}`);
  const { count: cc } = await supabase.from('certificates').select('*', { count: 'exact' });
  console.log(`certificates: ${cc}`);
  console.log(`\nTotal courses created: ${totalCourses}`);
  console.log(`Total lessons created: ${totalLessons}`);
  console.log('\n✅ Migration complete!');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
