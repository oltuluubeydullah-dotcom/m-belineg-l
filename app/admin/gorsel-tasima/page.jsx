// ════════════════════════════════════════════════════════════
// Admin / Görsel Taşıma — Supabase Storage → Cloudflare R2
// ════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

import GorselTasima from './GorselTasima';

export const metadata = {
  title: 'Görsel Taşıma (R2)',
};

export default function GorselTasimaSayfasi() {
  return <GorselTasima />;
}
