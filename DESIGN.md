# DESIGN.md — G&Y Sole Art Direction

This file exists because "black + gold, premium" produced a generic AI luxury template: everything center-stacked, every label tracked-out in uppercase, a giant logo floating in a black void, fake "EST. 2026" heritage, and not a single shoe on a page that sells shoes. This brief is the correction. Follow it literally.

## The core principle

**Show product, don't describe it.** This is a sneaker store. Shoes are the content. Any page, section, or hero that talks about sneakers instead of showing them is wrong. The old hero said "curated sneakers from the world's most iconic brands" over an empty black field — that's a failure. A real sneaker site puts a shoe in your face in the first 100 pixels.

## Hard rules (the anti-slop list)

These are the specific patterns that made the first attempt generic. Do not do them.

1. **No tracked-out uppercase as a default.** Wide letter-spacing on uppercase text is the #1 "make it premium" crutch. Allowed in exactly ONE place: the wordmark/logo. Everywhere else — nav, buttons, labels, eyebrows — use normal case and normal tracking. A button says "Shop the collection", not "S H O P  C O L L E C T I O N".
2. **No dead-center stacked hero.** Eyebrow → huge logo → subtitle → outlined button → scroll cue, all centered, is the default template. Use an asymmetric layout: product imagery on one side, type on the other, or a full-bleed editorial shot with text anchored to a corner.
3. **No fake heritage.** No "EST. 2026", no "·" separators imitating old fashion houses, no Roman-numeral cosplay. The brand is new — let it feel new and confident, not like it's pretending to be from 1920.
4. **No ghosted brand-name strip.** Barely-visible evenly-spaced brand names at the bottom is the "trusted by" cliché. If brands appear, use their actual logos at full opacity, or build a real brand-browse section with images.
5. **No empty black voids.** Negative space is fine; vast emptiness with one centered element is not. Fill the page with product, imagery, or real content.
6. **No outlined ghost buttons as the primary CTA.** The thin-gold-border-on-black button is the template default. The primary action should be solid gold with dark text — high contrast, obviously clickable.

## What to do instead

- **Hero:** Lead with a large, high-quality sneaker shot (use the `img/` assets — puma.jpg is high-res). Editorial crop, asymmetric. Type sits beside or over it with a clear hierarchy: one bold headline, one short human sentence, one solid CTA. The headline should sound like a person, e.g. "The shoes worth the shelf space" — not "Welcome to G&Y Sole".
- **Type hierarchy through size and weight, not tracking.** A 64px bold serif headline next to 16px regular body text creates hierarchy on its own. You don't need to space-out letters to signal importance.
- **Product cards are the heart of the site.** Image-first, the shoe filling the frame on a slightly lighter surface, price and name below in plain readable type, stock state as a small dot or text. Hover lifts the card and zooms the image slightly.
- **Asymmetry and grid breaks.** Let some sections be two-column, some full-bleed, some offset. Uniform centered sections read as a template.
- **Real copy.** Write like a sneaker shop that knows its product, not a luxury-brand parody. Confident, plain, occasionally opinionated. No "curated," no "iconic," no "world's leading."

## Palette (refined)

Keep black + gold, but use gold as an *accent*, not a coat of paint. Gold on the logo, primary buttons, key prices, and one or two highlights per view. If everything is gold it stops feeling special.

- Canvas: `#0f0f0f` — Surface (cards): `#1a1a1a` — Elevated/header: `#000000`
- Gold primary: `#d4af37` — Gold hover: `#f0d273` — Gold muted: `#b8860b`
- Text: `#ffffff` — Muted text: `#a0a0a0` (cooler/dimmer than before so gold pops more)
- Consider one subtle warm off-white `#f5f0e6` for large headline text instead of pure white — softer, more expensive-feeling than `#ffffff`.

## Type

- **Display / logo / headlines:** a high-contrast serif (e.g. Playfair Display, Fraunces, or Libre Caslon) — this is where the "premium" feeling actually comes from.
- **UI / body / nav / buttons:** Inter or Geist, normal case, normal tracking.
- Pairing a characterful serif with a clean sans is what carries the brand. Two sans-serifs would read as generic; all-serif would read as dated.

## Spacing & gutters

**Grid and row items must never butt edge-to-edge.** Use a consistent 8px gutter between all grid/flex items — product cards, brand tiles, collection tiles, any future row or grid layout. Edge-to-edge layouts look unfinished and make individual items hard to distinguish.

- Grid gap: `8px` minimum between tiles
- Horizontal scroll rows: `gap: 20px` between cards
- Sections that span full width (no outer padding) should add `padding: 0 clamp(24px, 5vw, 64px)` to the grid wrapper so content breathes from the viewport edge

## The honesty test

Before shipping any view, ask: *if I swapped the logo for a different name, would this look like any other AI-generated luxury site?* If yes, it's not done. The fix is always more specificity — real product imagery, real copy, a layout with a point of view — never more polish on the generic version.
