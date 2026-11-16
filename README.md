# Khmer Traditional Music · តន្ត្រីប្រពៃណីខ្មែរ

A Khmer Living Archive built by Taing VongMeng for ICT 340 (Vibe Coding) at the American University of Phnom Penh, Fall 2026.

Live site: https://khmer-music-archive.vercel.app

> **Draft note (delete this box before submitting):** Claude drafted this README from the code on 2026-11-16. Lines marked **UNSURE** are things the code cannot prove, such as who gave permission or what is installed in the live Supabase project. Check each one, rewrite it in your own words, and remove the marker.

---

## 1. What this is

This archive collects Khmer traditional music: the instruments of the pinpeat and wedding ensembles (chapei dang veng, roneat ek, skor thom, kong vong thom, tro, skor daey) and the songs and chants that go with them (kansaeng kraham, baykhon, pleng kar, pleng arak, choun por, smot). Every entry is written in both Khmer and English and has a photo, a place in Cambodia and a named contributor. Entries can also link to a YouTube recording, as Chapei Dang Veng does. My main source was Professor Svay Sor (លោកសាស្ត្រាចារ្យ ស្វាយ សរ) of the Royal University of Fine Arts in Phnom Penh. A visitor can browse and search the collection in either language. Anyone with an account can add an entry, and it is published only after a reviewer approves it.

## 2. Who it's for

The archive is for Khmer students, young musicians and families in Cambodia who want to know what an instrument is called, what it sounds like and where it is played. It is also for teachers who want a short, bilingual reference to show in class.

What I did for them:

- **Khmer is first, not a translation.** Every entry has a Khmer title, description, contributor and place, and the form will not save an entry without them (`lib/entry-validation.js`). The Khmer fields must actually contain Khmer letters. English fields accept Khmer too, so a contributor can type a Khmer name there. They see a gentle warning asking for English, but nothing is blocked.
- **Khmer fonts.** Khmer text uses Battambang, falling back to Khmer OS Battambang and Noto Sans Khmer (`app/globals.css`), so it renders properly on phones that have no Khmer font installed.
- **Bilingual messages everywhere.** Error messages, empty states, sign-in messages, review statuses and the review queue buttons are in both English and Khmer (for example `lib/entry-status.js` and `components/ReviewQueueItem.js`).
- **Search in either language.** Search checks the Khmer and English versions of the title, description, contributor and place, plus the type and tags. It normalises Unicode (NFC) without stripping Khmer (`app/page.js`).
- **Phones first.** The layout has breakpoints at 600 px and 900 px (`app/globals.css`), and the collection shows 6 entries per page, so a phone does not load every photo at once.
- **Slow connections.** Photos are limited to 5 MB and to JPG, PNG or WebP. Search waits 250 ms after typing stops before filtering.
- **Sources are credited on every entry.** Each entry shows its contributor and place, and the archive's main source is shown on the home page from `collection.config.js`.

**UNSURE:** Did you change anything after showing the archive to Professor Svay Sor or another user? If so, say what here.

## 3. How it works

**Stack:** Next.js 15 (App Router, React 19, plain JavaScript) deployed on Vercel. Supabase provides accounts (email and password), the Postgres database and photo storage. The only dependencies are `next`, `react`, `react-dom`, `@supabase/supabase-js` and `@supabase/ssr`.

**Pages**

| Route | Who uses it | What it does |
| --- | --- | --- |
| `/` | everyone | Browse and search published entries |
| `/entries/[slug]/[id]` | everyone | One entry. Owners and reviewers can also open unpublished ones |
| `/signup`, `/login` | visitors | Create an account or log in |
| `/contribute` | contributors | Add an entry with a photo. It is saved as pending |
| `/my-entries` | contributors | Your own entries and the status of each |
| `/entries/[slug]/[id]/edit` | the entry's owner | Edit your entry. Saving sends it back to pending |
| `/review` | reviewers | The queue of pending entries, oldest first, with Publish and Return |

The login is kept in cookies by `@supabase/ssr`, and `middleware.js` refreshes it, so server pages like `/review` know who is signed in.

**Tables**

- `entries`: one row per entry. The columns the code uses are `id`, `owner` (the contributor's user id), `status`, `created_at`, `type` (`song` or `instrument`), `title_en`/`title_kh`, `description_en`/`description_kh`, `contributor_en`/`contributor_kh`, `place_en`/`place_kh`, `image` (public URL of the photo), `youtube_url` and `tags`. Check constraints in `lib/supabase/policy/SupabasePolicy.sql` refuse an entry with a blank title, description, contributor, place or photo. **UNSURE:** confirm `tags`, `slug` and `youtube_id` exist in the live table and list any other columns.
- `reviewers`: one `user_id` per reviewer. Row level security is on and there are no policies, so nobody can read or change it through the API.
- Storage bucket `photos`: each photo is stored under `<user id>/<random uuid>.<ext>`. **UNSURE:** the code uses `getPublicUrl`, so the bucket is public. Confirm this in the dashboard.

**Entry statuses**

| Status | Meaning | Who can see it |
| --- | --- | --- |
| `pending` | New or just edited, waiting for a reviewer (this is the column default) | the owner and reviewers |
| `published` | A reviewer approved it | everyone, logged in or not |
| `returned` | A reviewer sent it back. The owner can edit and resend it | the owner and reviewers |

**Policies (row level security on `entries`)**

All SQL is in `lib/supabase/policy/` and was run in the Supabase SQL editor.

| Action | Rule | File |
| --- | --- | --- |
| Read | `status = 'published'`, or you own it, or you are a reviewer | `ReviewGate.sql` |
| Insert | You must be the owner, and status must be `pending` | `ReviewGate.sql` |
| Update | Only your own entry. After your edit it must be `pending` again unless you are a reviewer. A restrictive guard also stops anyone editing someone else's entry or changing `owner` | `ReviewGate.sql`, `EntryOwnerUpdate.sql` |
| Delete | Your own entry, or any entry if you are a reviewer. Logged-out users have no delete permission | `EntryOwnerDelete.sql`, `ReviewerDelete.sql` |
| Change status to published or returned | Only through `review_entry()` | `ReviewGate.sql` |

Photos have matching policies on `storage.objects`. You can only upload into your own folder and only delete photos from it, reviewers can delete any photo, and no photo that an entry still uses can be deleted.

Permissive policies combine with OR, so an older "anyone can read" policy left over from Sprint 1 would let pending entries leak. On 2026-11-16 a logged-out request for anything not published returned nothing, so no leftover policy applies to logged-out visitors. **UNSURE:** run the second query in `PhotoCleanupDiagnostics.sql` to check that no leftover policy applies to logged-in users either.

## 4. Security decisions

**The gate: `review_entry(entry_id, decision)`**

This is a database function (`lib/supabase/policy/ReviewGate.sql`). It:

1. Returns `false` unless the caller is in `reviewers` (checked by `is_reviewer()`).
2. Returns `false` unless the decision is `published` or `returned`.
3. Updates the entry only `where status = 'pending'`, so an entry can be decided only once. A second tab deciding the same entry gets `false`, not an error.

It runs as `security definer` with an empty `search_path`, so it can read `reviewers` while ordinary users cannot. Execute permission is revoked from `anon` and granted only to `authenticated`.

**Why it lives in the database:** the browser belongs to the user. Anyone can open the console and call Supabase directly with the public key, skipping my pages. A check in React only stops people who use the page as intended. The database checks every request, however it was sent.

**What a hidden button does and doesn't protect:** the Review link (`components/ReviewerNavLink.js`) and the `/review` page are hidden from non-reviewers. That is politeness: it keeps the menu clean and avoids confusing people. It protects nothing. A stranger who calls `review_entry` from the console gets `false`. If they try `update entries set status = 'published'` on their own entry, the update policy refuses any status but `pending` for non-reviewers. If they insert a row that is already `published`, the insert policy refuses it.

**Decisions the briefs left to me**

- **What a returned entry says.** The owner sees "Returned to you / បានប្រគល់ត្រឡប់មកអ្នកវិញ" and a bilingual hint: edit and save to send it for review again, with an "Edit and resend" link (`lib/entry-status.js`, `app/my-entries/page.js`). The reviewer cannot write a reason. **UNSURE:** say why you chose that, if you did.
- **Reviewers can take down published entries.** Take down deletes the entry and its photo for good (`ReviewerDelete.sql`, `lib/entry-deletion.js`). I chose deletion over sending it back to `returned`, so nothing taken down stays in the database or in storage. This replaced an earlier `take_down_entry` function.
- **Search shows only published entries, even to their owner.** The home page asks for `status = 'published'` (`app/page.js`), so a contributor's pending entries never appear in search. Contributors find them on My entries instead. That way search looks the same to everyone and nobody mistakes their pending entry for a published one.
- **Editing re-opens review.** Any edit by a non-reviewer sets the entry back to `pending`, so a contributor cannot quietly change a published entry after it was approved.
- **Khmer is never blocked.** See section 2.
- **Photo ownership is the folder name, not `owner_id`.** Files added from the dashboard have no `owner_id`, so a check on it made `remove()` silently fail and left orphaned photos. The storage policies check the first folder of the path instead, and uploads into someone else's folder are refused.
- **Pending photos are not secret.** **UNSURE:** because the bucket is public, anyone who knows a pending photo's URL can open it. The filename is a random UUID, so it cannot be guessed. Say whether you accept this and why.

## 5. AI use

**UNSURE: fill this in yourself. Only you know which models you used and what you rewrote.** Every commit marked `(AI-assisted)` in `git log` is a starting list (29 of the 54 commits are not marked). A table like this works:

| Model / tool | Task | What it wrote | What I kept, changed or rejected | How I checked it |
| --- | --- | --- | --- | --- |
| UNSURE (e.g. Claude through Cline) | Review gate SQL | `review_entry`, `is_reviewer`, policies | UNSURE | Called `review_entry` from a stranger account in the console and got `false` |
| UNSURE | Review status (Sprint 3) | `fa40c82`, which made new entries pending before the database had the column | Reverted in `f2b380c`, then redone in `af7b062` after the SQL was run | UNSURE |
| UNSURE | Photo cleanup on delete | storage policy that checked `owner_id` | Replaced with a folder check, because `remove()` returned an empty list and left photos behind | `PhotoCleanupDiagnostics.sql` |
| UNSURE | Tests | `tests/*.test.js` (39 tests) | UNSURE | `node --test tests/` |

Also say which AI explanations you did not trust and why, and which code you wrote by hand (the early "Sprint 1" commits, for example).

## 6. Sources and credits

**Main source:** Professor Svay Sor (លោកសាស្ត្រាចារ្យ ស្វាយ សរ), Royal University of Fine Arts, Phnom Penh, who taught me about these songs and instruments. **UNSURE:** state that they agreed to be named.

**Entry contributors, as credited on the live site (13 published entries):**

| Entry | Contributor | Place | Permission |
| --- | --- | --- | --- |
| Chapei Dang Veng · ចាប៉ីដងវែង | Master Kong Nay · លោកគ្រូ គង់ ណៃ | Phnom Penh | UNSURE |
| Pinpeat Ensemble · វង់ពិណពាទ្យ | Royal University of Fine Arts | Siem Reap | UNSURE |
| Roneat Ek · រនាតឯក | So Savoeun · សូ សាវឿន | Battambang | UNSURE |
| Skor Thom · ស្គរធំ | Nop Monin · នព មុនីន | Phnom Penh | UNSURE |
| Kong Vong Thom · គងវង់ធំ | Ouk Samnang · អ៊ុក សំណាង | Siem Reap | UNSURE |
| Tro · ទ្រ | Chea Sreyneang · ជា ស្រីនាង | Kandal | UNSURE |
| Kansaeng Kraham · កន្សែងក្រហម | Ros Sopheap · រស់ សុភ័ព្ទ | Kampong Cham | UNSURE |
| Baykhon · បាយខុន | Bun Rany · ប៊ុន រ៉ានី | Takeo | UNSURE |
| Pleng Kar · ភ្លេងការ | Traditional Khmer wedding ensembles | Kandal | n/a (a tradition, not a person) |
| Pleng Arak · ភ្លេងអារក្ស | Traditional arak musicians | Siem Reap | n/a |
| Choun Por · ជូនពរ | Khmer wedding musicians | Battambang | n/a |
| Smot · ស្មូត | Buddhist monks and chanting masters | Phnom Penh | n/a |
| Skor Daey · ស្គរដៃ | Sien Tatt · សៀន តាត់ | Siem Reap | UNSURE |

**UNSURE:** for each named person, say how you know them and that they agreed to be named. If someone did not agree, change the entry to something like "a drummer in Siem Reap who asked not to be named". If a credit names a famous musician you did not actually speak to, say where the information really came from.

**Photos:** the entry photos are in `public/images/` or were uploaded through the Contribute form. **UNSURE:** credit every photo you did not take yourself (photographer or website, and its licence).

**Fonts:** Battambang and Manrope from Google Fonts (SIL Open Font License).

## 7. Running it locally

You need Node.js and a Supabase project with the SQL from `lib/supabase/policy/` installed. **UNSURE:** the SQL that first created the `entries` and `reviewers` tables is not in this repo. Add it, or describe the columns, so someone can rebuild the database.

```bash
git clone https://github.com/vongmeng3/vibecode.git
cd vibecode
npm install
```

Create `.env.local` with these two variables (names only, never commit values):

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The anon (publishable) key is public by design: it ships to every browser, and row level security decides what it can do. It is still kept out of the repo. Never put the service role key anywhere in this project. The same two variables are set in Vercel's environment variables.

```bash
npm run dev
```

Open http://localhost:3000. To run the tests (Node's built-in test runner, no extra packages):

```bash
node --test tests/
```

To make someone a reviewer, add their user id to `public.reviewers` in the Supabase SQL editor.

## 8. Submission checklist

- Live URL loads logged out and shows published entries only: yes, https://khmer-music-archive.vercel.app
- A stranger cannot publish their own entry through the page or the console: yes, tested (UNSURE: date)
- Logged out, the API returns nothing pending or returned: yes, tested 2026-11-16. With only the public key, `entries?status=neq.published` returned `[]`, `reviewers` returned `[]`, and calling `review_entry`, inserting a published entry, updating `status` and deleting were all refused with error 42501
- Contributors can edit and delete only their own entries: yes
- No secrets anywhere in the repo history: yes, checked with `git log --all -p` searched for `service_role`, `sb_secret`, `eyJhbGci` and `SUPABASE_...=` (no matches, 2026-11-16)
- At least eight real entries, each with a credited source: yes, 13
- Khmer renders on every screen a user meets, including the queue: yes
- Works at phone width: yes, tested 2026-11-16 at 375 px browser width (Browse, an entry, Log in, Sign up, Contribute, My entries and Review, none scroll sideways). UNSURE: also try it on your own phone
- No test entries, lorem ipsum or TODO comments in shipped pages: yes, `app/`, `components/` and `lib/` searched for TODO, FIXME, TEMPORARY and lorem on 2026-11-16 (no matches). UNSURE: confirm none of the 13 entries is a test entry
- No console errors on the main pages: yes, checked logged out on 2026-11-16 (one Supabase "Multiple GoTrueClient instances" warning on Browse, which is a warning, not an error)
- jesseorndorff is a collaborator on this repo: yes (UNSURE)
- Supabase project restored and awake on (UNSURE: date)
- Demo video link opens in a private window: yes, (UNSURE: link)
- Reflection pasted in the Canvas submission: yes (UNSURE)
- Posted in the Show Your Archive discussion: yes (UNSURE)
- Q&A slot booked for (UNSURE: date and time)
