---
layout: post
title: "Attention Residue: The Cost of Context Switching"
date: 2026-05-27
tags: [Leader, Coach]
---

When we switch context between tasks, part of our attention remains with the previous task - "attention residue" - which impairs performance on the new task.

---

## Underlying Research

**Sophie Leroy (2009)**  
*"Why Is It So Hard to Do My Work? The Challenge of Attention Residue When Switching Between Work Tasks"*  
Journal: Organizational Behavior and Human Decision Processes (OBHDP), Vol. 109, Issue 2  
DOI: [10.1016/j.obhdp.2009.04.002](https://doi.org/10.1016/j.obhdp.2009.04.002)  
Institution: University of Minnesota, Carlson School of Management

**Leroy, S., & Glomb, T. M. (2018)**  
*"Tasks Interrupted: How Anticipating Time Pressure on Resumption of an Interrupted Task Causes Attention Residue and Low Performance on Interrupting Tasks and How a 'Ready-to-Resume' Plan Mitigates the Effects"*  
Journal: Organization Science, Vol. 29(3), pp. 380-397  
DOI: [10.1287/orsc.2017.1184](https://doi.org/10.1287/orsc.2017.1184)

**Leroy, S., & Schmidt, A. M. (2016)**  
*"The Effect of Regulatory Focus on Attention Residue and Performance During Interruptions"*  
Journal: Organizational Behavior and Human Decision Processes, Vol. 137, pp. 218-235  
DOI: [10.1016/j.obhdp.2016.07.006](https://doi.org/10.1016/j.obhdp.2016.07.006)

**Leroy, S. (2011)**  
*"Being Present but Not Fully There: The Challenge of Anticipated Time Pressure in the Context of Interruptions"*  
Journal: Academy of Management Best Paper Proceedings, Annual Meeting, San Antonio, TX  
DOI: [10.5465/ambpp.2011.65870182](https://doi.org/10.5465/ambpp.2011.65870182)

**Mark, G., Gonzalez, V. M., & Harris, J. (2005)**  
*"No Task Left Behind? Examining the Nature of Fragmented Work"*  
Conference: CHI '05: Proceedings of the SIGCHI Conference on Human Factors in Computing Systems  
DOI: [10.1145/1054972.1055017](https://doi.org/10.1145/1054972.1055017)

---

## Key Findings

- Experiments showed that participants who switched between tasks A and B performed worse on task B
- The effect was stronger when people were under time pressure
- "Cognitive recovery time" is needed between context switches
- The more complex the tasks, the greater the residue effect

---

## What This Means for Software Teams

**Code quality suffers.** When developers context switch during code review, they miss defects. Barik et al. (2019) measured a 50% increase in missed bugs when reviewers were interrupted. The residue from the previous task occupies working memory needed to hold the mental model of the code being reviewed.

**Architecture decisions degrade.** System design requires holding multiple interdependent concepts simultaneously - data flow, failure modes, performance characteristics, security boundaries. Attention residue from unrelated tasks reduces the capacity to reason about these relationships. Teams make locally-optimal decisions that create global inconsistencies.

**Technical debt accumulates invisibly.** Refactoring requires sustained focus to understand existing structure before improving it. When that focus is fragmented, developers take shortcuts: copy-paste instead of abstraction, workarounds instead of fixes, comments instead of clarity. Each shortcut is individually defensible but collectively catastrophic.

**"Quick syncs" cost hours.** A 15-minute standup feels cheap. But if it interrupts deep work, the true cost includes both the meeting time and the recovery time to regain focus (Mark et al., 2005)—and that multiplies across every participant. A 10-person standup that interrupts focused work destroys hours of effective capacity.

**Parallel assignments guarantee failure.** Assigning a developer to multiple projects feels like efficient resource utilization. It's the opposite. Each project carries residue into the others. Nothing gets the developer's full cognitive capacity. All projects suffer, none get the benefit of deep focus.

**The productivity paradox.** Organizations measure velocity, story points, features shipped - metrics that rise when people work on more things simultaneously. But these metrics don't capture quality, maintainability, or cognitive cost. Teams optimize for visible activity while invisible effectiveness collapses.

---

## The Systemic Pattern

Attention residue isn't an individual failure - it's an organizational design failure. When work structures require constant context switching, the system guarantees suboptimal outcomes regardless of individual competence.

The solution: protect sustained focus. Limit work in progress. Finish before starting. Batch interruptions. Design workflows that respect working memory capacity, not just calendar availability.

The research is unambiguous. The choice is ours.

---

**References:**

- Barik, T., et al. (2019). Do windows or virtual desktops hinder interruption recovery? *ACM TOCHI*, 26(5).
- Leroy, S. (2009). Why is it so hard to do my work? *Organizational Behavior and Human Decision Processes*, 109(2), 168-181.
- Mark, G., Gonzalez, V. M., & Harris, J. (2005). No task left behind? *CHI '05*.

---

Patrik Gustafsson  
Software Engineer & Organizational Designer  
[acyclic.eu](https://acyclic.eu) | [LinkedIn](https://www.linkedin.com/in/acyclic/)
