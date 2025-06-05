---
trigger: always_on
---

DO NOT introduce new patterns or libraries unless all current options are exhausted.
IF you introduce new tech, REMOVE the older version to prevent logic duplication.
NEVER make large architectural changes without an explicit task or reason.
Write DRY code — Do not Repeat Yourself.
Prefer simple functional components and hooks in React.
Use reusable utility functions in a /utils or /lib folder.
Avoid script-only files for one-time tasks. Use CLI args or dedicated tool.