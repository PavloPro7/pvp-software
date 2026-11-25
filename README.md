# PVP Software site

Next.js (App Router) + TypeScript + Sass modules, exported as a static site and
hosted on GitHub Pages. Blog posts are MDX files or posts copied from Telegram.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # writes the finished site to the "out" folder
npm run lint
```

## Publishing

The site is published by GitHub: every push to `main` runs
`.github/workflows/deploy.yml`, which builds the site and puts it on GitHub
Pages. There is nothing to upload by hand.

- Progress and errors: the **Actions** tab of the repository.
- One-time setup: **Settings > Pages > Source: GitHub Actions**.
- The site has no server. Pages are built ahead of time, so there are no forms
  or other code that runs when a visitor does something on the server side.
- On GitHub Pages the site lives under `/pvp-software`. Links get that prefix
  automatically; for an image path use `asset()` from `src/lib/paths.ts`.

## Where things live

| What | Where |
|---|---|
| Brand name, slogan, links, email, navigation | `src/data/site.ts` |
| Projects | `content/projects/*.mdx` (text below the top block becomes the project's own page) |
| Project images | `public/projects/<project>/` (`icon` square, `cover` 16:9, `screenshots` 9:16) |
| Blog posts written by hand | `content/blog/*.mdx` |
| Blog posts copied from Telegram | `content/telegram/*.json` (written by the bot, see below) |
| Colours, spacing, breakpoints | `src/styles/globals.scss`, `src/styles/_tokens.scss` |
| Contact page | `src/app/contact/page.tsx` |

## Project files

Each file in `content/projects` starts with a block like this:

```yaml
title: "My app"
summary: "One sentence about it."
platforms:
  - name: "Google Play"   # with href: live there, shown with a green dot
    href: "https://play.google.com/store/apps/details?id=..."
  - name: "App Store"     # without href: shown as "soon"
stack: ["Flutter", "Dart"]
icon: "/projects/my-app/icon.png"
featured: true            # full-width card
order: 1                  # position in the list
```

When an app goes live somewhere, add its `href` and the badge turns green.

## Telegram posts

The Telegram bot (tgParcer) copies the channel posts written by a person into
this repository: one file per post in `content/telegram/<post id>.json`, and
its photo, if any, in `public/telegram/`. They show up in the Blog next to the
hand-written posts, at `/blog/tg-<post id>`. The bot's AI news posts are not
copied.

- To hide a post from the site, delete its file here (deleting it in Telegram
  does not remove it).
- To keep a channel post off the site, put `#nosite` in it.
- On your computer, run `git pull` to see posts the bot has added.

## Design

The look follows the PVP Software channel artwork. Colours live at the top of
`src/styles/globals.scss`: violet is the brand colour, green is used only for
"live" and the main button.

## Still to do

- Add your contact email in `src/data/site.ts` (the site shows none until then).
- Write the About page.
