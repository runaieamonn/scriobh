---
title: "Privacy as game theory"
slug: "privacy-as-game-theory"
date: 2023-02-24
excerpt: "Consider a person using a free Internet app. The Internet company wants to gather data about the user, while the user wants to protect their privacy. This…"
---
Consider a person using a free Internet app. The Internet company wants to gather data about the user, while the user wants to protect their privacy. This creates a natural tension between the two parties.

Can we use game theory to model trust in a quantified way, by expressing this as a Prisoner's Dilemma?

|   | Company Cooperates | Company Defects |
|----|----|----|
| **Person Cooperates** | company *Reward*, person *Reward* |company *Temptation*, user *Sucker* |
| **Person Defects** |  company *Sucker*, person *Temptation* | company *Punishment*, person *Punishment* |

Where $$ Temptation > Reward > Punishment > Sucker $$
We will call the case of where both participants cooperate as "trust".

Game theory shows that if the game is played just once by rational players then both will defect.

However if the game is played multiple times by the same players then mutual cooperation, i.e. trust, can be a stable outcome, however only on the condition that  $$ Reward >  \frac{ Temptation + Sucker }{ 2 }  $$
One way to use this model for the relationships between a person and an Internet company is as follows:

* The person
  * is trying to maximize privacy
  * cooperates or defects by either **consenting** or **rejecting** sharing non-essential data. This, for example, could be by logging in or staying logged out, or accepting or rejecting cookies in a consent banner.
* The company
  * is trying to maximize the amount of personal user data it can process
  * cooperates by practicing **data minimization** or defects by using **excessive  data**

Without loss of generality, let's set the *Sucker* value to **0**. This is the least amount of privacy for the user (if they consent to data sharing but the company uses excessive data), and the least amount of data for the company (if they practice data minimization but the user rejects data sharing).

Let's set the *Punishment* to **1**. This is the value of privacy to the person and data to the company when the person rejects and the company uses excessive data.

Let's set the *Reward* to **2**. This is that value of privacy to the person and data to the company when the person consents and the company practices data minimization.

Let's set the *Temptation* to **3**. This is the most amount of privacy for the user (if they reject data sharing and the company practices data minimization), and the most amount of data for the company (if they use excessive data and the user consents to data sharing).

|   | Company practices Data minimization | Company uses Excessive data |
|----|----|----|
| **Person Consents** | Data=2 Privacy=2 | Data=3 Privacy=0 |
| **Person Rejects** |  Data=0 Privacy=3 | Data=1 Privacy=1 |

The above is an example of a payoff table that could result in trust (mutual cooperation) over the long term.

In general (assuming *Sucker* is zero, the condition for trust is: $$ Temptation < 2 Reward $$
So for trust to be possible

* When the company practices data minimization, for the person the  privacy value of rejecting data sharing must be less than twice the value of consenting to data sharing.
* When the user consents to data sharing, for the company the value of using excessive data must be less than twice the value of practicing data minimization.

So the lesson for companies is that for long term trust there must be the following bounds on their use of data :

* with a consenting user, extract more than half of the maximum value of the data
* minimize data use enough that the user gets more than half the maximum privacy value even when they consent to data sharing
