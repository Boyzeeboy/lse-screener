# DESIGN.md -- @shadcn/ui - Design System (Community)

<!-- extraction-meta
source: Figma file "@shadcn/ui - Design System (Community)"
scope: entire file (6 pages)
date: 2026-06-17
nodes-scanned: 6284
confidence: { extracted: 100%, inferred: 0%, known: 0% }
-->

## 1. Identity

**In one line:** A design system using Inter, Menlo with 224 unique colors extracted directly from Figma.

**Signature Techniques:**
- Consistent auto-layout spacing system
- Rounded shape language (12px+ radii)
- Layered shadow system for depth
- Component library with 998 defined components

## 2. Structure

High-level composition of the design, extracted from Figma pages and top-level frames. Each entry shows the frame name, type, dimensions, and auto-layout direction.

### Page: Cover

_1 top-level frame(s)_

- **Cover** · `FRAME` · 1152×700 · 1 children
  - **Frame 7** · `FRAME` · 976×654 · vertical stack, gap 24px · 2 children
    - **Frame 7** · `FRAME` · 976×596 · vertical stack, gap 12px · 2 children
      - **Frame 7** · `FRAME` · 976×160 · vertical stack, gap 12px · 2 children
        - _...and 2 more_
      - **Frame 1** · `FRAME` · 976×424 · horizontal row, gap 56px · 3 children
        - _...and 3 more_
    - **footer** · `FRAME` · 976×34 · horizontal row, gap 32px · 2 children
      - **This figma file was made with love by @skirano** · `TEXT` · 832×28 · “This figma file was made with love by @skirano”
      - **Frame 7** · `FRAME` · 112×34 · horizontal row, gap 16px · 2 children
        - _...and 2 more_

### Page: Components

_27 top-level frame(s)_

- **Separator** · `FRAME` · 792×390 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **separator** · `COMPONENT` · 252×90 · vertical stack, gap 16px · 3 children
    - **top** · `FRAME` · 252×38 · vertical stack, gap 4px · 2 children
      - **Radix Primitives** · `TEXT` · 107×14 · “Radix Primitives”
      - **An open-source UI component library.** · `TEXT` · 252×20 · “An open-source UI component library.”
    - **Line 3** · `LINE`
    - **bottom** · `FRAME` · 175×20 · horizontal row, gap 16px · 5 children
      - **Blog** · `TEXT` · 30×20 · “Blog”
      - **Line 4** · `LINE`
      - **Docs** · `TEXT` · 34×20 · “Docs”
      - **Line 5** · `LINE`
      - **Source** · `TEXT` · 47×20 · “Source”

- **Slider** · `FRAME` · 792×308 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **slider** · `COMPONENT` · 414×8 · 3 children
    - **area** · `RECTANGLE` · 414×8
    - **progress** · `RECTANGLE` · 207×8
    - **indicator** · `ELLIPSE` · 20×20

- **Switch** · `FRAME` · 792×324 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **switch** · `INSTANCE` · 149×24 · horizontal row, gap 8px · 2 children
    - **toggle** · `GROUP` · 44×24 · 2 children
      - **Rectangle 2** · `RECTANGLE` · 44×24
      - **Ellipse 2** · `ELLIPSE` · 20×20
    - **Label** · `TEXT` · 97×14 · “Airplane mode”

- **Tabs** · `FRAME` · 792×644 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **tabs and content** · `COMPONENT` · 400×344 · vertical stack, gap 8px · 2 children
    - **tabs** · `INSTANCE` · 180×42 · horizontal row, padding 5px · 2 children
      - **tab item** · `INSTANCE` · 80×32 · horizontal row, gap 10px, padding 6/12/6/12px · 1 children
        - _...and 1 more_
      - **tab item** · `INSTANCE` · 90×32 · horizontal row, gap 10px, padding 6/12/6/12px · 1 children
        - _...and 1 more_
    - **tab card** · `INSTANCE` · 400×294 · vertical stack, gap 25px, padding 25px · 1 children
      - **Frame 1** · `FRAME` · 350×244 · vertical stack, gap 16px · 3 children
        - _...and 3 more_

- **Text Area** · `FRAME` · 792×426 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **textarea** · `INSTANCE` · 530×126 · vertical stack, gap 6px · 1 children
    - **Frame 3** · `FRAME` · 530×126 · vertical stack, gap 8px · 1 children
      - **Group 2** · `GROUP` · 530×126 · 3 children
        - _...and 3 more_

- **Tooltip** · `FRAME` · 792×334 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **tooltip** · `COMPONENT` · 117×34 · horizontal row, gap 10px, padding 7/13/7/13px · 1 children
    - **Add to library** · `TEXT` · 91×20 · “Add to library”

- **Popover** · `FRAME` · 792×565 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **popover** · `COMPONENT` · 320×265 · vertical stack, gap 16px, padding 17px · 2 children
    - **Frame 6** · `FRAME` · 286×44 · vertical stack, gap 8px · 2 children
      - **Dimensions** · `TEXT` · 89×16 · “Dimensions”
      - **Set the dimensions for the layer.** · `TEXT` · 286×20 · “Set the dimensions for the layer.”
    - **Frame 6** · `FRAME` · 286×171 · vertical stack, gap 9px · 4 children
      - **input** · `INSTANCE` · 286×36 · vertical stack, gap 6px · 1 children
        - _...and 1 more_
      - **input** · `INSTANCE` · 286×36 · vertical stack, gap 6px · 1 children
        - _...and 1 more_
      - **input** · `INSTANCE` · 286×36 · vertical stack, gap 6px · 1 children
        - _...and 1 more_
      - **input** · `INSTANCE` · 286×36 · vertical stack, gap 6px · 1 children
        - _...and 1 more_

- **Progress** · `FRAME` · 792×316 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **progress** · `COMPONENT` · 414×16 · 2 children
    - **area** · `RECTANGLE` · 414×16
    - **progress** · `RECTANGLE` · 284×16

- **Radio Group** · `FRAME` · 792×364 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **radio group** · `COMPONENT` · 108×64 · vertical stack, gap 8px · 3 children
    - **radio button** · `INSTANCE` · 73×16 · horizontal row, gap 8px · 2 children
      - **Ellipse 4** · `ELLIPSE` · 16×16
      - **Default** · `TEXT` · 49×14 · “Default”
    - **radio button** · `INSTANCE` · 108×16 · horizontal row, gap 8px · 2 children
      - **Group 6** · `GROUP` · 16×16 · 2 children
        - _...and 2 more_
      - **Default** · `TEXT` · 84×14 · “Comfortable”
    - **radio button** · `INSTANCE` · 85×16 · horizontal row, gap 8px · 2 children
      - **Ellipse 4** · `ELLIPSE` · 16×16
      - **Default** · `TEXT` · 61×14 · “Compact”

- **Scroll Area** · `FRAME` · 792×578 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **scroll-area** · `COMPONENT` · 190×278 · vertical stack, gap 16px, padding 16px · 2 children
    - **Tags** · `TEXT` · 33×14 · “Tags”
    - **content** · `FRAME` · 158×216 · vertical stack · 6 children
      - **scroll list item** · `INSTANCE` · 158×36 · vertical stack · 2 children
        - _...and 2 more_
      - **scroll list item** · `INSTANCE` · 158×36 · vertical stack · 2 children
        - _...and 2 more_
      - **scroll list item** · `INSTANCE` · 158×36 · vertical stack · 2 children
        - _...and 2 more_
      - **scroll list item** · `INSTANCE` · 158×36 · vertical stack · 2 children
        - _...and 2 more_
      - **scroll list item** · `INSTANCE` · 158×36 · vertical stack · 2 children
        - _...and 2 more_
      - **scroll list item** · `INSTANCE` · 158×36 · vertical stack · 2 children
        - _...and 2 more_

- **Select** · `FRAME` · 792×856 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **Frame 7** · `FRAME` · 204×556 · vertical stack, gap 6px · 2 children
    - **select** · `COMPONENT` · 204×40 · horizontal row, gap 10px, padding 8/12/8/12px · 2 children
      - **Select an option** · `TEXT` · 154×24 · “Select an option”
      - **icon/chevron-down** · `INSTANCE` · 16×16 · 1 children
        - _...and 1 more_
    - **select options** · `COMPONENT` · 204×510 · horizontal row · 1 children
      - **Frame 3** · `FRAME` · 204×510 · vertical stack · 10 children
        - _...and 10 more_

- **Hover Card** · `FRAME` · 792×390 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×112 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×80 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×80 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **hover card** · `COMPONENT` · 320×118 · horizontal row, gap 16px, padding 17px · 2 children
    - **Ellipse 1** · `ELLIPSE` · 40×40
    - **Frame 7** · `FRAME` · 230×84 · vertical stack, gap 4px · 3 children
      - **@nextjs** · `TEXT` · 56×20 · “@nextjs”
      - **The React Framework - created and maintained by @vercel** · `TEXT` · 230×40 · “The React Framework - created and maintained by @vercel”
      - **Frame 2** · `FRAME` · 230×16 · horizontal row, gap 4px · 2 children
        - _...and 2 more_

- **Inout** · `FRAME` · 792×392 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **input** · `INSTANCE` · 384×92 · vertical stack, gap 6px · 3 children
    - **Email** · `TEXT` · 36×20 · “Email”
    - **input/with button** · `FRAME` · 384×40 · horizontal row, gap 8px · 2 children
      - **default** · `FRAME` · 276×40 · vertical stack, gap 6px · 1 children
        - _...and 1 more_
      - **button** · `FRAME` · 100×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
        - _...and 1 more_
    - **Enter your email address** · `TEXT` · 164×20 · “Enter your email address”

- **Label** · `FRAME` · 792×314 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **label** · `COMPONENT` · 207×14 · horizontal row, gap 8px · 2 children
    - **Rectangle 1** · `RECTANGLE` · 14×14
    - **Accept terms and condition** · `TEXT` · 185×14 · “Accept terms and condition”

- **Menubar** · `FRAME` · 792×534 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×140 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 725×108 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 584×108 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **menubar and content** · `COMPONENT` · 233×234 · vertical stack, gap 4px · 2 children
    - **menubar** · `INSTANCE` · 233×40 · horizontal row, padding 4/5/4/5px · 4 children
      - **menubar item** · `INSTANCE` · 48×32 · horizontal row, padding 6/12/6/12px · 1 children
        - _...and 1 more_
      - **menubar item** · `INSTANCE` · 50×32 · horizontal row, padding 6/12/6/12px · 1 children
        - _...and 1 more_
      - **menubar item** · `INSTANCE` · 58×32 · horizontal row, padding 6/12/6/12px · 1 children
        - _...and 1 more_
      - **menubar item** · `INSTANCE` · 67×32 · horizontal row, padding 6/12/6/12px · 1 children
        - _...and 1 more_
    - **menu bar content** · `INSTANCE` · 192×190 · horizontal row · 1 children
      - **Frame 3** · `FRAME` · 192×190 · vertical stack · 7 children
        - _...and 7 more_

_...and 12 more frame(s) on this page_

### Page: Typography

_1 top-level frame(s)_

- **Typography** · `FRAME` · 1033×3244 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 969×112 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 969×80 · horizontal row · 2 children
      - **Frame 8** · `FRAME` · 873×80 · vertical stack, gap 16px · 2 children
        - _...and 2 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **Frame 16** · `FRAME` · 969×2972 · vertical stack, gap 56px · 26 children
    - **Frame 7** · `FRAME` · 716×164 · vertical stack, gap 32px · 2 children
      - **h1** · `TEXT` · 32×36 · “h1”
      - **Taxing Laughter: The Joke Tax Chronicles** · `TEXT` · 716×96 · “Taxing Laughter: The Joke Tax  / Chronicles”
    - **Line 3** · `LINE`
    - **Frame 8** · `FRAME` · 969×104 · vertical stack, gap 32px · 2 children
      - **h2** · `TEXT` · 37×36 · “h2”
      - **The People of the Kingdom** · `TEXT` · 969×36 · “The People of the Kingdom”
    - **Line 4** · `LINE`
    - **Frame 9** · `FRAME` · 969×100 · vertical stack, gap 32px · 2 children
      - **h3** · `TEXT` · 38×36 · “h3”
      - **The Joke Tax** · `TEXT` · 969×32 · “The Joke Tax”
    - **Line 5** · `LINE`
    - **Frame 10** · `FRAME` · 969×96 · vertical stack, gap 32px · 2 children
      - **h4** · `TEXT` · 39×36 · “h4”
      - **People stopped telling jokes** · `TEXT` · 270×28 · “People stopped telling jokes”
    - **Line 6** · `LINE`
    - **Frame 11** · `FRAME` · 969×124 · vertical stack, gap 32px · 2 children
      - **p** · `TEXT` · 19×36 · “p”
      - **The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.** · `TEXT` · 686×56 · “The king, seeing how much happier his subjects were, real...”
    - **Line 7** · `LINE`
    - **Frame 12** · `FRAME` · 969×116 · vertical stack, gap 32px · 2 children
      - **blockquote** · `TEXT` · 161×36 · “blockquote”
      - **Group 1** · `GROUP` · 680×48 · 2 children
        - _...and 2 more_
    - **Line 15** · `LINE`
    - _...and 14 more_

### Page: Colors

_1 top-level frame(s)_

- **Tooltip** · `FRAME` · 792×313 · vertical stack, gap 64px, padding 32/32/64/32px · 2 children
  - **Frame 8** · `FRAME` · 728×72 · vertical stack, gap 32px · 2 children
    - **Frame 8** · `FRAME` · 728×40 · horizontal row, gap 45px · 2 children
      - **Frame 8** · `FRAME` · 587×36 · vertical stack, gap 16px · 1 children
        - _...and 1 more_
      - **Group 6** · `GROUP` · 96×40 · 1 children
        - _...and 1 more_
    - **Line 2** · `LINE`
  - **slate** · `FRAME` · 701×81 · horizontal row, gap 16px · 2 children
    - **Slate** · `TEXT` · 63×24 · “Slate”
    - **row of colors** · `FRAME` · 622×81 · horizontal row, gap 8px · 10 children
      - **palette** · `INSTANCE` · 55×81 · 1 children
        - _...and 1 more_
      - **palette** · `INSTANCE` · 55×81 · 1 children
        - _...and 1 more_
      - **palette** · `INSTANCE` · 55×81 · 1 children
        - _...and 1 more_
      - **palette** · `INSTANCE` · 55×81 · 1 children
        - _...and 1 more_
      - **palette** · `INSTANCE` · 55×81 · 1 children
        - _...and 1 more_
      - **palette** · `INSTANCE` · 55×81 · 1 children
        - _...and 1 more_
      - **palette** · `INSTANCE` · 55×81 · 1 children
        - _...and 1 more_
      - **palette** · `INSTANCE` · 55×81 · 1 children
        - _...and 1 more_
      - **palette** · `INSTANCE` · 55×81 · 1 children
        - _...and 1 more_
      - **palette** · `INSTANCE` · 55×81 · 1 children
        - _...and 1 more_

### Page: Primitives

_26 top-level frame(s)_

- **button** · `COMPONENT_SET` · 205×964 · vertical stack, gap 10px, padding 20px · 19 children
  - **type=default, state=Default** · `COMPONENT` · 93×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
    - **Continue** · `TEXT` · 61×24 · “Continue”
  - **type=primary button, state=hover** · `COMPONENT` · 93×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
    - **Continue** · `TEXT` · 61×24 · “Continue”
  - **type=destructive, state=Default** · `COMPONENT` · 110×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
    - **Destructive** · `TEXT` · 78×24 · “Destructive”
  - **type=destructive, state=hover** · `COMPONENT` · 110×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
    - **Destructive** · `TEXT` · 78×24 · “Destructive”
  - **type=outline, state=Default** · `COMPONENT` · 79×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
    - **Cancel** · `TEXT` · 47×24 · “Cancel”
  - **type=outline, state=hover** · `COMPONENT` · 79×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
    - **Cancel** · `TEXT` · 47×24 · “Cancel”
  - **type=subtle, state=Default** · `COMPONENT` · 76×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
    - **Subtle** · `TEXT` · 44×24 · “Subtle”
  - **type=subtle, state=hover** · `COMPONENT` · 76×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
    - **Subtle** · `TEXT` · 44×24 · “Subtle”
  - **type=ghost, state=Default** · `COMPONENT` · 73×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
    - **Ghost** · `TEXT` · 41×24 · “Ghost”
  - **type=ghost, state=hover** · `COMPONENT` · 73×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
    - **Ghost** · `TEXT` · 41×24 · “Ghost”
  - **type=link, state=Default** · `COMPONENT` · 60×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
    - **Link** · `TEXT` · 28×24 · “Link”
  - **type=link, state=hover** · `COMPONENT` · 60×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
    - **Link** · `TEXT` · 28×24 · “Link”
  - _...and 7 more_

- **section items** · `COMPONENT_SET` · 286×520 · vertical stack, gap 30px, padding 20px · 5 children
  - **type=divider** · `COMPONENT` · vertical stack · 1 children
    - **Line 1** · `LINE`
  - **type=top section** · `COMPONENT` · 246×138 · vertical stack, padding 5px · 4 children
    - **menu item** · `INSTANCE` · 236×32 · horizontal row, gap 8px, padding 6/8/6/32px · 5 children
      - **⇤** · `TEXT` · 15×20 · “⇤”
      - **icon/mail** · `INSTANCE` · 16×16 · 2 children
        - _...and 2 more_
      - **Menu Item** · `TEXT` · 171×20 · “Back”
      - **⌘⇧B︎** · `TEXT` · 17×20 · “⌘[”
      - **secondary icon** · `INSTANCE` · 16×16 · 1 children
        - _...and 1 more_
    - **menu item** · `INSTANCE` · 236×32 · horizontal row, gap 8px, padding 6/8/6/32px · 5 children
      - **⇤** · `TEXT` · 15×20 · “⇤”
      - **icon/mail** · `INSTANCE` · 16×16 · 2 children
        - _...and 2 more_
      - **Menu Item** · `TEXT` · 171×20 · “Forward”
      - **⌘⇧B︎** · `TEXT` · 17×20 · “⌘]”
      - **secondary icon** · `INSTANCE` · 16×16 · 1 children
        - _...and 1 more_
    - **menu item** · `INSTANCE` · 236×32 · horizontal row, gap 8px, padding 6/8/6/32px · 5 children
      - **⇤** · `TEXT` · 15×20 · “⇤”
      - **icon/mail** · `INSTANCE` · 16×16 · 2 children
        - _...and 2 more_
      - **Menu Item** · `TEXT` · 168×20 · “Reload”
      - **⌘⇧B︎** · `TEXT` · 20×20 · “⌘R”
      - **secondary icon** · `INSTANCE` · 16×16 · 1 children
        - _...and 1 more_
    - **menu item** · `INSTANCE` · 236×32 · horizontal row, gap 8px, padding 6/8/6/32px · 5 children
      - **⇤** · `TEXT` · 15×20 · “⇤”
      - **icon/mail** · `INSTANCE` · 16×16 · 2 children
        - _...and 2 more_
      - **Menu Item** · `TEXT` · 172×20 · “More Tools”
      - **⌘⇧B︎** · `TEXT` · 20×20 · “⌘R”
      - **secondary icon** · `INSTANCE` · 16×16 · 1 children
        - _...and 1 more_
  - **type=middle section** · `COMPONENT` · 246×74 · vertical stack, gap 10px, padding 5px · 1 children
    - **Frame 4** · `FRAME` · 236×64 · vertical stack · 2 children
      - **menu item** · `INSTANCE` · 236×32 · horizontal row, gap 8px, padding 6/8/6/8px · 5 children
        - _...and 5 more_
      - **menu item** · `INSTANCE` · 236×32 · horizontal row, gap 8px, padding 6/8/6/32px · 5 children
        - _...and 5 more_
  - **type=title section** · `COMPONENT` · 246×42 · vertical stack, gap 10px, padding 5px · 1 children
    - **menu item** · `INSTANCE` · 236×32 · horizontal row, gap 8px, padding 6/8/6/32px · 1 children
      - **Section Title** · `TEXT` · 196×20 · “People ”
  - **type=bottom section** · `COMPONENT` · 246×106 · vertical stack, gap 10px, padding 5px · 1 children
    - **Frame 4** · `FRAME` · 236×96 · vertical stack · 3 children
      - **menu item** · `INSTANCE` · 236×32 · horizontal row, gap 8px, padding 6/8/6/32px · 5 children
        - _...and 5 more_
      - **menu item** · `INSTANCE` · 236×32 · horizontal row, gap 8px, padding 6/8/6/32px · 5 children
        - _...and 5 more_
      - **menu item** · `INSTANCE` · 236×32 · horizontal row, gap 8px, padding 6/8/6/32px · 5 children
        - _...and 5 more_

- **menu item** · `COMPONENT_SET` · 266×208 · vertical stack, gap 20px, padding 10px · 4 children
  - **State=default, type=default** · `COMPONENT` · 236×32 · horizontal row, gap 8px, padding 6/8/6/8px · 5 children
    - **⇤** · `TEXT` · 15×20 · “⇤”
    - **icon/mail** · `INSTANCE` · 16×16 · 2 children
      - **Vector** · `VECTOR` · 13×11
      - **Vector** · `VECTOR` · 13×4
    - **Menu Item** · `TEXT` · 131×20 · “Menu Item”
    - **⌘⇧B︎** · `TEXT` · 33×20 · “⌘⇧B︎”
    - **secondary icon** · `INSTANCE` · 16×16 · 1 children
      - **Vector** · `VECTOR` · 4×8
  - **State=diabled, type=default** · `COMPONENT` · 236×32 · horizontal row, gap 8px, padding 6/8/6/8px · 5 children
    - **⇤** · `TEXT` · 15×20 · “⇤”
    - **icon/mail** · `INSTANCE` · 16×16 · 2 children
      - **Vector** · `VECTOR` · 13×11
      - **Vector** · `VECTOR` · 13×4
    - **Menu Item** · `TEXT` · 131×20 · “Menu Item”
    - **⌘⇧B︎** · `TEXT` · 33×20 · “⌘⇧B︎”
    - **secondary icon** · `INSTANCE` · 16×16 · 1 children
      - **Vector** · `VECTOR` · 4×8
  - **State=Default, type=section title** · `COMPONENT` · 236×32 · horizontal row, gap 8px, padding 6/8/6/32px · 1 children
    - **Section Title** · `TEXT` · 196×20 · “Section Title”
  - **State=hover, type=default** · `COMPONENT` · 236×32 · horizontal row, gap 8px, padding 6/8/6/8px · 5 children
    - **⇤** · `TEXT` · 15×20 · “⇤”
    - **icon/mail** · `INSTANCE` · 16×16 · 2 children
      - **Vector** · `VECTOR` · 13×11
      - **Vector** · `VECTOR` · 13×4
    - **Menu Item** · `TEXT` · 131×20 · “Menu Item”
    - **⌘⇧B︎** · `TEXT` · 33×20 · “⌘⇧B︎”
    - **secondary icon** · `INSTANCE` · 16×16 · 1 children
      - **Vector** · `VECTOR` · 4×8

- **menu section title** · `COMPONENT_SET` · 286×150 · 2 children
  - **type=with padding left** · `COMPONENT` · 246×42 · vertical stack, gap 10px, padding 5/0/5/0px · 1 children
    - **list** · `FRAME` · 246×32 · horizontal row, gap 30px, padding 6/8/6/32px · 3 children
      - **⇤** · `TEXT` · 15×20 · “⇤”
      - **People** · `TEXT` · 206×20 · “People”
      - **↩︎** · `TEXT` · 17×20 · “↩︎”
  - **type=default** · `COMPONENT` · 246×42 · vertical stack, gap 10px, padding 5/0/5/0px · 1 children
    - **list** · `FRAME` · 246×32 · horizontal row, gap 30px, padding 6/8/6/8px · 3 children
      - **⇤** · `TEXT` · 15×20 · “⇤”
      - **People** · `TEXT` · 230×20 · “People”
      - **↩︎** · `TEXT` · 17×20 · “↩︎”

- **tab item** · `COMPONENT_SET` · 210×72 · 2 children
  - **state=selected** · `COMPONENT` · 83×32 · horizontal row, gap 10px, padding 6/12/6/12px · 1 children
    - **Selected** · `TEXT` · 59×20 · “Selected”
  - **state=unselected** · `COMPONENT` · 101×32 · horizontal row, gap 10px, padding 6/12/6/12px · 1 children
    - **Unselected** · `TEXT` · 77×20 · “Unselected”

- **accordion Item** · `COMPONENT_SET` · 490×236 · 2 children
  - **State=closed** · `COMPONENT` · 450×56 · horizontal row, gap 18px, padding 16/0/16/0px · 2 children
    - **Is it accessible** · `TEXT` · 416×24 · “Is it accessible”
    - **chevron-down** · `FRAME` · 16×16 · 1 children
      - **Vector** · `VECTOR` · 8×4
  - **State=open** · `COMPONENT` · 450×92 · vertical stack, padding 0/0/16/0px · 2 children
    - **Accordio item Opened** · `FRAME` · 450×56 · horizontal row, gap 18px, padding 16/0/16/0px · 2 children
      - **Is it accessible** · `TEXT` · 416×24 · “Is it accessible”
      - **chevron-down** · `FRAME` · 16×16 · 1 children
        - _...and 1 more_
    - **Yes. It adheres to the WAI-ARIA design pattern.** · `TEXT` · 313×20 · “Yes. It adheres to the WAI-ARIA design pattern.”

- **menubar item** · `COMPONENT_SET` · 167×72 · 2 children
  - **state=default** · `COMPONENT` · 48×32 · horizontal row, padding 6/12/6/12px · 1 children
    - **File** · `TEXT` · 24×20 · “File”
  - **state=selected** · `COMPONENT` · 50×32 · horizontal row, padding 6/12/6/12px · 1 children
    - **Edit** · `TEXT` · 26×20 · “Edit”

- **menubar** · `COMPONENT` · 233×40 · horizontal row, padding 4/5/4/5px · 4 children
  - **menubar item** · `INSTANCE` · 48×32 · horizontal row, padding 6/12/6/12px · 1 children
    - **File** · `TEXT` · 24×20 · “File”
  - **menubar item** · `INSTANCE` · 50×32 · horizontal row, padding 6/12/6/12px · 1 children
    - **File** · `TEXT` · 26×20 · “Edit”
  - **menubar item** · `INSTANCE` · 58×32 · horizontal row, padding 6/12/6/12px · 1 children
    - **Edit** · `TEXT` · 34×20 · “View”
  - **menubar item** · `INSTANCE` · 67×32 · horizontal row, padding 6/12/6/12px · 1 children
    - **File** · `TEXT` · 43×20 · “Profile”

- **tab card** · `COMPONENT` · 400×294 · vertical stack, gap 25px, padding 25px · 1 children
  - **Frame 1** · `FRAME` · 350×244 · vertical stack, gap 16px · 3 children
    - **Make changes to your account here. Click save when you're done.** · `TEXT` · 350×40 · “Make changes to your account here. Click save when you're...”
    - **Frame 1** · `FRAME` · 350×132 · vertical stack, gap 8px · 2 children
      - **input** · `INSTANCE` · 350×62 · vertical stack, gap 6px · 3 children
        - _...and 3 more_
      - **input** · `INSTANCE` · 350×62 · vertical stack, gap 6px · 3 children
        - _...and 3 more_
    - **button** · `INSTANCE` · 127×40 · horizontal row, gap 10px, padding 8/16/8/16px · 1 children
      - **Continue** · `TEXT` · 95×24 · “Save changed”

- **tabs** · `COMPONENT` · 180×42 · horizontal row, padding 5px · 2 children
  - **tab item** · `INSTANCE` · 80×32 · horizontal row, gap 10px, padding 6/12/6/12px · 1 children
    - **Selected** · `TEXT` · 56×20 · “Account”
  - **tab item** · `INSTANCE` · 90×32 · horizontal row, gap 10px, padding 6/12/6/12px · 1 children
    - **Unselected** · `TEXT` · 66×20 · “Password”

- **navigation menu item** · `COMPONENT_SET` · 677×76 · 4 children
  - **type=dropdown, state=default** · `COMPONENT` · 150×36 · vertical stack, gap 10px, padding 8/16/8/16px · 1 children
    - **Group 3** · `GROUP` · 118×20 · 1 children
      - **Frame 3** · `FRAME` · 118×20 · horizontal row, gap 4px · 2 children
        - _...and 2 more_
  - **type=Default, state=selected** · `COMPONENT` · 150×36 · vertical stack, gap 10px, padding 8/16/8/16px · 1 children
    - **Group 3** · `GROUP` · 118×20 · 1 children
      - **Frame 3** · `FRAME` · 118×20 · horizontal row, gap 4px · 2 children
        - _...and 2 more_
  - **type=link, state=selected** · `COMPONENT` · 134×36 · vertical stack, gap 10px, padding 8/16/8/16px · 1 children
    - **Group 3** · `GROUP` · 102×20 · 1 children
      - **Frame 3** · `FRAME` · 102×20 · horizontal row, gap 4px · 2 children
        - _...and 2 more_
  - **type=link, state=Default** · `COMPONENT` · 134×36 · vertical stack, gap 10px, padding 8/16/8/16px · 1 children
    - **Group 3** · `GROUP` · 102×20 · 1 children
      - **Frame 3** · `FRAME` · 102×20 · horizontal row, gap 4px · 2 children
        - _...and 2 more_

- **navigation menu content item** · `COMPONENT_SET` · 582×122 · 2 children
  - **state=Default** · `COMPONENT` · 251×82 · vertical stack, gap 10px, padding 12px · 1 children
    - **Frame 7** · `FRAME` · 227×58 · vertical stack, gap 4px · 2 children
      - **Introduction** · `TEXT` · 82×14 · “Introduction”
      - **Re-usable components built using Radix UI and Tailwind CSS** · `TEXT` · 227×40 · “Re-usable components built using Radix UI and Tailwind CSS”
  - **state=selected** · `COMPONENT` · 251×82 · vertical stack, gap 10px, padding 12px · 1 children
    - **Frame 7** · `FRAME` · 227×58 · vertical stack, gap 4px · 2 children
      - **Introduction** · `TEXT` · 82×14 · “Introduction”
      - **Re-usable components built using Radix UI and Tailwind CSS** · `TEXT` · 227×40 · “Re-usable components built using Radix UI and Tailwind CSS”

- **poster** · `COMPONENT` · 188×270 · 2 children
  - **Rectangle 4** · `RECTANGLE` · 188×270
  - **Group 5** · `GROUP` · 140×146 · 1 children
    - **Frame 6** · `FRAME` · 140×146 · vertical stack, gap 20px · 2 children
      - **Ellipse 3** · `ELLIPSE` · 22×22
      - **Frame 6** · `FRAME` · 140×104 · vertical stack, gap 8px · 2 children
        - _...and 2 more_

- **navigation menu content** · `COMPONENT_SET` · 1137×358 · 2 children
  - **type=with picture** · `COMPONENT` · 499×318 · vertical stack, gap 10px, padding 24px · 1 children
    - **Frame 6** · `FRAME` · 451×270 · horizontal row, gap 12px · 2 children
      - **poster** · `INSTANCE` · 188×270 · 2 children
        - _...and 2 more_
      - **Frame 6** · `FRAME` · 251×270 · vertical stack, gap 12px · 3 children
        - _...and 3 more_
  - **type=two columns** · `COMPONENT` · 562×318 · vertical stack, gap 10px, padding 24px · 1 children
    - **Frame 6** · `FRAME` · 514×270 · horizontal row, gap 12px · 2 children
      - **Frame 6** · `FRAME` · 251×270 · vertical stack, gap 12px · 3 children
        - _...and 3 more_
      - **Frame 7** · `FRAME` · 251×270 · vertical stack, gap 12px · 3 children
        - _...and 3 more_

- **navigation menu** · `COMPONENT` · 435×36 · horizontal row · 3 children
  - **navigation menu item** · `INSTANCE` · 150×36 · vertical stack, gap 10px, padding 8/16/8/16px · 1 children
    - **Group 3** · `GROUP` · 118×20 · 1 children
      - **Frame 3** · `FRAME` · 118×20 · horizontal row, gap 4px · 2 children
        - _...and 2 more_
  - **navigation menu item** · `INSTANCE` · 134×36 · vertical stack, gap 10px, padding 8/16/8/16px · 1 children
    - **Group 3** · `GROUP` · 102×20 · 1 children
      - **Frame 3** · `FRAME` · 102×20 · horizontal row, gap 4px · 2 children
        - _...and 2 more_
  - **navigation menu item** · `INSTANCE` · 151×36 · vertical stack, gap 10px, padding 8/16/8/16px · 1 children
    - **Group 3** · `GROUP` · 119×20 · 1 children
      - **Frame 3** · `FRAME` · 119×20 · horizontal row, gap 4px · 2 children
        - _...and 2 more_

_...and 11 more frame(s) on this page_

### Page: Icons

_30 top-level frame(s)_

- **icon/accessibility** · `COMPONENT` · 24×24 · 5 children
  - **Vector** · `VECTOR` · 2×2
  - **Vector** · `VECTOR` · 6×7
  - **Vector** · `VECTOR` · 9×6
  - **Vector** · `VECTOR` · 7×7
  - **Vector** · `VECTOR` · 7×7

- **icon/activity** · `COMPONENT` · 24×24 · 1 children
  - **Vector** · `VECTOR` · 20×18

- **icon/air-vent** · `COMPONENT` · 24×24 · 4 children
  - **Vector** · `VECTOR` · 20×9
  - **Vector** · `VECTOR`
  - **Vector** · `VECTOR` · 5×10
  - **Vector** · `VECTOR` · 4×7

- **icon/airplay** · `COMPONENT` · 24×24 · 2 children
  - **Vector** · `VECTOR` · 20×14
  - **Vector** · `VECTOR` · 10×6

- **icon/alarm-check** · `COMPONENT` · 24×24 · 6 children
  - **Vector** · `VECTOR` · 16×16
  - **Vector** · `VECTOR` · 3×3
  - **Vector** · `VECTOR` · 3×3
  - **Vector** · `VECTOR` · 2×2
  - **Vector** · `VECTOR` · 2×2
  - **Vector** · `VECTOR` · 6×4

- **icon/alarm-clock-off** · `COMPONENT` · 24×24 · 6 children
  - **Vector** · `VECTOR` · 14×14
  - **Vector** · `VECTOR` · 9×9
  - **Vector** · `VECTOR` · 3×3
  - **Vector** · `VECTOR` · 2×2
  - **Vector** · `VECTOR` · 20×20
  - **Vector** · `VECTOR` · 2×2

- **icon/alarm-clock** · `COMPONENT` · 24×24 · 6 children
  - **Vector** · `VECTOR` · 16×16
  - **Vector** · `VECTOR` · 2×6
  - **Vector** · `VECTOR` · 3×3
  - **Vector** · `VECTOR` · 3×3
  - **Vector** · `VECTOR` · 2×2
  - **Vector** · `VECTOR` · 2×2

- **icon/alarm-minus** · `COMPONENT` · 24×24 · 6 children
  - **Vector** · `VECTOR` · 16×16
  - **Vector** · `VECTOR` · 3×3
  - **Vector** · `VECTOR` · 3×3
  - **Vector** · `VECTOR` · 2×2
  - **Vector** · `VECTOR` · 2×2
  - **Vector** · `VECTOR`

- **icon/alarm-plus** · `COMPONENT` · 24×24 · 7 children
  - **Vector** · `VECTOR` · 16×16
  - **Vector** · `VECTOR` · 3×3
  - **Vector** · `VECTOR` · 3×3
  - **Vector** · `VECTOR` · 2×2
  - **Vector** · `VECTOR` · 2×2
  - **Vector** · `VECTOR`
  - **Vector** · `VECTOR`

- **icon/album** · `COMPONENT` · 24×24 · 2 children
  - **Vector** · `VECTOR` · 18×18
  - **Vector** · `VECTOR` · 6×8

- **icon/alert-circle** · `COMPONENT` · 24×24 · 3 children
  - **Vector** · `VECTOR` · 20×20
  - **Vector** · `VECTOR`
  - **Vector** · `VECTOR`

- **icon/alert-octagon** · `COMPONENT` · 24×24 · 3 children
  - **Vector** · `VECTOR` · 20×20
  - **Vector** · `VECTOR`
  - **Vector** · `VECTOR`

- **icon/alert-triangle** · `COMPONENT` · 24×24 · 3 children
  - **Vector** · `VECTOR` · 20×18
  - **Vector** · `VECTOR`
  - **Vector** · `VECTOR`

- **icon/align-center-horizontal** · `COMPONENT` · 24×24 · 5 children
  - **Vector** · `VECTOR`
  - **Vector** · `VECTOR` · 6×6
  - **Vector** · `VECTOR` · 6×6
  - **Vector** · `VECTOR` · 6×3
  - **Vector** · `VECTOR` · 6×3

- **icon/align-center-vertical** · `COMPONENT` · 24×24 · 5 children
  - **Vector** · `VECTOR`
  - **Vector** · `VECTOR` · 6×6
  - **Vector** · `VECTOR` · 6×6
  - **Vector** · `VECTOR` · 3×6
  - **Vector** · `VECTOR` · 3×6

_...and 15 more frame(s) on this page_

## 3. Color

### Palette
| Token | Value | Role | Usage | Similar | Source |
|-------|-------|------|-------|---------|--------|
| `text-primary` | `#000000` | text-primary | 3472× | — | style |
| `background` | `#ffffff` | background | 375× | — | style |
| `accent` | `#334155` | accent | 323× | `#374151` | style |
| `accent-alt` | `#0f172a` | accent | 318× | `#111827` | style |
| `text-tertiary` | `#64748b` | text-tertiary | 146× | — | style |
| `surface` | `#e2e8f0` | surface | 102× | `#e5e7eb` | style |
| `background-alt` | `#f1f5f9` | background | 56× | `#f3f4f6`, `#f4f4f5`, `#f5f5f5`, `#f5f5f4`, `#f0f9ff`, `#eff6ff`, `#eef2ff`, `#f5f3ff` | style |
| `accent-3` | `#cbd5e1` | accent | 44× | — | style |
| `accent-4` | `#475569` | accent | 44× | `#4b5563` | style |
| `accent-5` | `#94a3b8` | accent | 33× | — | style |
| `accent-6` | `#9747ff` | accent | 18× | — | node |
| `background-3` | `#f8fafc` | background | 2× | `#f9fafb`, `#fafafa`, `#fafaf9`, `#faf5ff` | style |
| `surface-alt` | `#b9c1ca` | surface-alt | 2× | — | node |
| `accent-7` | `#1e293b` | accent | 1× | `#1f2937` | style |
| `surface-alt` | `#e3e3e3` | surface | 1× | `#e4e4e7`, `#e5e5e5`, `#e7e5e4` | node |
| `danger` | `#ef4444` | danger | 1× | — | style |
| `danger-alt` | `#dc2626` | danger | 1× | — | style |
| `text-primary-alt` | `#27272a` | text-primary | — | `#262626`, `#292524` | style |
| `text-primary-3` | `#18181b` | text-primary | — | `#171717`, `#1c1917` | style |
| `background-4` | `#f7fee7` | background | — | — | style |

_The **Similar** column lists hexes that were visually indistinguishable (Δ < 12) and collapsed into the canonical token. Use the canonical token in code; treat the similar values as the same intent._

## 4. Typography

### Fonts
- **Inter**
- **Menlo**

### Scale
| Role | Token | Size | Weight | Line Height | Letter Spacing | Source |
|------|-------|------|--------|-------------|----------------|--------|
| Display | `display` | 48px | 700 | 48px | -0.01em | style |
| H1 | `h1` | 30px | 600 | 36px | -0.01em | style |
| H2 | `h2` | 24px | 600 | 32px | -0.01em | style |
| H3 | `h3` | 20px | 600 | 28px | -0.005em | style |
| H3 (400) | `h3-regular` | 20px | 400 | 28px | normal | style |
| Body lg (500) | `body-lg-medium` | 18px | 500 | 24px | normal | node |
| Body lg (600) | `body-lg-semibold` | 18px | 600 | 28px | normal | style |
| Body | `body` | 16px | 400 | 28px | normal | style |
| Body (500) | `body-medium` | 16px | 500 | 24px | normal | style |
| Body (700) | `body-bold` | 16px | 700 | 24px | normal | style |
| Body sm | `body-sm` | 14px | 400 | 24px | normal | style |
| Body sm (500) | `body-sm-medium` | 14px | 500 | 24px | normal | style |
| Body sm (600) | `body-sm-semibold` | 14px | 600 | 20px | normal | style |
| Body sm (700) | `body-sm-bold` | 14px | 700 | 20px | normal | style |

## 5. Spacing & Layout

### Base Unit
Values found: 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 16, 17, 18, 20, 24, 25, 30, 32, 37, 40, 44, 45, 53, 56, 64

### Border Radius
| Token | Value | Usage Count |
|-------|-------|-------------|
| `radius-sm-4` | 2px | 5 |
| `radius-sm-3` | 3px | 21 |
| `radius-sm-2` | 4px | 3 |
| `radius-sm` | 5px | 23 |
| `radius-md` | 6px | 169 |
| `radius-lg-4` | 8px | 3 |
| `radius-lg-3` | 40px | 4 |
| `radius-lg-2` | 50px | 4 |
| `radius-lg` | 96px | 2 |

## 6. Depth & Motion

### Elevation
| Token | Shadow | Source |
|-------|--------|--------|
| `elevation-1` | `inset 0px -1px 0px 0px rgba(226, 232, 240, 1)` | node |
| `elevation-2` | `0px 4px 4px 0px rgba(174, 174, 174, 0.25)` | node |
| `elevation-3` | `0px 2px 4px 0px rgba(30, 41, 59, 0.25)` | node |
| `shadow` | `0px 4px 6px 0px rgba(0, 0, 0, 0.09)` | style |

## 7. Components

Components found in this file:

- separator
- slider
- tabs and content
- tooltip
- popover
- progress
- radio group
- scroll-area
- select
- select options
- hover card
- label
- menubar and content
- navigation menu and content
- command
- context menu
- dialog
- dropdown menu
- accordion
- alter dialog
- table
- button
- type=default, state=Default
- type=primary button, state=hover
- type=destructive, state=Default
- type=destructive, state=hover
- type=outline, state=Default
- type=outline, state=hover
- type=subtle, state=Default
- type=subtle, state=hover
- ...and 968 more

## 8. States

State tokens should be derived from the base palette above. Recommended mappings:

| State | Treatment |
|-------|-----------|
| Hover | Lighten/darken accent by 10% |
| Focus | 2px ring using accent color with 30% opacity |
| Disabled | 40% opacity, no pointer events |
| Error | Use danger color for border and text |

## 9. Rules

### Do
- Use `#ffffff` (`background`) as the page background
- Use `#000000` (`text-primary`) for primary text
- Use `#334155` (`accent`) as the primary accent color
- Keep border-radius consistent: 2px, 3px, 4px, 5px, 6px, 8px, 40px, 50px, 96px
- Use the spacing scale above for all padding and margins
- Maintain the type scale hierarchy for visual rhythm

### Don't
- Don't use colors outside the extracted palette
- Don't mix font families arbitrarily
- Don't use arbitrary spacing values outside the scale
- Don't flatten the shadow system to single-layer shadows

## 10. Extending this system

This file captures the visual language of one screen (or a small set). Most products grow from a landing page into a full app — auth, dashboard, settings, marketing pages, emails. Reuse this document as the canonical reference so new screens stay coherent.

### How to reuse this DESIGN.md
1. **Treat it as the source of truth.** Commit it at the repo root. Any new page or component should be built from the tokens above, not re-invented.
2. **Feed it to your AI coding tool.** Paste this file (or include it via `@DESIGN.md`) when prompting Copilot / Cursor / Claude to generate new pages. The model will reuse the exact tokens instead of inventing new ones.
3. **Re-run this plugin** whenever the Figma file changes substantially and diff the output. The diff itself is your design-system changelog.
4. **Promote tokens to code.** Mirror the palette, type scale, spacing, and radii into CSS variables, a Tailwind config, or a tokens file. Reference them by name in components — never hardcode hex/px values.

### Adding a new screen
- Start from the **Identity** statement above — the new screen must read as the same product.
- Pick layouts from existing **Structure** patterns (same containers, same gaps, same padding rhythm) before introducing new ones.
- Use only the existing spacing scale (2px, 3px, 4px, 5px, 6px, 7px, 8px, 9px, 10px, 12px, 13px, 16px, 17px, 18px, 20px, 24px, 25px, 30px, 32px, 37px, 40px, 44px, 45px, 53px, 56px, 64px). If you need a new value, add it here first so the next person knows it's allowed.
- Compose from the existing **Components** list. Only create a new component if no existing one fits — and then add it to this file.
- Reuse the same **States** treatments (hover, focus, disabled, error). Consistency across screens is what makes states feel intentional.

### When to add a new token vs reuse
| Situation | Action |
|-----------|--------|
| Need a color that's a tint/shade of an existing one | Reuse + adjust opacity, don't add a new hex |
| Need a font size between two existing steps | Pick the closer existing step; resist filling the gap |
| Need a one-off spacing value | Round to the nearest scale value first |
| Need a genuinely new semantic role (e.g. `info`, `brand-2`) | Add it here with a clear role + confidence note |
| Need a new component pattern used 3+ times | Promote to the Components section |

### Page types likely to come next
If this design is a landing page, here are common follow-on surfaces and what to inherit:

| Surface | Inherit | Likely new tokens |
|---------|---------|-------------------|
| Auth (sign in / sign up) | Inputs, buttons, type scale, background | Form validation states, link color |
| Dashboard / app shell | Spacing, radii, shadows, nav patterns | Sidebar widths, data-density type step, table row heights |
| Settings | Inputs, buttons, type scale | Section dividers, toggle component, danger-zone treatment |
| Marketing / content pages | Identity, type scale, hero patterns | Long-form body width, blockquote, code block (if relevant) |
| Empty / error / 404 states | Type scale, illustration tone, CTA pattern | Illustration sizing tokens |
| Transactional emails | Color palette (with email-safe fallbacks), type scale | Email-safe font stack, fixed widths (600px) |

### Versioning
- Bump a header (`<!-- version: X.Y -->`) when the palette, type scale, or spacing scale changes — those are breaking.
- Non-breaking additions (a new component, a new shadow level) are minor.
- Keep this file in the same PR as the code change that introduces or consumes the new token, so design and code never drift.

## 11. Machine-readable tokens

The block below is the canonical token map. Reference this when generating code or syncing to CSS variables / Tailwind config. It mirrors the tables above but is unambiguous and parseable.

```json design-tokens
{
  "$schema": "design-tokens.v1",
  "meta": {
    "source": "@shadcn/ui - Design System (Community)",
    "generated": "2026-06-17"
  },
  "color": {
    "text-primary": "#000000",
    "background": "#ffffff",
    "accent": "#334155",
    "accent-alt": "#0f172a",
    "text-tertiary": "#64748b",
    "surface": "#e2e8f0",
    "background-alt": "#f1f5f9",
    "accent-3": "#cbd5e1",
    "accent-4": "#475569",
    "accent-5": "#94a3b8",
    "accent-6": "#9747ff",
    "background-3": "#f8fafc",
    "surface-alt": "#e3e3e3",
    "accent-7": "#1e293b",
    "danger": "#ef4444",
    "danger-alt": "#dc2626",
    "text-primary-alt": "#27272a",
    "text-primary-3": "#18181b",
    "background-4": "#f7fee7",
    "background-5": "#ecfeff",
    "background-6": "#ede9fe",
    "background-7": "#fdf4ff",
    "background-8": "#fae8ff",
    "accent-8": "#fef3c7",
    "accent-9": "#fde68a",
    "accent-10": "#fcd34d",
    "accent-11": "#fbbf24",
    "accent-12": "#f59e0b",
    "accent-13": "#d97706",
    "accent-14": "#b45309",
    "accent-15": "#92400e",
    "accent-16": "#78350f",
    "accent-17": "#ecfccb",
    "accent-18": "#d9f99d",
    "accent-19": "#bef264",
    "accent-20": "#a3e635",
    "accent-21": "#84cc16",
    "accent-22": "#65a30d",
    "accent-23": "#4d7c0f",
    "accent-24": "#3f6212",
    "accent-25": "#365314",
    "accent-26": "#d1fae5",
    "accent-27": "#a7f3d0",
    "accent-28": "#6ee7b7",
    "accent-29": "#34d399",
    "accent-30": "#10b981",
    "accent-31": "#059669",
    "accent-32": "#047857",
    "accent-33": "#065f46",
    "accent-34": "#064e3b",
    "accent-35": "#ccfbf1",
    "accent-36": "#99f6e4",
    "accent-37": "#5eead4",
    "accent-38": "#2dd4bf",
    "accent-39": "#14b8a6",
    "accent-40": "#0d9488",
    "accent-41": "#0f766e",
    "accent-42": "#115e59",
    "accent-43": "#134e4a",
    "accent-44": "#a5f3fc",
    "accent-45": "#67e8f9",
    "accent-46": "#22d3ee",
    "accent-47": "#06b6d4",
    "accent-48": "#0891b2",
    "accent-49": "#0e7490",
    "accent-50": "#155e75",
    "accent-51": "#164e63",
    "accent-52": "#bae6fd",
    "accent-53": "#7dd3fc",
    "accent-54": "#38bdf8",
    "accent-55": "#0ea5e9",
    "accent-56": "#0284c7",
    "accent-57": "#0369a1",
    "accent-58": "#075985",
    "accent-59": "#0c4a6e",
    "accent-60": "#bfdbfe",
    "accent-61": "#93c5fd",
    "accent-62": "#60a5fa",
    "accent-63": "#3b82f6",
    "accent-64": "#2563eb",
    "accent-65": "#1d4ed8",
    "accent-66": "#1e40af",
    "accent-67": "#1e3a8a",
    "accent-68": "#c7d2fe",
    "accent-69": "#a5b4fc",
    "accent-70": "#818cf8",
    "accent-71": "#6366f1",
    "accent-72": "#4f46e5",
    "accent-73": "#4338ca",
    "accent-74": "#3730a3",
    "accent-75": "#312e81",
    "accent-76": "#c4b5fd",
    "accent-77": "#a78bfa",
    "accent-78": "#8b5cf6",
    "accent-79": "#7c3aed",
    "accent-80": "#6d28d9",
    "accent-81": "#5b21b6",
    "accent-82": "#4c1d95",
    "accent-83": "#d8b4fe",
    "accent-84": "#c084fc",
    "accent-85": "#a855f7",
    "accent-86": "#9333ea",
    "accent-87": "#7e22ce",
    "accent-88": "#6b21a8",
    "accent-89": "#581c87",
    "accent-90": "#f0abfc",
    "accent-91": "#e879f9",
    "accent-92": "#d946ef",
    "accent-93": "#c026d3",
    "accent-94": "#a21caf",
    "accent-95": "#86198f",
    "accent-96": "#701a75",
    "accent-97": "#fbcfe8",
    "accent-98": "#f9a8d4",
    "accent-99": "#f472b6",
    "accent-100": "#ec4899",
    "accent-101": "#db2777",
    "accent-102": "#be185d",
    "accent-103": "#9d174d",
    "accent-104": "#831843",
    "accent-105": "#fda4af",
    "accent-106": "#fb7185",
    "accent-107": "#f43f5e",
    "accent-108": "#e11d48",
    "accent-109": "#be123c",
    "accent-110": "#9f1239",
    "accent-111": "#881337",
    "text-tertiary-alt": "#6b7280",
    "text-tertiary-3": "#71717a",
    "text-tertiary-4": "#737373",
    "text-tertiary-5": "#78716c",
    "surface-3": "#cffafe",
    "surface-4": "#e0f2fe",
    "surface-5": "#dbeafe",
    "surface-6": "#ddd6fe",
    "surface-7": "#e9d5ff",
    "surface-8": "#f5d0fe",
    "surface-9": "#fce7f3",
    "surface-10": "#fecdd3",
    "surface-alt-alt": "#d1d5db",
    "surface-alt-3": "#d6d3d1",
    "danger-3": "#fef2f2",
    "danger-4": "#fee2e2",
    "danger-5": "#fecaca",
    "danger-6": "#fca5a5",
    "danger-7": "#f87171",
    "danger-8": "#b91c1c",
    "danger-9": "#991b1b",
    "danger-10": "#7f1d1d",
    "border": "#9ca3af",
    "border-alt": "#a3a3a3",
    "text-secondary": "#52525b",
    "text-secondary-alt": "#3f3f46",
    "text-secondary-3": "#525252",
    "text-secondary-4": "#44403c",
    "warning": "#fff7ed",
    "warning-alt": "#ffedd5",
    "warning-3": "#fed7aa",
    "warning-4": "#fdba74",
    "warning-5": "#fb923c",
    "warning-6": "#f97316",
    "warning-7": "#ea580c",
    "warning-8": "#c2410c",
    "warning-9": "#9a3412",
    "warning-10": "#7c2d12",
    "warning-11": "#fefce8",
    "warning-12": "#fef9c3",
    "warning-13": "#fef08a",
    "warning-14": "#fde047",
    "warning-15": "#facc15",
    "warning-16": "#eab308",
    "warning-17": "#ca8a04",
    "warning-18": "#a16207",
    "warning-19": "#854d0e",
    "warning-20": "#713f12",
    "success": "#f0fdf4",
    "success-alt": "#dcfce7",
    "success-3": "#bbf7d0",
    "success-4": "#86efac",
    "success-5": "#4ade80",
    "success-6": "#22c55e",
    "success-7": "#16a34a",
    "success-8": "#15803d",
    "success-9": "#166534",
    "success-10": "#14532d"
  },
  "typography": {
    "display": {
      "fontFamily": "Inter",
      "fontSize": 48,
      "fontWeight": 700,
      "lineHeight": "48px",
      "letterSpacing": "-0.01em"
    },
    "h1": {
      "fontFamily": "Inter",
      "fontSize": 30,
      "fontWeight": 600,
      "lineHeight": "36px",
      "letterSpacing": "-0.01em"
    },
    "h2": {
      "fontFamily": "Inter",
      "fontSize": 24,
      "fontWeight": 600,
      "lineHeight": "32px",
      "letterSpacing": "-0.01em"
    },
    "h3": {
      "fontFamily": "Inter",
      "fontSize": 20,
      "fontWeight": 600,
      "lineHeight": "28px",
      "letterSpacing": "-0.005em"
    },
    "h3-regular": {
      "fontFamily": "Inter",
      "fontSize": 20,
      "fontWeight": 400,
      "lineHeight": "28px",
      "letterSpacing": "normal"
    },
    "body-lg-medium": {
      "fontFamily": "Inter",
      "fontSize": 18,
      "fontWeight": 500,
      "lineHeight": "24px",
      "letterSpacing": "normal"
    },
    "body-lg-semibold": {
      "fontFamily": "Inter",
      "fontSize": 18,
      "fontWeight": 600,
      "lineHeight": "28px",
      "letterSpacing": "normal"
    },
    "body": {
      "fontFamily": "Inter",
      "fontSize": 16,
      "fontWeight": 400,
      "lineHeight": "28px",
      "letterSpacing": "normal"
    },
    "body-medium": {
      "fontFamily": "Inter",
      "fontSize": 16,
      "fontWeight": 500,
      "lineHeight": "24px",
      "letterSpacing": "normal"
    },
    "body-bold": {
      "fontFamily": "Inter",
      "fontSize": 16,
      "fontWeight": 700,
      "lineHeight": "24px",
      "letterSpacing": "normal"
    },
    "body-sm": {
      "fontFamily": "Inter",
      "fontSize": 14,
      "fontWeight": 400,
      "lineHeight": "24px",
      "letterSpacing": "normal"
    },
    "body-sm-medium": {
      "fontFamily": "Inter",
      "fontSize": 14,
      "fontWeight": 500,
      "lineHeight": "24px",
      "letterSpacing": "normal"
    },
    "body-sm-semibold": {
      "fontFamily": "Inter",
      "fontSize": 14,
      "fontWeight": 600,
      "lineHeight": "20px",
      "letterSpacing": "normal"
    },
    "body-sm-bold": {
      "fontFamily": "Menlo",
      "fontSize": 14,
      "fontWeight": 700,
      "lineHeight": "20px",
      "letterSpacing": "normal"
    },
    "caption": {
      "fontFamily": "Inter",
      "fontSize": 12,
      "fontWeight": 400,
      "lineHeight": "16px",
      "letterSpacing": "normal"
    },
    "caption-medium": {
      "fontFamily": "Inter",
      "fontSize": 12,
      "fontWeight": 500,
      "lineHeight": "20px",
      "letterSpacing": "normal"
    }
  },
  "spacing": {
    "space-2": 2,
    "space-3": 3,
    "space-4": 4,
    "space-5": 5,
    "space-6": 6,
    "space-7": 7,
    "space-8": 8,
    "space-9": 9,
    "space-10": 10,
    "space-12": 12,
    "space-13": 13,
    "space-16": 16,
    "space-17": 17,
    "space-18": 18,
    "space-20": 20,
    "space-24": 24,
    "space-25": 25,
    "space-30": 30,
    "space-32": 32,
    "space-37": 37,
    "space-40": 40,
    "space-44": 44,
    "space-45": 45,
    "space-53": 53,
    "space-56": 56,
    "space-64": 64
  },
  "radius": {
    "radius-md": 6,
    "radius-sm": 5,
    "radius-sm-2": 4,
    "radius-sm-3": 3,
    "radius-sm-4": 2,
    "radius-lg-4": 8,
    "radius-lg-3": 40,
    "radius-lg-2": 50,
    "radius-lg": 96
  },
  "shadow": {
    "elevation-1": "inset 0px -1px 0px 0px rgba(226, 232, 240, 1)",
    "elevation-2": "0px 4px 4px 0px rgba(174, 174, 174, 0.25)",
    "elevation-3": "0px 2px 4px 0px rgba(30, 41, 59, 0.25)",
    "shadow": "0px 4px 6px 0px rgba(0, 0, 0, 0.09)"
  },
  "fonts": [
    "Inter",
    "Menlo"
  ]
}
```
