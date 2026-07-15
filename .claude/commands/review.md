---
description: Merge öncesi denetle — kod sağlığı + güvenlik (Agent 07 + 54 + 55)
---
# /review — Pre-Merge Review
Merge öncesi kod sağlığı ve güvenlik denetimi.

Devreye giren ajanlar: **#07 Security** + **#54 Silent Failure Hunter** + **#55 Type Designer**.

Kontrol listesi:
- Secret/.env/hard-coded key taraması (KRİTİK → blocker).
- RLS her tabloda, service role client'ta değil.
- Boş catch / yutulan hata / kötü fallback yok.
- Tip güvenliği: geçersiz durum temsil edilemiyor mu?
- Sıfır tolerans kuralları (bkz. `.claude/UbivoAgentTeam-MASTER.md`).

$ARGUMENTS
