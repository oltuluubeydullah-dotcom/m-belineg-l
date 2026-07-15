---
description: Adım adım inşa — tek dilim (Agent 03 FE / 04 BE / 05 DB)
---
# /build — Incremental Build
Plandaki TEK dilimi uygula. Küçük, doğrulanabilir adım.

Devreye giren ajanlar: **#03 Frontend** / **#04 Backend** / **#05 Database** (işe göre).

Kurallar:
- GateGuard: ilk Edit/Write öncesi bağlamı doğrula (kim import ediyor, şema ne).
- Pinned versions, component prefix, RLS, service role sadece server-side.
- Her dilim sonrası: tsc/lint temiz + Memory notu.

$ARGUMENTS
