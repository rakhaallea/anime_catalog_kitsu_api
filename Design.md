---
name: Anime Explorer Design System
description: 3D Claymorphic and Neo-Brutalist UI spec for interactive anime catalog.
colors:
  primary: "#0047AB"
  secondary: "#FFE000"
  background: "#F6EEDF"
  surface: "#FFFDF9"
  text-primary: "#141414"
  text-secondary: "#4B5563"
  border: "#141414"
  success: "#10B981"
  error: "#EF4444"
typography:
  h1:
    fontFamily: "Nunito, Quicksand, sans-serif"
    fontSize: 2.25rem
    fontWeight: 800
    lineHeight: 1.2
  h2:
    fontFamily: "Nunito, Quicksand, sans-serif"
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.3
  body-md:
    fontFamily: "Nunito, Quicksand, sans-serif"
    fontSize: 0.95rem
    fontWeight: 500
    lineHeight: 1.5
  label-sm:
    fontFamily: "Nunito, Quicksand, sans-serif"
    fontSize: 0.8rem
    fontWeight: 700
rounded:
  md: 12px
  lg: 20px
  xl: 28px
  full: 9999px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    border: "2px solid {colors.border}"
    padding: "{spacing.lg}"
  input:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    border: "2px solid {colors.border}"
    padding: "10px 14px"
---

## Overview
A playful, retro-toy aesthetic combining 3D claymorphic curves with sharp neo-brutalist accents. Built for interactive exploration with high visual engagement.

## Colors
- Primary (#0047AB): Main CTAs, window headers, and key interactive highlights.
- Secondary (#FFE000): Category tags, badge accents, and attention grabbers.
- Background (#F6EEDF) & Surface (#FFFDF9): Neutral warm base to keep vibrant accents readable.

## Typography
Rounded geometric sans-serif throughout. Bold weights prioritized for expressive, cartoon-like hierarchy.

## Spacing & Layout
Grid-first layout using 8px rhythm. Minimum 16px gap for cards to maintain breathing room around 3D shadows.

## Shapes & Elevation
Extreme rounded corners (28px) balanced with 2px-3px solid borders and soft directional drop shadows for tactile depth.

## Rules to Never Break
- Never use sharp 0px corners on containers or buttons.
- Never use thin light-gray hairline borders.
- Always preserve high contrast between text and background surfaces.