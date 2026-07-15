// ════════════════════════════════════════════════════════════
// PublicSkeleton — Müşteri tarafı yükleme iskeletleri (v12.4)
// ════════════════════════════════════════════════════════════
// 4 varyant: urun-listesi (kategori/arama), urun-detay, blog, basit-icerik
// ════════════════════════════════════════════════════════════

export default function PublicSkeleton({ varyant = 'urun-listesi' }) {
  if (varyant === 'urun-detay') {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="h-4 w-64 bg-brand-dark/10 rounded animate-pulse mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Galeri */}
          <div className="lg:col-span-3 space-y-3">
            <div className="aspect-[4/3] bg-brand-dark/10 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-5 gap-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="aspect-square bg-brand-dark/5 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          {/* Detay */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="h-8 w-3/4 bg-brand-dark/15 rounded animate-pulse mb-3" />
              <div className="h-4 w-1/3 bg-brand-dark/10 rounded animate-pulse" />
            </div>
            <div className="h-12 w-48 bg-brand-dark/15 rounded animate-pulse" />
            <div className="space-y-3 border-t border-brand-dark/10 pt-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center justify-between p-3 bg-brand-dark/5 rounded-lg">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-2/3 bg-brand-dark/10 rounded animate-pulse" />
                    <div className="h-3 w-1/3 bg-brand-dark/5 rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-24 bg-brand-dark/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="h-14 bg-brand-dark/15 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (varyant === 'blog') {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="h-10 w-1/2 bg-brand-dark/15 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="aspect-[16/10] bg-brand-dark/10 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-24 bg-brand-dark/10 rounded animate-pulse" />
                <div className="h-5 w-5/6 bg-brand-dark/15 rounded animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-brand-dark/5 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-brand-dark/5 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (varyant === 'basit-icerik') {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="h-10 w-2/3 bg-brand-dark/15 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-3 bg-brand-dark/10 rounded animate-pulse"
              style={{ width: `${75 + (i * 7) % 25}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default: urun-listesi (kategori, arama)
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
      {/* Başlık */}
      <div className="h-9 md:h-11 w-2/3 md:w-1/2 bg-brand-dark/15 rounded animate-pulse mb-3" />
      <div className="h-4 w-32 bg-brand-dark/10 rounded animate-pulse mb-8" />

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/3] bg-brand-dark/10 rounded-xl animate-pulse" />
            <div className="h-4 w-5/6 bg-brand-dark/10 rounded animate-pulse" />
            <div className="h-5 w-1/2 bg-brand-dark/15 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
