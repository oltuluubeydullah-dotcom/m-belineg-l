---
description: Nasıl inşa edilecek — atomik görev planı (Agent 56 Planner + 02 PM)
---
# /plan — Atomik Görev Planı
Spec'i uygulanabilir, küçük, atomik adımlara böl.

Devreye giren ajanlar: **#56 Planner** + **#02 Orchestrator/PM**.

Her plan şunları içerir: **dosya + sıra + risk + test + rollback**.
- Değişecek dosyaları listele (sıralı).
- Her adım için risk ve doğrulama testi.
- Rollback yolu 1 satır olmalı.
- Paralel çalışabilecek katmanları işaretle (Layer 1: FE‖BE‖DB).

$ARGUMENTS
