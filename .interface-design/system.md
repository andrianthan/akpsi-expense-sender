# AKPSI Expense Sender — Design System

## Direction
Modern SaaS tool feel with AKP brand colors. Clean, professional, administrative. Think Vercel/Linear aesthetic applied to a fraternity finance tool. The interface is invisible — only the receipt data matters.

## Palette
- **Brand primary:** `#1B3A6B` (AKP navy) — headers, buttons, active states, links
- **Brand accent:** `#C9A84C` (AKP gold) — amounts, completed steps, receipt numbers, emphasis only
- **Canvas:** `#F4F6F9` — page background
- **Surface:** `#FFFFFF` — cards, inputs
- **Border:** `border-slate-200` / `border-slate-100` — standard / subtle separator
- **Text primary:** `text-slate-900`
- **Text secondary:** `text-slate-700`
- **Text muted:** `text-slate-400`
- **Error:** `border-red-300 bg-red-50 text-red-500`
- **Success:** `bg-green-50 text-green-500`

Gold is reserved for: amounts, completed step connectors/dots, receipt numbers. Never use gold decoratively.

## Depth Strategy
**Borders + subtle shadow.** Cards use `border border-slate-200/80 shadow-sm`. No dramatic drop shadows. Inputs use `border-slate-200` only — no shadow.

## Surfaces / Elevation
- Page canvas: `bg-[#F4F6F9]`
- Cards: `bg-white rounded-2xl border border-slate-200/80 shadow-sm`
- Card section separator: `border-b border-slate-100`
- Inputs: `bg-white border border-slate-200` (slightly inset feel)

## Typography
- System font via Inter (Next.js `next/font/google`)
- Card title: `text-lg font-semibold text-[#1B3A6B]`
- Section label: `text-sm font-medium text-slate-700`
- Muted descriptor: `text-sm text-slate-400`
- Micro label (header tag): `text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-400`
- Receipt number / amount: `font-bold text-[#C9A84C]`

## Spacing
Base unit: `4px` (Tailwind default). Common: `px-8 py-6` for card sections, `py-7` for form body, `space-y-5` for form fields, `gap-4` for grid columns.

## Border Radius
- Cards / modals: `rounded-2xl`
- Inputs / buttons: `rounded-lg`
- Badges / pills: `rounded-full`

## Layout
- Max width form pages: `max-w-2xl mx-auto`
- Max width preview page: `max-w-3xl mx-auto`
- Page padding: `px-4 py-8`
- Header height: `h-16`

## Header Pattern
```tsx
<header className="bg-white border-b border-slate-200">
  <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
    <img src="/akp-logo.png" alt="Alpha Kappa Psi" className="h-9 w-auto" />
    <span className="text-[11px] font-semibold text-slate-400 tracking-[0.15em] uppercase">
      Omega Phi · SJSU
    </span>
  </div>
</header>
```

## Card Pattern
```tsx
<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
  <div className="px-8 py-6 border-b border-slate-100">
    <h1 className="text-lg font-semibold text-[#1B3A6B]">Title</h1>
    <p className="text-sm text-slate-400 mt-0.5">Subtitle</p>
  </div>
  <div className="px-8 py-7">
    {/* content */}
  </div>
</div>
```

## Input Pattern
```tsx
const inputNormal = "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-[#1B3A6B] focus:ring-[#1B3A6B]/10 transition-colors bg-white";
const inputError  = "w-full px-3.5 py-2.5 rounded-lg border border-red-300 bg-red-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-red-400 focus:ring-red-100 transition-colors";
```

## Button Patterns
```tsx
// Primary
"py-2.5 px-6 bg-[#1B3A6B] hover:bg-[#142d54] active:bg-[#0f2240] text-white font-semibold rounded-lg transition-colors text-sm"

// Secondary / outline
"py-2.5 px-4 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"

// Disabled state
"disabled:bg-slate-200 disabled:text-slate-400"
```

## Step Indicator
Component: `components/Steps.tsx`. Props: `current: 1 | 2 | 3`.
- Upcoming: `bg-slate-200 text-slate-400`
- Active: `bg-[#1B3A6B] text-white`
- Completed: `bg-[#C9A84C] text-white` with gold connector line

## Signature Elements
1. **Gold amount** — expense amounts always displayed in `text-[#C9A84C] font-bold`, never plain text
2. **Step indicator** — navy active → gold completed, mirrors the receipt workflow
3. **Logo-first header** — AKP horizontal logo left-anchored, no colored header bar on web UI
4. **Card section headers** — `border-b border-slate-100` divides title from content inside every card
