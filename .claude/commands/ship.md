---
description: Production'a çıkar — 4-onay kapısı (Agent 09 DevOps)
---
# /ship — Production Deploy
Production'a güvenli çıkış.

Devreye giren ajan: **#09 DevOps** + 4-approval gate.

**BLOCKER — 4 onay olmadan deploy YOK:**
- #07 Security ✅  · #15 QA ✅  · #19 Legal ✅  · #20 SRE ✅

Bu projede hedef: Vercel deploy. Manuel prod deploy yasak.
Rollback 1 satır olmalı. Deploy sonrası doğrulama (`mobel-version` meta).

$ARGUMENTS
