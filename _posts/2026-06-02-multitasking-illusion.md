---
layout: post
title: "The Multitasking Illusion: Your Brain Is a Single-Core Processor"
date: 2026-06-02
tags: [Leader, Coach]
---

What we call multitasking is not multitasking. It is rapid task-switching — and the brain pays a cost every single time.

---

## Underlying Research

**Earl K. Miller & Jonathan D. Cohen (2001)**  
*"An Integrative Theory of Prefrontal Cortex Function"*  
Journal: Annual Review of Neuroscience, Vol. 24, pp. 167-202  
DOI: [10.1146/annurev.neuro.24.1.167](https://doi.org/10.1146/annurev.neuro.24.1.167)  
Institution: MIT Picower Institute for Learning and Memory

**Rubinstein, J. S., Meyer, D. E., & Evans, J. E. (2001)**  
*"Executive Control of Cognitive Processes in Task Switching"*  
Journal: Journal of Experimental Psychology: Human Perception and Performance, Vol. 27(4), pp. 763-797  
DOI: [10.1037/0096-1523.27.4.763](https://doi.org/10.1037/0096-1523.27.4.763)  
Institution: University of Michigan / National Institutes of Health

**Ophir, E., Nass, C., & Wagner, A. D. (2009)**  
*"Cognitive Control in Media Multitaskers"*  
Journal: Proceedings of the National Academy of Sciences, Vol. 106(37), pp. 15583-15587  
DOI: [10.1073/pnas.0903620106](https://doi.org/10.1073/pnas.0903620106)  
Institution: Stanford University

**Mark, G., Gonzalez, V. M., & Harris, J. (2005)**  
*"No Task Left Behind? Examining the Nature of Fragmented Work"*  
Conference: CHI '05: Proceedings of the SIGCHI Conference on Human Factors in Computing Systems  
DOI: [10.1145/1054972.1055017](https://doi.org/10.1145/1054972.1055017)

---

## Key Findings

- The prefrontal cortex — the region responsible for goals, rule-following, and decision-making — operates serially, not in parallel. It cannot direct two complex cognitive tasks simultaneously (Miller & Cohen, 2001)
- When switching tasks, two phases of overhead occur: "goal shifting" (deciding to switch) and "rule activation" (loading the new task's rules). Both take time. Neither is free (Rubinstein et al., 2001)
- Even brief mental blocks from switching can cost as much as 40% of productive time (Meyer, cited in APA, 2006)
- Switch costs are small per switch — fractions of a second — but accumulate rapidly under the conditions of modern knowledge work
- Heavy media multitaskers perform worse on task-switching than light multitaskers, and are more susceptible to distraction — not better (Ophir et al., 2009)
- Observed knowledge workers averaged just 12 minutes in a working task before switching, with 57% of sessions interrupted before completion (Mark et al., 2005)

---

## What This Means for Software Teams

**The illusion is architectural.** The reason organizations keep assigning people to multiple projects is that the cost is invisible. Switches feel instant. Meetings feel short. Slack notifications feel cheap. The overhead does not announce itself — it quietly consumes the time between productive moments, and never shows up on any dashboard.

**The 40% that disappears.** Assigning one developer to three projects does not produce three shares of focused work. It produces three fractional allocations of a serial processor, plus switching overhead between them. The prefrontal cortex cannot parallelize complex reasoning. What you get is not 33% on each — it is roughly 20% on each, plus 40% spent on nothing but switching. That 40% does not appear anywhere. It just vanishes.

**Context is binary, not proportional.** When a developer switches to a "quick question," they do not retain 80% focus on the original task. The prefrontal cortex evicts the working context to handle the new demand. When they return, that context must be rebuilt from scratch. This is why "it'll only take 5 minutes" interruptions rarely cost 5 minutes. The interruption is 5 minutes. The reconstruction is not.

**"I can handle multiple things" is a cognitive illusion.** People who believe they multitask well tend to be the worst at it. Ophir et al. (2009) found that heavy multitaskers were more susceptible to distraction, less able to filter irrelevant information, and slower to switch between tasks than people who rarely multitasked. The people most accustomed to juggling were least equipped to do it. The feeling of fluency is not evidence of performance.

**Sprint planning does not fix this.** Organizing work into two-week cycles while people still context-switch between projects daily does not address the bottleneck. The sprint is a planning unit. The problem is in the allocation model — specifically, how many parallel cognitive loads a single person is expected to carry at once.

**Meetings are context switches with scheduling overhead.** A 30-minute meeting in the middle of focused work is not a 30-minute cost. It is a full context eviction, a meeting, and a full context reload. For complex work, that reload can take longer than the meeting itself. The true cost is not on the calendar.

---

## The Systemic Pattern

Part 1 of this series explored attention residue — the phenomenon where switching tasks leaves cognitive attention behind on the previous task, impairing performance on the new one. That is about what you carry forward.

This is about what you never had.

Parallel work is a fiction the brain cannot support. The prefrontal cortex serializes everything that requires deliberate thought. Organizations that structure work as if cognitive parallelism were possible — multiple simultaneous projects, constant context-switching, open-plan interruptions, all-day notification culture — are not utilizing capacity. They are destroying it.

The switch costs are not a personal performance problem. They are an organizational design choice.

---

**References:**

- Miller, E.K. & Cohen, J.D. (2001). An integrative theory of prefrontal cortex function. *Annual Review of Neuroscience*, 24, 167-202.
- Rubinstein, J.S., Meyer, D.E., & Evans, J.E. (2001). Executive control of cognitive processes in task switching. *Journal of Experimental Psychology: Human Perception and Performance*, 27(4), 763-797.
- Ophir, E., Nass, C., & Wagner, A.D. (2009). Cognitive control in media multitaskers. *PNAS*, 106(37), 15583-15587.
- Mark, G., Gonzalez, V.M., & Harris, J. (2005). No task left behind? *CHI '05*.
- American Psychological Association (2006). Multitasking: Switching costs. *APA Science Watch*.

---

Patrik Gustafsson  
Software Engineer & Organizational Designer  
[acyclic.eu](https://acyclic.eu) | [LinkedIn](https://www.linkedin.com/in/acyclic/)
