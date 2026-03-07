
*A deep dive into what happens when you make a 17th-century metaphysical proof machine-checkable.*

---

Spinoza opens the *Ethics* with a bold move. Before he says anything about the mind, morality, or human freedom, he spends the entire first part proving things about God and substance — using the format of Euclid's *Elements*. Definitions. Axioms. Propositions. Proofs. QED.

This post is about formalizing that first part in Lean 4, a modern proof assistant. We will go slowly. Every piece of code will be explained from first principles. No prior Lean knowledge is required — only a willingness to think carefully about what it means to *prove* something.

---

## What is Lean 4?

Lean 4 is a programming language and proof assistant. When you write a theorem in Lean, the compiler checks whether your proof is valid. Not approximately valid. Not plausible. *Logically airtight*, step by step, from first principles.

The experience is a bit like writing a program that compiles only if your argument is correct. If you skip a step, Lean refuses to build. If you make an unwarranted assumption, you have to name it explicitly. This discipline is brutal — and revealing.

---

## What is Spinoza Trying to Do in Part I?

The *Ethics* Part I is called "Of God." Its goal is to establish, through rigorous argument, that:

1. God necessarily exists.
2. God is the only substance there is.
3. Everything else — minds, bodies, ideas, emotions — is a *mode* of God.
4. Nothing is contingent. Everything that happens had to happen.

Spinoza calls this method *ordine geometrico demonstrata* — demonstrated in geometric order. He models it on Euclid: start with definitions and axioms so clear that no one could deny them, then derive consequences that may be surprising.

Whether the axioms are actually as undeniable as Spinoza thinks is a matter of centuries of philosophical debate. But the *structure* — definitions, axioms, theorems — is perfect for formalization.

---

## Step 1: Naming the Primitive Concepts

Before proving anything, Spinoza needs to say what he is talking about. His ontology — his inventory of what exists — involves a small number of primitive concepts:

- **Inherence**: x *exists in* y (x is "in" y as a subject of predication)
- **Conception**: x is *conceived through* y (understanding x requires understanding y)
- **Attributes**: what constitutes the essence of a substance
- **Causation**: x brings y into being
- **Prevention**: x is a reason for y not existing

In Lean, we bundle all of these into a *typeclass* — a named collection of relations, parameterized over an abstract type of entities:

```lean
class SpinozaFramework (Entity : Type*) where
  InheresIn      : Entity → Entity → Prop
  ConceivedThrough : Entity → Entity → Prop
  HasAttribute   : Entity → Entity → Prop
  Causes         : Entity → Entity → Prop
  Prevents       : Entity → Entity → Prop
  God            : Entity
```

Read `Entity : Type*` as "some collection of things." We are not saying what those things are. We are saying that whatever they are, there must be five binary relations on them, and one distinguished element called `God`.

This is abstract on purpose. The goal is not to build a specific model of Spinoza's world — it is to show that his theorems follow from his axioms, for *any* model that satisfies the framework.

### Substances and Modes

Two of Spinoza's most important definitions can now be stated precisely.

**D3 — Substance**: A substance is what is *in itself* and *conceived through itself*. It does not depend on anything else, either for existing or for being understood.

```lean
def IsSubstance (x : Entity) : Prop :=
  InheresIn x x ∧ ConceivedThrough x x
```

Notice: `InheresIn x x` means x is in itself (not in something else). `ConceivedThrough x x` means x is understood through itself (not through something else). A substance is entirely self-contained — ontologically and epistemically.

**D5 — Mode**: A mode is the opposite. It exists *in* something else, and is *conceived through* something else. A wave is a mode of the ocean. A thought is (for Spinoza) a mode of the thinking substance.

```lean
def IsMode (x : Entity) : Prop :=
  ∃ s : Entity, IsSubstance s ∧
    InheresIn x s ∧
    ConceivedThrough x s ∧
    ¬IsSubstance x
```

A mode inheres in a substance, is conceived through that substance, and is *not itself* a substance. The four conditions together capture D5 precisely.

---

## Step 2: Spinoza's Axioms

Spinoza gives seven axioms in Part I. They are meant to be self-evident first principles. Here are the ones that do real work in the proofs:

**A1 — Exhaustion of Being**: Everything that exists is either in itself or in something else. There is no third option.

```lean
axiom A1 : ∀ x : Entity,
  InheresIn x x ∨ ∃ y : Entity, y ≠ x ∧ InheresIn x y
```

Either x is a substance (in itself) or it is a mode (in something other than itself).

**A2 — Conceivability**: What cannot be conceived through anything else must be conceived through itself.

```lean
axiom A2 : ∀ x : Entity,
  (¬∃ y : Entity, y ≠ x ∧ ConceivedThrough x y) → ConceivedThrough x x
```

If x has no external conceptual anchor, it must be self-anchored.

**A5 — No Common Causation Without Common Nature**: Things that share no attribute cannot cause each other.

```lean
axiom A5 : ∀ x y : Entity,
  (¬∃ a : Entity, HasAttribute x a ∧ HasAttribute y a) →
  ¬Causes x y ∧ ¬Causes y x
```

This is crucial. It says that causal interaction requires some shared nature. Two things with nothing in common — no overlapping attributes — are causally isolated from each other.

**PSR — Principle of Sufficient Reason**: For every entity, there is either a cause for its existence or a cause for its non-existence. Nothing simply "is" for no reason.

```lean
axiom PSR_symmetric : ∀ x : Entity,
  (∃ c : Entity, Causes c x) ∨ (∃ c : Entity, Prevents c x)
```

This is Spinoza's version of Leibniz's PSR. Nothing is brute fact.

### The Bridge Axioms

Here is something the formalization reveals that you cannot see from reading Spinoza's text alone: his seven official axioms are not enough.

To make the proofs go through, we need 14 additional axioms — things Spinoza assumes implicitly but never states. For example:

- **Attributes individuate substances**: Two distinct substances cannot share an attribute. *(Spinoza uses this in 1P5 without stating it as a premise.)*
- **Every substance has at least one attribute**: Without this, a substance might be a bare particular with no essence. *(Spinoza treats it as obvious.)*
- **What inheres in y is conceived through y**: The two notions of dependence — ontological and epistemic — go together. *(Used constantly, stated nowhere.)*

```lean
axiom attribute_individuates : ∀ (s₁ s₂ a : Entity),
  IsSubstance s₁ → IsSubstance s₂ →
  HasAttribute s₁ a → HasAttribute s₂ a → s₁ = s₂

axiom substance_has_attribute : ∀ (s : Entity),
  IsSubstance s → ∃ a : Entity, HasAttribute s a

axiom inherence_implies_conceived_through : ∀ (x y : Entity),
  InheresIn x y → ConceivedThrough x y
```

These are philosophically defensible. A careful Spinoza scholar would grant all of them. But they are *assumptions*, not proven from A1–A7. The formalization forces us to put them on the table.

This is one of formalization's great contributions to philosophy: it makes the implicit explicit.

---

## Step 3: The Key Definitions — Causa Sui, God, and Freedom

With the framework in place, we can state Spinoza's most important definitions.

**D1 — Causa Sui** (*cause of itself*): A thing whose essence involves existence. It cannot be conceived as not existing.

```lean
def IsCausaSui (x : Entity) : Prop :=
  Causes x x ∧ Necessarily (∃ y : Entity, y = x)
```

The first conjunct says x causes itself. The second says x necessarily exists — it cannot fail to be.

**D6 — God**: God is a substance with infinitely many attributes, each expressing eternal and infinite essence.

```lean
def IsGod (g : Entity) : Prop :=
  IsSubstance g ∧
  Set.Infinite {a : Entity | HasAttribute g a}
```

`Set.Infinite` is a Mathlib predicate meaning the set has no finite bound. God has not two or three attributes but infinitely many. In Spinoza's philosophy, we as humans can perceive only two of them: Thought and Extension (mind and body). But God expresses infinitely more, all unknown to us.

**D7 — Freedom**: A thing is free if it exists by the necessity of its own nature alone and is determined to act by itself alone.

```lean
def IsFree (x : Entity) : Prop :=
  IsCausaSui x ∧ ∀ y : Entity, Causes y x → y = x
```

Free does not mean uncaused. It means self-caused: every cause of x *is* x. This is a very different notion of freedom from the "could have done otherwise" of common sense. For Spinoza, freedom is self-determination, not indeterminism.

---

## Step 4: A Note on Necessity

Before the proofs, one design decision deserves careful attention.

Spinoza is a *necessitarian*. In 1P33 he argues: *"Things could not have been produced by God in any other way, or in any other order, than they have been produced."* There is exactly one possible world. The world that exists is the only world that could have existed.

This is a radical position. It means the modal operators — *necessarily* and *possibly* — collapse onto plain truth. If something is true, it was always necessarily true. If something is possible, it must actually exist.

We encode this directly:

```lean
def Necessarily (p : Prop) : Prop := p
def Possibly   (p : Prop) : Prop := p
```

Both `Necessarily p` and `Possibly p` simply mean `p`. This is the S5 modal logic axiom taken to its limit — the collapse of all modal distinctions into actual truth.

Is this philosophically correct? Spinoza scholars debate this. Some read him as claiming only *causal* necessity, not *logical* necessity. But for formalization purposes, it is the right choice: it faithfully encodes his necessitarianism, and its consequences are dramatic, as we will see.

---

## Step 5: The Proofs

Now we arrive at the actual theorems. We will walk through four of them in detail.

### Theorem 1: No Two Substances Share an Attribute (1P5)

> *"In the universe there cannot be two or more substances of the same nature or attribute."* — 1P5

**The informal argument**: Suppose two distinct substances s₁ and s₂ share an attribute a. Then they have something in common. But Spinoza will show (1P4) that what distinguishes things can only be attributes or modes. If s₁ and s₂ share all attributes and modes, they are the same thing — contradicting our assumption that they are distinct.

In the formalization, we use the bridge axiom `attribute_individuates` directly:

```lean
theorem no_shared_attribute
    (s₁ s₂ : Entity)
    (hs₁ : IsSubstance s₁) (hs₂ : IsSubstance s₂)
    (hshared : ∃ a : Entity, HasAttribute s₁ a ∧ HasAttribute s₂ a) :
    s₁ = s₂ := by
  obtain ⟨a, ha₁, ha₂⟩ := hshared
  exact attribute_individuates s₁ s₂ a hs₁ hs₂ ha₁ ha₂
```

Read the type signature as: "Given that s₁ and s₂ are substances and they share an attribute a, conclude that s₁ = s₂."

The proof is one line: unpack the shared attribute from `hshared`, then apply `attribute_individuates`. This bridge axiom does the real philosophical work.

### Theorem 2: Substance Cannot Be Produced by Another Substance (1P6)

> *"One substance cannot be produced by another substance."* — 1P6

**The informal argument**: Suppose substance s₁ causes substance s₂, and s₁ ≠ s₂. For s₁ to cause s₂, they must have something in common (A5). But two distinct substances sharing an attribute would violate 1P5. Contradiction.

```lean
theorem substance_not_produced_by_substance
    (s₁ s₂ : Entity)
    (hs₁ : IsSubstance s₁) (hs₂ : IsSubstance s₂) (hne : s₁ ≠ s₂) :
    ¬Causes s₁ s₂ := by
  intro hcause
  have hnocommon : ¬∃ a : Entity, HasAttribute s₁ a ∧ HasAttribute s₂ a := by
    intro ⟨a, ha₁, ha₂⟩
    exact hne (no_shared_attribute s₁ s₂ hs₁ hs₂ ⟨a, ha₁, ha₂⟩)
  exact (A5 s₁ s₂ hnocommon).1 hcause
```

The proof has two steps. First, show that s₁ and s₂ cannot share an attribute (because if they did, by 1P5 they would be the same substance, contradicting `hne`). Second, apply A5: things with no common attribute cannot cause each other. Therefore s₁ cannot cause s₂.

### Theorem 3: Every Substance is Causa Sui (1P6C)

> *"A substance can have no external cause of its existence; hence it is the cause of itself."* — 1P6C (Corollary)

This is the proof I find most beautiful in Part I. It uses the PSR — there must be *some* reason for a substance's existence or non-existence — and rules out every option except self-causation.

```lean
theorem substance_is_causa_sui
    (s : Entity) (hs : IsSubstance s) : IsCausaSui s := by
  constructor
  · -- First conjunct: Causes s s
    rcases PSR_symmetric s with ⟨c, hc⟩ | ⟨c, hc⟩
    · -- Case 1: some c causes s
      have hc_sub : IsSubstance c := substance_cause_is_substance s c hs hc
      by_cases heq : c = s
      · exact heq ▸ hc       -- c = s, so s causes s
      · exact absurd hc       -- c ≠ s: one substance causes another → contradiction (1P6)
            (substance_not_produced_by_substance c s hc_sub hs heq)
    · -- Case 2: some c prevents s
      by_cases heq : c = s
      · exact absurd ⟨c, heq, hc⟩ (no_internal_prevention s hs)   -- no self-prevention
      · exact absurd hc (substance_external_prevention_impossible s c hs heq) -- no external prevention
  · -- Second conjunct: Necessarily (∃ y, y = s)
    exact ⟨s, rfl⟩
```

Let us trace through the argument carefully.

The PSR gives us two cases. Either something causes s, or something prevents s.

**Case 1 — something causes s**: That something must be a substance (bridge axiom: causes of substances are substances). Is it s itself, or a different substance? If it is s itself, we are done — s causes s. If it is a different substance, we have one substance producing another, which 1P6 just proved impossible. Contradiction.

**Case 2 — something prevents s**: Is it s itself, or external? Self-prevention is ruled out by `no_internal_prevention`. External prevention is ruled out by `substance_external_prevention_impossible`. Contradiction.

Both cases of the PSR lead either to self-causation or contradiction. Therefore s causes itself.

The second conjunct — `Necessarily (∃ y, y = s)` — is immediate: s exists (we have it as a hypothesis of the whole theorem), and under S5-collapse, existence implies necessary existence. The witness is `s` itself (`⟨s, rfl⟩` is Lean for "the witness is s, and s = s is obvious").

### Theorem 4: God Necessarily Exists (1P11)

> *"God, or a substance consisting of infinite attributes, each of which expresses eternal and infinite essence, necessarily exists."* — 1P11

This is the most famous proposition in Part I — Spinoza's version of the ontological argument for God's existence. Here is the full proof in Lean:

```lean
theorem God_necessarily_exists :
    Necessarily (∃ g : Entity, IsGod g) :=
  God_is_possible
```

One line. The proof is: `God_is_possible`.

`God_is_possible` is the axiom `∃ g : Entity, IsGod g` — there exists an entity satisfying `IsGod`. And `Necessarily p` unfolds to `p`. So `God_necessarily_exists` is literally identical to `God_is_possible`.

How can the most famous ontological argument in modern philosophy reduce to a single axiom? Because of the S5-collapse.

Under Spinoza's necessitarianism, *possibility is actuality*. If God is possible — if the concept of God is consistent — then God exists. There is no gap between possible existence and actual existence, because there is only one possible world. You cannot say "God could exist but doesn't" in Spinoza's system; the very coherence of God's concept guarantees existence.

The one-line proof is not a cheat. It is a precise formal expression of what Spinoza's ontological argument is doing: the argument moves from the mere coherence of God's concept (God is possible) to God's actual existence (God necessarily exists), and under necessitarianism, that step is nothing — it is definitional.

What remains philosophically interesting is the axiom `God_is_possible` itself. Is the concept of God (substance with infinitely many attributes) actually coherent? Can we be sure that no hidden contradiction lurks in D6? Spinoza thinks so. The formalization makes the assumption explicit: we are told to grant it as an axiom, and everything follows.

### Theorem 5: Substance Monism (1P14)

> *"Except God, no substance can be, nor can be conceived."* — 1P14

If God necessarily exists and has infinitely many attributes, then there is no room for any other substance.

```lean
theorem substance_monism
    (s : Entity) (hs : IsSubstance s) : s = God := by
  have hGod_sub := (@isGod_axiom Entity _).1   -- God is a substance
  by_contra hne                                 -- suppose s ≠ God
  obtain ⟨a, ha⟩ := substance_has_attribute s hs  -- s has some attribute a
  have hca : ConceivedThrough a a :=
    hasAttribute_implies_conceived_through_self s a ha  -- a is self-conceived
  have hGa : HasAttribute (God : Entity) a :=
    god_has_attribute a hca   -- every self-conceived attribute belongs to God
  exact hne (no_shared_attribute s God hs hGod_sub ⟨a, ha, hGa⟩)
  -- s and God share attribute a → s = God → contradicts hne
```

The argument: every substance has at least one attribute. Every attribute that is self-conceived belongs to God (because God has infinitely many attributes, including all self-conceived ones). Two substances sharing an attribute are the same substance (1P5). Therefore any substance equals God.

There is only one substance. Everything else — every mind, every body, every thought, every stone — is a *mode* of that one substance. This is Spinoza's *monism*.

### Theorem 6: Nothing is Contingent (1P29)

> *"Nothing in the universe is contingent, but all things are conditioned to exist and operate in a particular way by the necessity of the divine nature."* — 1P29

For every entity, there is a cause of its existence:

```lean
theorem no_contingency (x : Entity) : ∃ c : Entity, Causes c x := by
  rcases A1 x with hself | ⟨y, hyne, hy⟩
  · -- x inheres in itself → x is a substance → x causes itself
    ...
    exact ⟨x, (substance_is_causa_sui x hx_sub).1⟩
  · -- x inheres in y (y ≠ x) → x is a mode → God causes x
    ...
    exact ⟨God, all_things_follow_from_God x hx_mode⟩
```

A1 partitions everything: either x is in itself (a substance) or in something else (a mode). Substances are causa sui — they cause themselves. Modes are caused by God (since all things are in God, and inherence implies causation). Either way, x has a cause. Nothing exists for no reason. Nothing could have failed to exist.

---

## Step 6: Putting It Together

After 1P14 and 1P29, the picture is complete:

- There is exactly **one substance**: God.
- Every other thing is a **mode** of God.
- Everything has a **cause**: substances cause themselves; modes are caused by God.
- Nothing is **contingent**: everything that exists had to exist, in exactly the way it does.

This is Spinoza's philosophical universe in its essentials. It is monistic (one substance), necessitarian (no contingency), and pantheistic (God = Nature = the totality of what is).

The formalization does not prove that Spinoza is *right*. What it proves is that his conclusions follow from his premises — that if you grant his definitions, his axioms, and the 14 bridge axioms the formalization made explicit, then substance monism and necessitarianism follow. The argument is valid. Whether the premises are true is a different question.

---

## What the Code Taught Us

Three things stand out from formalizing Part I:

**1. The structure is tighter than it looks.** The key theorems (1P5, 1P6, 1P7, 1P11, 1P14, 1P29) form a genuine deductive chain. Each relies on earlier results. The order Spinoza chose is not arbitrary — it is the order forced by the logical dependencies.

**2. The bridge axioms reveal implicit assumptions.** Spinoza's informal proofs rely on 14 things he never states as axioms. A professional philosopher reading the *Ethics* would grant them without hesitation. But formalization requires naming them. This is valuable: it shows exactly what the argument is *really* resting on, beyond what is officially claimed.

**3. The one-line proof of God's existence is the most philosophically interesting result.** Not because it is trivial, but because its triviality under S5-collapse is *precisely what Spinoza intended*. Under his necessitarianism, possibility and actuality coincide. The formal proof makes this crystal clear in a way that hundreds of pages of commentary cannot.

---

## A Final Note: What "Proof" Means Here

When Lean says a theorem is proved, it means: given the axioms and definitions you have stated, the conclusion follows by valid logical steps. No more, no less.

The axioms of `SpinozaFramework` are not Euclidean self-evidence. They are philosophical commitments. Granting A5 — that causation requires shared nature — is already to take a side in debates about causal powers and substance ontology. Granting `God_is_possible` — that the concept of infinite substance is coherent — is already the core disputed premise of the ontological argument.

Spinoza believed his axioms were self-evident. The formalization is neutral on that. What it offers instead is a clean separation between the *structure* of the argument (which is now machine-verified) and the *content* of the premises (which remains a matter of philosophical judgment).

That separation, by itself, is philosophically illuminating.

---

*Source: `output/spinoza/Spinoza/` — files `ModalLogic.lean`, `Domain.lean`, `Definitions.lean`, `Axioms.lean`, `Part1_Core.lean`, `Part1_God.lean`, `Part1_Necessity.lean`.*

*Build: `cd output/spinoza && lake build`. Lean 4.29.0-rc1 + Mathlib.*
