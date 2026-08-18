const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables');
  console.error('   Set them in backend/.env or as environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const certUpdates = [
  { title: 'Fórmula do Ouro', image_url: '/certificados/Formula do Ouro.webp' },
  { title: 'Laboratório Fimathe', image_url: '/certificados/Laboratorio Fimathe.webp' },
  { title: 'MasterClass Fimathe', image_url: '/certificados/MasterClass Fimathe.webp' },
  { title: 'Método Fimathe', image_url: '/certificados/Metodo Fimathe.webp' },
  { title: 'Scalper', image_url: '/certificados/Scalper.webp' },
];

async function main() {
  console.log('Updating certificate image paths to WebP...');

  for (const cert of certUpdates) {
    const { data, error } = await supabase
      .from('certificates')
      .update({ image_url: cert.image_url })
      .eq('title', cert.title)
      .select();

    if (error) {
      console.error(`  ❌ ${cert.title}: ${error.message}`);
    } else {
      console.log(`  ✅ ${cert.title} → ${cert.image_url}`);
    }
  }

  // Verify
  const { data: certs } = await supabase.from('certificates').select('title, image_url');
  console.log('\nCertificates in Supabase:');
  certs.forEach(c => console.log(`  - ${c.title}: ${c.image_url}`));

  // Also update the old components/CertificadosPage.tsx with hardcoded data
  console.log('\n✅ Done! Remember to update the old components/CertificadosPage.tsx paths too if it still exists.');
}

main().catch(console.error);
