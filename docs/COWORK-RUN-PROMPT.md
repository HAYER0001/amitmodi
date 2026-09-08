# Run prompt for Claude Cowork — verify, produce, post, boost

**How to use:** give Amit everything below the line. He pastes it into the
same Cowork chat after the setup prompt, or at the start of each month. It
exists because an agent working through a browser will sometimes *say* a step
is done when it is not. Every step here demands evidence. It is safe to run
repeatedly — it changes nothing until Amit says yes.

---

You are running this month's marketing for **Amit Modi & Co.** I am Amit.
Before you produce or post anything, you will prove the foundation is
actually in place. Then you will make this month's images and videos, post
them, and run two boosts. The rules from the setup prompt still apply; the
ones below are added on top and win if they conflict.

## Rule 0 — evidence, not claims

This is the most important rule in this prompt.

- **A step is done only if you observed it in my browser.** For every check
  and every action, write what you saw: the page, the setting, the exact
  value or status. Quote it.
- **Three answers only:** `PASS` (seen, correct), `FAIL` (seen, wrong or
  missing), `NOT VERIFIED` (could not see it — page did not load, could not
  find it, was signed out). Never turn a `NOT VERIFIED` into a `PASS` by
  assuming.
- **Never write "I have scheduled", "the ad is running", "the images are
  ready."** Write what the screen shows: *"Planner shows: [post title], [date],
  status Scheduled"* — *"Ads Manager shows: [ad name], status In review,
  budget ₹1,000"* — *"Folder contains: latefee-01.png, 1.2 MB."*
- If you could not click something, a tool refused, a quota ran out, or a
  page errored, **say so plainly and stop that step.** Do not describe what
  would have happened as if it happened.
- When something is uncertain, the correct output is `NOT VERIFIED` plus what
  you need from me. That is never a failure on your part. Guessing is.

## Rule 1 — the budget is ₹2,000 a month, maximum, total

- Two boosts of **₹1,000** each. Nothing else paid. No third boost, no
  "small test", no extension past the budget.
- **Before any boost, set the Account Spending Limit in Ads Manager to
  ₹2,000** (Billing → Payment settings → Account spending limit). Show me the
  screen with the limit saved. This makes overspending impossible, not just
  forbidden. If the limit already exists at ₹2,000, `PASS` it with evidence.
- If Meta suggests raising a budget, "boosting for longer," or adding an
  audience, the answer is no.
- Any payment screen: stop, tell me, I handle it (rule 2 of the setup prompt).

## Step 1 — Prove the foundation

Fill this table in full, with evidence in every row, before anything else.
Do not skip rows. Do not reorder.

| # | Check | PASS / FAIL / NOT VERIFIED | What you saw |
|---|---|---|---|
| 1 | Facebook Page **Amit Modi & Co.** exists, category Tax Consultant, address, phone, website `https://amitmodi.co.in` set | | |
| 2 | The Page is inside a **Business Portfolio** with me as admin | | |
| 3 | Instagram is a **Professional** account, linked to the Page, bio has the website link | | |
| 4 | An **ad account** exists — currency INR, time zone Asia/Kolkata | | |
| 5 | A **payment method** is on the ad account (do not add one — report) | | |
| 6 | **Account Spending Limit** is ₹2,000 (Rule 1) | | |
| 7 | A **Meta Pixel** exists in Events Manager for amitmodi.co.in; its ID | | |
| 8 | That Pixel ID has been **sent to my developer** (search this chat / ask me) | | |
| 9 | **WhatsApp Business** is set up on the practice number and connected to the Page button | | |
| 10 | That WhatsApp number has been **sent to my developer** | | |
| 11 | **Google Business Profile** exists and is verified; its URL | | |
| 12 | Open `https://amitmodi.co.in/contact` in the browser: the form loads | | |
| 13 | Open `https://amitmodi.co.in/tools/late-fee-calculator`: the tool loads | | |

**Then:**
- Any `FAIL` or `NOT VERIFIED` in rows 1–6 → **stop here.** List exactly what
  is missing and what you need from me. Do not proceed to Step 2.
- Rows 7–11 can be `FAIL` and we still proceed, but list them in the final
  report as open items, because without them the funnel is not fully wired.
- Rows 12–13 `FAIL` → stop and tell me; those are the pages the ads send
  people to.

## Step 2 — Produce this month's assets

Only after Step 1 passes. I have a **Google AI Pro** membership, which
includes Flow. Use my browser.

**Images — Pomelli (labs.google/pomelli).** The brand profile is built from
`https://amitmodi.co.in`. Generate one image for each of the four posts in
the setup prompt's theme table. Hindi text first on the image, no numbers
that are not on the destination page, nothing that breaks the Bar Council
rule.

**Videos — Flow (labs.google/flow).** Make one short **vertical (9:16)** video
for each of the **two boosted** posts — the notice post and the late-fee
calculator post. Short: a single 8-second clip is fine; two clips joined at
most. Calm, clean, on brand: cream, deep green, brass. No spoken numbers, no
on-screen numbers, no claims. If Flow shows a quota or credit limit, report
it as `NOT VERIFIED` and we use the image instead — do not pretend the video
exists.

**Evidence, then approval.**
1. Download every approved-candidate file to one folder named
   `amitmodi-marketing/YYYY-MM/`.
2. List the folder: **file name and size** for each. That list is the
   evidence the assets exist.
3. Show me every image and video with its post theme. I pick, edit, or
   reject. **Nothing moves to Step 3 without my written yes on each asset.**

## Step 3 — Post

For the four approved posts, in **Meta Business Suite → Planner**, schedule
each one to Facebook and Instagram together, roughly a week apart, weekday
mornings. Caption per the setup prompt's copy rules — Hindi first, one link,
UTM-tagged, at most five hashtags. The two boosted posts use their videos;
the two organic posts use their images.

**Show me the drafted captions and dates first. Wait for yes.** Then schedule.

**Evidence:** after scheduling, open Planner and report each entry as it
appears — title, date, platforms, status. Four rows, or an honest account of
why fewer.

## Step 4 — Boost

Only the two posts marked boosted. Only after Step 3's evidence.

1. Confirm the Account Spending Limit (Step 1 row 6) is still ₹2,000. Evidence.
2. For each of the two posts — settings exactly as the setup prompt: objective
   Traffic; Suratgarh + 40 km; age 25–60; the listed interests; automatic
   placements; **₹1,000 total over 7 days**; destination the post's UTM link
   with `utm_medium=paid`.
3. **Show me the full settings screen for each before confirming.** Wait for
   yes on each.
4. If a payment step appears, stop — I do it.

**Evidence:** open Ads Manager and report each boost as it appears — name,
status (In review / Active), daily and total budget, end date. Two rows.
Then total spend committed: it must read **₹2,000 or less.** State the number.

## Step 5 — Report

One screen, nothing else:

- Step 1 table (final).
- Assets: the folder listing.
- Posts: the four Planner rows.
- Boosts: the two Ads Manager rows and the committed total.
- **Open items** — every `FAIL` and `NOT VERIFIED` from the whole run, each
  with what is needed from me or from my developer.
- Anything you were unsure about, said as uncertainty.

Begin with Step 1. Fill the table.
