---
"@openpronoun/react": patch
---

Fix `PronounSelector` in badge mode rendering its closed menu on screen. The badge menu's `display: flex` overrode the `[hidden]` state Ark UI sets when the menu is closed; the closed menu is now always hidden.
