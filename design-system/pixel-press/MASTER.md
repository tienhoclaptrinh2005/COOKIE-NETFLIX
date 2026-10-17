# Pixel Press Design System

> Product-wide source of truth for the Guest Session Analyzer and Admin Control Center.

## Art direction

- Style: polished Retro Pixel Arcade / 8-bit control deck.
- Mood: dark, technical, energetic and trustworthy—not jokey or nostalgic parody.
- Shape language: 0px radius, 2–3px borders, offset hard shadows, modular 8px grid.
- Never use glassmorphism, soft gradients, rounded SaaS cards, Windows 95 desktop chrome or emoji icons.
- Effects are restrained: CRT scanlines at low opacity, localized neon text glow, dark pixel-grid background.

## Semantic colors

| Token | Value | Purpose |
| --- | --- | --- |
| `--background` | `#040814` | Page canvas / black navy |
| `--background-raised` | `#081225` | Navigation and grouped regions |
| `--surface` | `#0C1730` | Primary panels |
| `--surface-2` | `#111F3C` | Nested panels |
| `--foreground` | `#F4F7FF` | Primary text |
| `--muted` | `#9CB0D2` | Secondary text, minimum 4.5:1 on page/surface |
| `--border` | `#2D466F` | Default frame and divider |
| `--primary` | `#39FF88` | Main action / LIVE / healthy |
| `--yellow` | `#FFD83D` | Warning / UNKNOWN / focus |
| `--blue` | `#42A5FF` | Information / network / links |
| `--red` | `#FF4D5E` | Destructive / DIE / error |
| `--violet` | `#A879FF` | Secondary admin telemetry |

Status is never represented by color alone: every state requires a label plus an icon.

## Typography

- Display and labels: **Press Start 2P**, uppercase, 8–14px for UI labels, generous line-height (1.5–1.8).
- Body and data: **VT323**, 18–24px, line-height 1.35–1.55.
- Numerical dashboards use monospaced tabular figures.
- Heading scale: 8, 10, 12, 16, 24, 40–54px fluid hero.
- Long copy stays within 75 characters per line. Never set body copy below 16px.

## Spacing and layout

- Base unit: 4px; primary rhythm: 8, 12, 16, 24, 32, 48, 64px.
- App shell max width: 1440–1500px.
- Guest desktop: analyzer/result 68% + status rail 32%; stack into one column below 1280px.
- Admin desktop: fixed 288px sidebar + fluid content; horizontal top navigation below 1024px.
- Mobile gutter: 16px. Tablet: 24px. Desktop: 32–40px.
- All interactive targets are at least 44px high. Never allow page-level horizontal scrolling.

## Components

### Pixel panel

- 3px semantic accent border, `--surface` fill, hard 6px black/navy shadow.
- Header uses raised navy, 3px divider and optional eyebrow.
- Nested content uses 2px `--border`, no radius.

### Buttons

- 3px border, 0 radius, Press Start 2P at 9–11px, 48–56px height.
- Primary green, secondary electric blue, warning yellow, destructive red, ghost outlined.
- Hover changes fill/contrast without resizing. Active shifts 2px and removes hard shadow.
- Disabled uses semantic `disabled`, 40% opacity and no pointer events.

### Inputs

- Black-navy field, 3px default border, primary green focus border.
- Visible label, helper text, persistent character count for long secret input.
- Errors sit directly below the field with icon, reason and recovery path.
- Password input permits paste/autofill and has an accessible show/hide control.

### Status badges and progress

- 2px border, no radius, icon + uppercase label.
- Progress track is 20px high with an inset 2px border; bar uses transform scale to avoid layout work.
- LIVE = green/check; DIE = red/shield alert; UNKNOWN = yellow/question.

## Motion

- Feedback is quick and mechanical: 100–180ms for hover/press, 250–350ms for result changes.
- Use only opacity and transform. Loading uses stepped pixel blocks.
- Do not animate dense data tables or decorative background elements.
- `prefers-reduced-motion: reduce` collapses all non-essential animation to a static end state.

## Accessibility and interaction

- Normal text contrast ≥4.5:1 and control/icon contrast ≥3:1.
- Global visible focus ring: 3px arcade yellow with 3px offset.
- DOM order follows visual order; native controls are used for all actions.
- Skip link is the first focusable element.
- Dynamic result/error/setting feedback uses an appropriate live region without stealing focus.
- Login supports password managers, paste and keyboard-only completion.
- Sticky/fixed UI never obscures focused elements.

## Security-informed UI rules

- Never render cookie values, credentials, API tokens or session JWTs back to the client.
- Mask IP addresses and expose only hashed result references.
- Admin data views return namespace counts—not values.
- Destructive Redis maintenance requires explicit confirmation and cannot target `NetflixId` or `VN`.
- Honest telemetry: show `DEGRADED`, `MEMORY`, `UNCHECKED` or `UNKNOWN` when a provider is absent; never fake a live signal.

## Responsive acceptance criteria

- Verify at 375, 768, 1024 and 1440px.
- No horizontal page overflow; tables may have a clearly bounded horizontal scroller.
- Primary action remains visible after the input on mobile.
- Guest status moves below the analyzer; Admin navigation becomes a horizontal strip.
- Text wraps naturally without truncating key labels or IDs.
