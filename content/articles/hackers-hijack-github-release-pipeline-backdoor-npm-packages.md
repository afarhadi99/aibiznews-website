---
title: "Hackers Hijack GitHub's Own Release Pipeline to Backdoor Popular npm Packages Used by Millions"
slug: "hackers-hijack-github-release-pipeline-backdoor-npm-packages"
date: "2026-07-16"
category: "Science & Technology"
description: "The Lead"
cover: "/images/covers/hackers-hijack-github-release-pipeline-backdoor-npm-packages.jpg"
tags: ["cybersecurity", "asyncapi", "npm", "supply", "chain", "attack", "github", "actions"]
youtubeUrl: ""
tiktokUrl: ""
audioUrl: "/audio/hackers-hijack-github-release-pipeline-backdoor-npm-packages.wav"
videoStatus: "pending"
sourceCount: 10
---

## The Lead

At 5:08 a.m. UTC on July 14, someone opened 37 pull requests against a single GitHub repository: asyncapi/generator, the code-generation engine behind the AsyncAPI specification, a widely used open standard for documenting event-driven APIs. Thirty-six were noise. One, PR #2155, carried obfuscated JavaScript built to exploit a known class of GitHub Actions misconfiguration. Eight minutes later the attacker had a working, highly privileged access token. By 7:10 a.m., the first trojanized npm packages were live on the public registry, signed with legitimate cryptographic proof that they had come from AsyncAPI's own official build pipeline. Nothing about the delivery mechanism looked fake, because none of it was — it was AsyncAPI's real infrastructure, doing exactly what it was built to do, for someone who didn't belong there.

## The Nut Graf

Attackers compromised four repositories inside the AsyncAPI GitHub organization on July 14, stole a privileged personal access token belonging to the project's automation account, and used it to push malicious commits that the project's own release automation then packaged, signed, and published to npm without any human review. Five poisoned versions across four packages — @asyncapi/generator, @asyncapi/generator-components, @asyncapi/generator-helpers and @asyncapi/specs — went out carrying a combined 2.9 million weekly downloads, according to security firm Aikido Security. Each contained a loader for a multi-stage payload researchers are calling "Miasma," a remote-access framework with credential-stealing, persistence and command-and-control capabilities spanning six separate communication channels. Microsoft's own security team published a technical dissection of the incident on July 15, one of at least seven separate vendor writeups the attack generated within 48 hours.

## What Actually Changed

The mechanism attackers abused is known in the industry as a "pwn request": a GitHub Actions workflow triggered by the `pull_request_target` event, which grants access to a repository's secrets, but configured to check out and execute code from the untrusted pull request itself rather than the trusted base branch. According to Wiz and Aikido Security, the vulnerable workflow — used to build Netlify documentation previews — ran on PR #2155 at 5:16 a.m. UTC and exfiltrated a personal access token belonging to the asyncapi-bot service account to the paste site rentry.co.

From there the attacker didn't need to touch npm credentials directly. AsyncAPI's release pipeline was configured so that any commit pushed to specific branches — `next` in the generator repository, `alpha` and `master` in the spec-json-schemas repository that produces @asyncapi/specs — with a commit message prefixed `fix:` or `feat:` would automatically trigger a build and publish to npm via GitHub's OIDC-based trusted-publishing integration. Those branches, unlike the protected default branch, accepted direct pushes without a pull request or code review. At 6:58 a.m. UTC the attacker pushed a malicious commit to `next`; the first three packages were published twelve minutes later. Between 7:51 and 8:28 a.m., eleven more commits went into spec-json-schemas, producing a prerelease and then a stable version of @asyncapi/specs at 8:06 and 8:30 a.m. respectively.

Because the packages were built and signed by AsyncAPI's genuine CI system, they carried valid SLSA provenance attestations. As Microsoft's writeup put it, "the attestations accurately identified the legitimate repositories, commits, and workflows that created the packages, even though the triggering commits were unauthorized." The cryptographic chain of custody worked exactly as designed — it just vouched for a build that should never have happened.

## The Business Stakes

AsyncAPI's tooling is invisible to most of the software industry but load-bearing for a slice of it: teams building event-driven systems on Kafka, MQTT, WebSockets and similar protocols use its specification and generator packages to produce documentation and client code automatically as part of their build pipelines. @asyncapi/specs alone accounts for roughly 2.7 million of the incident's 2.9 million weekly downloads, per Aikido's analysis, largely because it sits as a transitive dependency underneath other AsyncAPI tooling — meaning many of the developers and CI systems that pulled it in during the roughly four-hour exposure window never directly asked for it.

The more expensive fact for the industry is what this does to trust in npm's provenance system itself. Trusted publishing via GitHub's OIDC tokens was built specifically to kill off long-lived, stealable npm publish tokens — the exact vulnerability class behind earlier incidents. Here, the OIDC pipeline performed flawlessly and still shipped malware, because the compromise happened upstream of publishing, inside the CI workflow that decided what to build. Security researchers have started calling this the "provenance paradox": a cryptographically valid signature proves who built something, not that the thing they built was safe.

## The Evidence

Microsoft Threat Intelligence, credited with first identifying the compromise, named the payload after strings found inside it — "miasma-train-p1" as the build/campaign identifier — and mapped a six-stage kill chain: pipeline compromise, code injection, staged release, dependency resolution by ordinary `npm install`, import-time execution, and a second-stage fetch from the IPFS peer-to-peer network. Crucially, the payload fires when a module is imported or required by application code, not during package installation — meaning the common defensive advice to run `npm install --ignore-scripts` does nothing to stop it. Microsoft's researchers — Ravikant Tiwari, Sagar Patil, Suriyaraj Natarajan and Arvind Gowda — flagged four distinct Defender detection signatures tied to the campaign, including Trojan:JS/MiasmStealer.SC and Trojan:JS/SpawnLoader.MKV!MTB.

Independent analyses from Wiz, Aikido Security, Socket, SafeDep, OX Security and Datadog Security Labs converged on the same architecture: an obfuscated first-stage loader spawns a hidden, detached Node.js process, which retrieves an encrypted configuration and runtime file — named sync.js — from IPFS, decrypting into a multi-megabyte modular framework with command-and-control fallbacks across HTTP (to a server at 85.137.53.71), Nostr relays, Ethereum smart contracts, BitTorrent DHT and libp2p mesh networking. SafeDep's teardown found the code targets over 300 file paths for SSH keys, npm and GitHub CLI tokens, AWS and Kubernetes credentials, browser-saved passwords and cryptocurrency wallets, and even injects into VS Code's `tasks.json`. Aikido Security, notably, found that several of the scarier capabilities — self-propagation to PyPI and Cargo, credential-harvesting toggles, a "wipe" routine — were switched off in this build, logged internally as `false` flags. What remained fully live was a remote shell able to execute arbitrary commands and beacon to its command server roughly every 30 seconds, which Aikido called sufficient on its own for data theft and lateral movement on any machine that imported the packages during the window.

## The Competitive Read

This is not an isolated GitHub Actions failure — it's the third notable "pwn request" compromise of a high-download npm namespace in 2026 alone, following a May attack on the TanStack ecosystem that pushed 84 malicious versions across 42 packages in a six-minute window. Both incidents, plus the March 2025 compromise of tj-actions/changed-files that leaked secrets from more than 23,000 repositories, share a common root cause that the security community has been publicly warning about for well over a year. AsyncAPI itself had a fix for the vulnerable release workflow sitting open and unmerged for close to two months before the attack, and researchers say the risky pattern had been flagged internally 58 days earlier.

The episode also puts GitHub in an uncomfortable position as both the scene of the crime and a leading vendor of the tools meant to prevent it. Microsoft, GitHub's owner, published the most authoritative writeup of an attack that exploited a default behavior of GitHub's own Actions platform, while a cluster of npm-security specialists — Wiz, Socket, Aikido, SafeDep, StepSecurity, OX Security — raced to publish competing technical breakdowns within a day of disclosure, each surfacing slightly different details. That crowded, fast-moving response has become the de facto industry playbook for supply-chain incidents, but it also means defenders are reverse-engineering the malware in public, in real time, rather than through any coordinated advisory process.

## The Operator Read

Any team that had @asyncapi/specs, @asyncapi/generator, @asyncapi/generator-components or @asyncapi/generator-helpers resolve to the affected versions between roughly 7:10 and 11:18 a.m. UTC on July 14 should treat the affected environment as compromised, not merely patch and move on — the payload executes on import, so a clean `npm install` with scripts disabled provides no protection once the code actually runs. Practical steps researchers are recommending: pin dependencies to the last known-good versions (specs 6.11.1, generator 3.3.0, generator-components 0.7.0, generator-helpers 1.1.0), purge npm and Yarn caches, hunt for a hidden sync.js artifact, block outbound traffic to the identified C2 IP, and rotate every credential — SSH, cloud, npm, GitHub — that touched an affected build or developer machine.

The structural fix goes beyond this one incident. Microsoft is urging adoption of npm CLI 11.10.0 or later and its new "min-release-age" feature, which delays a freshly published package from being resolvable by default, buying defenders time to catch exactly this kind of rapid publish-and-exploit window. Maintainers of any project with auto-publish CI are being told to extend branch protection — requiring review and blocking direct pushes — to every branch capable of triggering a release, not just the default branch, and to avoid `pull_request_target` entirely unless the workflow checks out the base branch rather than the PR head.

## The Risk

Attribution remains unsettled. The malware's own internal naming matches an open-source "Miasma" toolkit published on GitHub in June 2026, but SafeDep's analysis found the cryptography, runtime (vanilla Node.js rather than Bun) and command-and-control design diverge enough from that public release that it may be a private, parallel build by the same authors, or a copycat group that adopted the brand after the source leaked. Either way, whoever built this had working exploit code for a well-documented CI vulnerability class ready to deploy the moment access opened up.

The larger unresolved risk is that the dangerous parts of Miasma — self-propagation across npm, PyPI and Cargo, and automated AI-tool-config poisoning — existed in the code but were toggled off this time. A future campaign, or the same operators with different settings, could ship the worm-capable version. And this is already AsyncAPI's second brush with a compromise in 2026, after being touched earlier in the year by unrelated "Shai-Hulud" worm activity — a pattern that suggests the project, and others like it that sit deep in build pipelines without matching security resourcing, remain an attractive, repeatable target.

## What To Watch Next

Watch whether npm makes min-release-age or an equivalent delay the default rather than an opt-in setting, and whether GitHub changes `pull_request_target` defaults or adds guardrails against exactly this checkout pattern. Watch whether more of the roughly two dozen security vendors now doing independent npm-supply-chain forensics converge on a single attribution for Miasma's operators, or whether the ambiguity persists. And watch AsyncAPI's own post-incident hardening — branch protection, mandatory review on release branches, and removal of auto-publish-by-commit-message — as a template other high-download but thinly staffed open-source projects will likely need to copy before they become the next case study.

## Sources

- [Compromised AsyncAPI npm Packages Deliver Multi-Stage Botnet Malware](https://thehackernews.com/2026/07/compromised-asyncapi-npm-packages.html)
- [AsyncAPI npm packages infected with credential-stealing malware](https://www.bleepingcomputer.com/news/security/-asyncapi-npm-packages-infected-with-credential-stealing-malware/)
- [Unpacking the AsyncAPI npm supply chain compromise and import-time payload delivery](https://www.microsoft.com/en-us/security/blog/2026/07/15/unpacking-asyncapi-npm-supply-chain-compromise-import-time-payload-delivery/)
- [M-Red-Team: AsyncAPI Supply Chain Compromise via GitHub Actions](https://www.wiz.io/blog/m-red-team-asyncapi-supply-chain-compromise-via-github-actions)
- [AsyncAPI npm packages backdoored via GitHub Actions](https://www.aikido.dev/blog/asyncapi-npm-packages-backdoored-via-github-actions)
- [AsyncAPI Packages Compromised with Miasma RAT](https://safedep.io/asyncapi-generator-supply-chain-attack-miasma-rat/)
- [Compromised npm Packages in the AsyncAPI Namespace Deliver Multi-Stage Malware](https://socket.dev/blog/asyncapi-supply-chain-attack)
- [AsyncAPI supply chain compromise: npm packages backdoored via GitHub Actions "pwn request"](https://www.chainguard.dev/unchained/asyncapi-supply-chain-compromise-npm-packages-backdoored-via-github-actions)
- [How Unprotected Release Branches Let Attackers Compromise AsyncAPI](https://www.endorlabs.com/learn/how-unprotected-release-branches-let-attackers-compromise-asyncapi)
- [Compromised AsyncAPI npm packages: inside a CI supply-chain attack](https://securitylabs.datadoghq.com/articles/compromised-asyncapi-npm-packages/)
