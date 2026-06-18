# Product

## Register

brand

## Users

Sneaker shoppers browsing for themselves or family (Men / Women / Kids collections). They arrive expecting to *see* shoes immediately, scan a small but real catalog (5 brands, 8 styles), and recognize whether the store has taste before they trust it with a purchase. Secondary audience: the people reviewing this as a portfolio piece, judging craft and design judgment.

Built by Yahia and Ghafer. Originally a school project (static HTML/CSS/PHP), now rebuilt as a React SPA on a PHP REST API. Runs on localhost only; no production deployment, but written as if it could ship.

## Product Purpose

G&Y Sole is a black-and-gold sneaker storefront. It exists to sell a curated, deliberately small catalog and to look like a real shop run by people who know sneakers, not a template. Success is the honesty test: swap the logo for another name and it should *not* read as a generic AI luxury site. The store front carries the identity; the catalog, cart, auth, and admin flows carry the function.

This build's win is a **portfolio showpiece**: the design and craft are the deliverable, so every view is battle-tested (screenshot, inspect, fix, repeat) rather than left at first-draft.

## Brand Personality

Confident, plain-spoken, occasionally opinionated. A new brand that acts new and sure of itself, not one cosplaying heritage. Three words: **bold, editorial, grounded.**

Voice writes like a sneaker shop that knows its product: "The shoes worth the shelf space," not "curated sneakers from the world's most iconic brands." No "curated," no "iconic," no "world's leading." Black and gold, with gold as a deliberate accent (logo, primary CTAs, key prices, one or two highlights per view), never a coat of paint.

## Anti-references

The first build of this site, and the generic "black + gold, premium" AI luxury template it produced, are the explicit anti-reference. Do not reproduce:

- Tracked-out uppercase as a default (allowed only on the wordmark).
- Dead-center stacked hero: eyebrow → huge logo → subtitle → outlined button, all centered.
- Fake heritage: "EST. 2026", `·` separators, Roman-numeral cosplay.
- Ghosted "trusted by" brand-name strips; ghost-outline buttons as the primary CTA.
- Empty black voids: vast emptiness with one centered element instead of product.
- Any page that *talks about* sneakers instead of *showing* them.

Full rationale and the rest of the list live in DESIGN.md, which is the canonical correction document.

## Design Principles

1. **Show product, don't describe it.** This is a sneaker store; shoes are the content. Any section that talks about shoes instead of putting one in front of the user is wrong. Lead with the product in the first 100 pixels.
2. **Confident, not luxury-cosplay.** The brand is new and owns it. Plain confident copy and asymmetric editorial layout beat fake heritage and tracked-out "premium" signaling.
3. **Specificity over polish.** When a view feels generic, the fix is always more specificity (real imagery, real copy, a layout with a point of view), never more sheen on the generic version. Run the honesty test before calling anything done.
4. **Craft is the pitch.** Because the build is a portfolio piece, the execution *is* the product: consistent gutters, aligned grids, real hover/active states, tested at every breakpoint. No first-draft views ship.
5. **Gold earns its place.** Restraint is the identity. Gold marks the few things that matter; if everything is gold, nothing is.

## Accessibility & Inclusion

Target: **WCAG AAA.** Body text aims for 7:1 contrast against its background; large text 4.5:1. This constrains the dark palette directly: muted greys on `#0f0f0f` and gold `#d4af37` on dark must be checked against the AAA threshold rather than assumed, and bumped toward the ink/headline end where they fall short. `prefers-reduced-motion: reduce` alternatives are already wired across the homepage and catalog and stay mandatory for any new motion. Every product image carries real alt text; interactive controls keep visible focus states and accessible labels.
