---
title: "Google and Epic Games Abandon Play Store Settlement, Forcing Android Open to Rival App Stores July 22"
slug: "google-epic-abandon-play-store-settlement-android-app-stores-july-22"
date: "2026-07-16"
category: "Science & Technology"
description: "The Lead"
cover: "/images/covers/google-epic-abandon-play-store-settlement-android-app-stores-july-22.jpg"
tags: ["policy", "regulation", "google", "epic", "games", "play", "store", "android"]
youtubeUrl: "https://youtube.com/shorts/HE_NkTjJko4"
tiktokUrl: ""
audioUrl: "/audio/google-epic-abandon-play-store-settlement-android-app-stores-july-22.wav"
videoStatus: "scheduled"
sourceCount: 14
---

## The Lead

For nearly six years, Google fought to keep the Play Store closed. On July 15, 2026, it stopped fighting. In a joint filing with Epic Games, Google withdrew the negotiated settlement it had spent months trying to get approved, choosing instead to let U.S. District Judge James Donato's original October 2024 injunction stand as written. The practical result lands July 22: qualifying third-party Android app stores become directly downloadable from inside the Google Play Store itself, with access to Google's own app catalog, in the United States. Six years of litigation, an $800 million secret side deal, an unapproved settlement, and a court-appointed economist's blunt testimony all fed into this moment — and Google ultimately chose the harder outcome over the messier one.

## The Nut Graf

This is the actual, final unwinding of Epic Games, Inc. v. Google LLC, the case a nine-person San Francisco jury decided in Epic's favor on all eleven counts in December 2023, finding Google had illegally monopolized Android app distribution and in-app billing. Judge Donato's October 2024 injunction ordered Google to let rival app stores live inside Google Play and share its catalog with them; Google spent the following 18 months trying to soften that outcome through appeals, a Supreme Court stay request, and finally a negotiated settlement with Epic that would have swapped the injunction for a lighter, sideloading-based "Registered App Stores" framework. Google and Epic abandoned that settlement on July 15, 2026, a day before a scheduled July 16 hearing, after the court's own economic expert testified the deal wouldn't meaningfully help competitors. What survives is the harsher original remedy — Google's own storefront, opened to its rivals, starting July 22.

## What Actually Changed

Under the new Play Catalog Access Program, eligible third-party Android app stores in the U.S. can enroll with Google, pass a security and policy review, and gain access to the Google Play catalog — app names, icons, descriptions, screenshots, and videos — through a mechanism Google calls the Inline Install API. Google notified U.S. developers on June 22 that their listings would automatically be shared with approved rival stores starting July 22 unless they explicitly opted out in Play Console; Google supplies daily catalog snapshots via Google Cloud Storage, with intra-day updates planned later.

Participating stores must operate as legitimate, non-discriminatory marketplaces open to any eligible developer, publish enforceable privacy and safety policies, offer parental controls, keep malware below 1% of install attempts over rolling 30-day windows, and distribute only within the United States. Enrollment costs $5,000 upfront for the security review and another $5,000 annually to keep catalog access. Crucially, downloads and installs still route through Google Play under Google's existing terms — meaning Google's standard Play service fees still apply even to an app a user finds and installs through a competitor's storefront. Rival stores get shelf space inside Google's mall; Google still runs the register.

This is separate from — and moves faster than — Google's other, self-initiated Play Store overhaul. That broader "global business model evolution," which began rolling out June 30, 2026 in the U.S., EEA and UK, cuts standard service fees to as low as 10% on a developer's first $1 million in annual revenue and unbundles the service fee from a 5% billing fee developers can avoid by using alternative payment systems. Google is also building a separate, voluntary "Registered App Stores" sideloading program — meant to arrive globally with an Android 17 release later in 2026 — that streamlines one-click installs of alternative stores from websites. The July 22 change is narrower and court-ordered: it applies only to stores that enroll in the Play Catalog Access Program, only in the U.S., and only for apps whose developers haven't opted out.

## The Business Stakes

The number that keeps resurfacing in this case is $800 million — the value of a previously secret, six-year commercial partnership between Google and Epic covering joint marketing, joint product development, and use of Epic's Unreal Engine, disclosed only when it surfaced in a January 2026 court hearing. Judge Donato openly questioned whether that side deal had shaped Epic's willingness to accept softer settlement terms; Epic CEO Tim Sweeney described it in court as each company "separately building product lines with plans to work together." That reveal complicated the settlement's credibility right as the parties were trying to get it approved.

Money was also the substance of the fight itself. Epic's original 2020 lawsuit grew out of Google pulling Fortnite from the Play Store after Epic bypassed Google's 30% in-app billing cut. The settlement Google and Epic tried and failed to get approved this spring reportedly would have cut Google's take to "20% or less" depending on the transaction, alongside Fortnite's return to Google Play globally by March 19, 2026 — and, according to reporting on the settlement text, a non-disparagement clause binding Sweeney's public criticism of Google through roughly 2032. None of that mattered once the settlement itself was scrapped; what governs now is the blunter 2024 injunction, not the negotiated compromise.

## The Evidence

The settlement's death has a name attached to the reasoning: Nancy Rose, an MIT economics professor serving as the court's independent expert, testified in January 2026 that the proposed changes were "unlikely to enable Google Play's potential competitors to overcome their long-standing network-effect disadvantage in a timely manner." According to court filings reported by MLex, Rose found that three separate sets of changes Google and Epic proposed "do not appear to be supported by evidence the Court requested." Judge Donato, for his part, grew visibly frustrated as Google kept revising its own Play Store policies mid-litigation, which muddied exactly what the settlement was even proposing by the time an April 10, 2026 hearing rolled around.

Google's public framing of the withdrawal, delivered by spokesperson Dan Jackson, was that continuing to fight was no longer worth the uncertainty: "We've agreed with Epic to withdraw our motion to modify the U.S. Court's injunction rather than prolonging this process," Jackson said, adding that Google remains committed to "maintaining Android's industry-leading security" and that dropping the fight "allows us to focus on executing our recently announced global business model evolution to deliver greater app store choice, lower prices, and more opportunities for developers and users." That is a company converting a lost argument into a talking point about a program it was already planning to run regardless.

## The Competitive Read

The rivals with the most to gain are the ones that already have scale but not discoverability inside Google's own storefront. Samsung's Galaxy Store — preinstalled on every Samsung Android device, with more than 500 million monthly active users and over 200,000 apps — is a leading candidate to enroll. Amazon's Appstore, the default marketplace on Fire tablets and already available as a sideload on Android, is another. Aptoide, which was already sideload-accessible in the U.S. by the end of 2025, and Epic's own storefront are considered credible early entrants, though none had confirmed a day-one listing inside Google Play as of this reporting. Microsoft has separately signaled interest in mobile storefronts.

The contrast with Apple is instructive. Epic's parallel antitrust case against Apple produced a narrower remedy — primarily forcing Apple to allow external payment links inside apps rather than mandating rival app stores be sold from inside the App Store. Google's outcome is structurally different and more disruptive to its own business: rather than just permitting a workaround, a U.S. jury verdict and a federal judge's order are compelling Google to actively distribute its competitors' storefronts from its own primary shelf space. No comparable order exists yet for iOS.

## The Operator Read

For a developer shipping on Android, the immediate decision was binary with a deadline that has already passed for anyone who wanted to change course before launch: opt in (the default) or opt out, inside Play Console, before July 22. Staying in means a listing potentially reaches users through Samsung's Galaxy Store or Amazon's Appstore without extra submission work — but it also means ceding some control over where and how that listing appears, subject to Google's non-discrimination rules for participating stores rather than a developer's own storefront agreements. Opting out keeps distribution exactly as it is today.

Separately, and on a different clock, developers should track Google's June 30 fee changes — the drop to as low as 10% service fee on a first $1 million of annual revenue and the unbundled 5% billing fee — because that program, unlike the July 22 catalog access rule, already directly changes what Google keeps from every transaction. The two changes are easy to conflate in headlines but come from different sources of authority: one is a court order Google resisted, the other a business decision Google is choosing to make on its own terms and its own rollout schedule (US/EEA/UK by June 30, Australia by September 30, Korea and Japan by year-end, the rest of the world by September 2027).

## The Risk

The obvious risk sits in the fact that downloads still process through Google under existing terms. Rival stores gain visibility inside Google's shop window, but Google still processes the transaction and still collects its standard Play service fee even on installs discovered through a competitor. Whether Google can additionally charge fees on link-out purchases — where a user leaves an app entirely to pay on a developer's own website — remains legally unresolved, and it's the fight most likely to define the next phase of this dispute.

There's also a security-and-scale risk baked into the 1%-malware threshold: it's a real operational bar, but it still means a nontrivial volume of bad installs is tolerated before a store loses access, and Google's compliance and policy teams now have to police marketplaces they don't run. And because this rule applies only in the U.S., any company measuring the win — including Epic, whose Fortnite ambitions span markets — has to remember that Android users everywhere else are still on Google's older rules for now.

## What To Watch Next

Watch which stores actually enroll and go live on July 22, since intent (Samsung, Amazon, Aptoide, Epic) and confirmed day-one participation aren't the same thing yet. Watch whether Judge Donato's court revisits link-out fees, the one major piece of the injunction's economics still unsettled. Watch the global "Registered App Stores" sideloading program Google says will ship with a major Android release by the end of 2026, the mechanism meant to eventually extend a version of this openness outside the U.S. And watch whether Tim Sweeney, no longer bound by a settlement that would have muzzled him through 2032, returns to public criticism of Google now that the deal that would have silenced him has collapsed along with everything else.

## Sources

- [Epic and Google Jointly Withdraw Play Store Settlement; Rival Android App Stores to Open July 22](https://www.techtimes.com/articles/320593/20260715/epic-google-jointly-withdraw-play-store-settlement-rival-android-app-stores-open-july-22.htm)
- [Google and Epic withdraw settlement as Play Store overhaul moves ahead](https://www.pocketgamer.biz/google-and-epic-withdraw-settlement-as-play-store-overhaul-moves-ahead/)
- [Google settles lawsuit with Epic Games, agrees to allow third-party app stores on Android](https://seekingalpha.com/news/4614121-google-settles-lawsuit-with-epic-games-agees-to-allow-third-party-app-stores-on-android)
- [Android's Biggest Store-Within-a-Store Shakeup Starts Next Week](https://ground.news/article/google-and-epic-give-up-fighting-third-party-android-app-stores-are-coming-next-week)
- [Android's biggest store-within-a-store shakeup starts next week](https://www.androidauthority.com/epic-google-play-store-settlement-withdrawn-3687649/)
- [Google, Epic Games abandon effort to modify US Play Store injunction](https://www.mlex.com/mlex/articles/2501619/google-epic-games-abandon-effort-to-modify-us-play-store-injunction)
- [Epic, Google settlement changes not backed 'by evidence,' US judge's expert says](https://www.mlex.com/mlex/technology/articles/2500353/epic-google-settlement-changes-not-backed-by-evidence-us-judge-s-expert-says)
- [Google is opening the floodgates to third-party app stores on Android next week](https://9to5google.com/2026/07/15/google-play-store-third-party-android-app-store-changes-july/)
- [Google's secret $800 million Epic partnership is a massive plot twist in the Android antitrust saga](https://9to5google.com/2026/01/22/google-epic-games-deal-court-reveal/)
- [Epic's Sweeney Muzzled by Google Through 2032 Settlement](https://www.techbuzz.ai/articles/epic-s-sweeney-muzzled-by-google-through-2032-settlement)
- [Google Play opens to third-party app stores on 22 July](https://thenextweb.com/news/google-play-third-party-app-stores-july-22)
- [Google opens Play Catalog Access Program for third-party Android app stores](https://www.fonearena.com/blog/487496/google-play-catalog-access-program-third-party-android-app-stores.html)
- [Supreme Court Denies Google Request to Pause Play Store Changes](https://www.bloomberg.com/news/articles/2025-10-06/supreme-court-denies-google-request-to-pause-play-store-changes)
- [Epic Games v. Google (Wikipedia)](https://en.wikipedia.org/wiki/Epic_Games_v._Google)
