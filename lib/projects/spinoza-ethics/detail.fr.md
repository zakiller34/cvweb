
*Plongee dans ce qui se passe lorsqu'on rend une preuve metaphysique du XVIIe siecle verifiable par machine.*

---

Spinoza ouvre l'*Ethique* par un coup audacieux. Avant de dire quoi que ce soit sur l'esprit, la morale ou la liberte humaine, il consacre la totalite de la premiere partie a prouver des choses sur Dieu et la substance — en utilisant le format des *Elements* d'Euclide. Definitions. Axiomes. Propositions. Preuves. CQFD.

Cet article porte sur la formalisation de cette premiere partie en Lean 4, un assistant de preuve moderne. Nous irons lentement. Chaque morceau de code sera explique a partir des principes fondamentaux. Aucune connaissance prealable de Lean n'est requise — seulement la volonte de reflechir soigneusement a ce que signifie *prouver* quelque chose.

---

## Qu'est-ce que Lean 4 ?

Lean 4 est un langage de programmation et un assistant de preuve. Lorsque vous ecrivez un theoreme en Lean, le compilateur verifie si votre preuve est valide. Pas approximativement valide. Pas plausible. *Logiquement hermetique*, etape par etape, a partir des principes fondamentaux.

L'experience ressemble a l'ecriture d'un programme qui ne compile que si votre argument est correct. Si vous sautez une etape, Lean refuse de compiler. Si vous faites une hypothese injustifiee, vous devez la nommer explicitement. Cette discipline est brutale — et revelatrice.

---

## Que cherche Spinoza dans la Partie I ?

La Partie I de l'*Ethique* s'intitule « De Dieu ». Son objectif est d'etablir, par un raisonnement rigoureux, que :

1. Dieu existe necessairement.
2. Dieu est la seule substance qui existe.
3. Tout le reste — esprits, corps, idees, emotions — est un *mode* de Dieu.
4. Rien n'est contingent. Tout ce qui arrive devait arriver.

Spinoza appelle cette methode *ordine geometrico demonstrata* — demontree selon l'ordre geometrique. Il la modele sur Euclide : partir de definitions et d'axiomes si clairs que personne ne pourrait les nier, puis en deriver des consequences qui peuvent etre surprenantes.

Que les axiomes soient reellement aussi incontestables que Spinoza le pense fait l'objet de siecles de debat philosophique. Mais la *structure* — definitions, axiomes, theoremes — est parfaite pour la formalisation.

---

## Etape 1 : Nommer les concepts primitifs

Avant de prouver quoi que ce soit, Spinoza doit dire de quoi il parle. Son ontologie — son inventaire de ce qui existe — fait intervenir un petit nombre de concepts primitifs :

- **Inherence** : x *existe dans* y (x est « dans » y comme sujet de predication)
- **Conception** : x est *concu par* y (comprendre x requiert de comprendre y)
- **Attributs** : ce qui constitue l'essence d'une substance
- **Causalite** : x fait exister y
- **Prevention** : x est une raison de la non-existence de y

En Lean, nous regroupons tout cela dans une *typeclass* — une collection nommee de relations, parametree sur un type abstrait d'entites :

```lean
class SpinozaFramework (Entity : Type*) where
  InheresIn      : Entity → Entity → Prop
  ConceivedThrough : Entity → Entity → Prop
  HasAttribute   : Entity → Entity → Prop
  Causes         : Entity → Entity → Prop
  Prevents       : Entity → Entity → Prop
  God            : Entity
```

Lisez `Entity : Type*` comme « une collection de choses ». Nous ne disons pas ce que sont ces choses. Nous disons que quelles qu'elles soient, il doit y avoir cinq relations binaires sur elles, et un element distingue appele `God`.

C'est abstrait a dessein. L'objectif n'est pas de construire un modele specifique du monde de Spinoza — c'est de montrer que ses theoremes decoulent de ses axiomes, pour *tout* modele satisfaisant le cadre.

### Substances et modes

Deux des definitions les plus importantes de Spinoza peuvent maintenant etre enoncees precisement.

**D3 — Substance** : Une substance est ce qui est *en soi* et *concu par soi*. Elle ne depend de rien d'autre, ni pour exister ni pour etre comprise.

```lean
def IsSubstance (x : Entity) : Prop :=
  InheresIn x x ∧ ConceivedThrough x x
```

Remarquez : `InheresIn x x` signifie que x est en soi-meme (pas dans autre chose). `ConceivedThrough x x` signifie que x est compris par soi-meme (pas par autre chose). Une substance est entierement autonome — ontologiquement et epistemiquement.

**D5 — Mode** : Un mode est le contraire. Il existe *dans* autre chose, et est *concu par* autre chose. Une vague est un mode de l'ocean. Une pensee est (pour Spinoza) un mode de la substance pensante.

```lean
def IsMode (x : Entity) : Prop :=
  ∃ s : Entity, IsSubstance s ∧
    InheresIn x s ∧
    ConceivedThrough x s ∧
    ¬IsSubstance x
```

Un mode inhere dans une substance, est concu par cette substance, et *n'est pas lui-meme* une substance. Les quatre conditions ensemble capturent D5 avec precision.

---

## Etape 2 : Les axiomes de Spinoza

Spinoza donne sept axiomes dans la Partie I. Ils sont censes etre des principes premiers evidents. Voici ceux qui font le vrai travail dans les preuves :

**A1 — Exhaustivite de l'etre** : Tout ce qui existe est soit en soi, soit dans autre chose. Il n'y a pas de troisieme option.

```lean
axiom A1 : ∀ x : Entity,
  InheresIn x x ∨ ∃ y : Entity, y ≠ x ∧ InheresIn x y
```

Soit x est une substance (en soi), soit c'est un mode (dans quelque chose d'autre que soi).

**A2 — Concevabilite** : Ce qui ne peut etre concu par rien d'autre doit etre concu par soi-meme.

```lean
axiom A2 : ∀ x : Entity,
  (¬∃ y : Entity, y ≠ x ∧ ConceivedThrough x y) → ConceivedThrough x x
```

Si x n'a aucun ancrage conceptuel externe, il doit etre auto-ancre.

**A5 — Pas de causalite commune sans nature commune** : Les choses qui ne partagent aucun attribut ne peuvent se causer mutuellement.

```lean
axiom A5 : ∀ x y : Entity,
  (¬∃ a : Entity, HasAttribute x a ∧ HasAttribute y a) →
  ¬Causes x y ∧ ¬Causes y x
```

C'est crucial. Cela dit que l'interaction causale requiert une nature partagee. Deux choses n'ayant rien en commun — aucun attribut commun — sont causalement isolees l'une de l'autre.

**PSR — Principe de raison suffisante** : Pour chaque entite, il y a soit une cause de son existence, soit une cause de sa non-existence. Rien n'est « simplement la » sans raison.

```lean
axiom PSR_symmetric : ∀ x : Entity,
  (∃ c : Entity, Causes c x) ∨ (∃ c : Entity, Prevents c x)
```

C'est la version spinoziste du PSR de Leibniz. Rien n'est un fait brut.

### Les axiomes-ponts

Voici quelque chose que la formalisation revele et qu'on ne peut pas voir en lisant simplement le texte de Spinoza : ses sept axiomes officiels ne suffisent pas.

Pour que les preuves fonctionnent, nous avons besoin de 14 axiomes supplementaires — des choses que Spinoza suppose implicitement mais n'enonce jamais. Par exemple :

- **Les attributs individuent les substances** : Deux substances distinctes ne peuvent partager un attribut. *(Spinoza l'utilise dans 1P5 sans l'enoncer comme premisse.)*
- **Chaque substance possede au moins un attribut** : Sans cela, une substance pourrait etre un particulier nu sans essence. *(Spinoza le considere comme evident.)*
- **Ce qui inhere dans y est concu par y** : Les deux notions de dependance — ontologique et epistemique — vont ensemble. *(Utilise constamment, enonce nulle part.)*

```lean
axiom attribute_individuates : ∀ (s₁ s₂ a : Entity),
  IsSubstance s₁ → IsSubstance s₂ →
  HasAttribute s₁ a → HasAttribute s₂ a → s₁ = s₂

axiom substance_has_attribute : ∀ (s : Entity),
  IsSubstance s → ∃ a : Entity, HasAttribute s a

axiom inherence_implies_conceived_through : ∀ (x y : Entity),
  InheresIn x y → ConceivedThrough x y
```

Ces axiomes sont philosophiquement defensables. Un specialiste attentif de Spinoza les accorderait tous. Mais ce sont des *hypotheses*, non prouvees a partir de A1–A7. La formalisation nous oblige a les mettre sur la table.

C'est l'une des grandes contributions de la formalisation a la philosophie : rendre l'implicite explicite.

---

## Etape 3 : Les definitions cles — Causa Sui, Dieu et liberte

Avec le cadre en place, nous pouvons enoncer les definitions les plus importantes de Spinoza.

**D1 — Causa Sui** (*cause de soi*) : Une chose dont l'essence enveloppe l'existence. Elle ne peut etre concue comme n'existant pas.

```lean
def IsCausaSui (x : Entity) : Prop :=
  Causes x x ∧ Necessarily (∃ y : Entity, y = x)
```

Le premier conjoint dit que x se cause lui-meme. Le second dit que x existe necessairement — il ne peut manquer d'etre.

**D6 — Dieu** : Dieu est une substance avec une infinite d'attributs, chacun exprimant une essence eternelle et infinie.

```lean
def IsGod (g : Entity) : Prop :=
  IsSubstance g ∧
  Set.Infinite {a : Entity | HasAttribute g a}
```

`Set.Infinite` est un predicat Mathlib signifiant que l'ensemble n'a pas de borne finie. Dieu n'a pas deux ou trois attributs mais une infinite. Dans la philosophie de Spinoza, nous les humains ne pouvons en percevoir que deux : la Pensee et l'Etendue (esprit et corps). Mais Dieu en exprime infiniment plus, tous inconnus de nous.

**D7 — Liberte** : Une chose est libre si elle existe par la seule necessite de sa propre nature et est determinee a agir par elle-meme seule.

```lean
def IsFree (x : Entity) : Prop :=
  IsCausaSui x ∧ ∀ y : Entity, Causes y x → y = x
```

Libre ne signifie pas sans cause. Cela signifie cause de soi : chaque cause de x *est* x. C'est une notion de liberte tres differente du « aurait pu faire autrement » du sens commun. Pour Spinoza, la liberte est l'autodetermination, non l'indeterminisme.

---

## Etape 4 : Une note sur la necessite

Avant les preuves, une decision de conception merite une attention particuliere.

Spinoza est un *necessitariste*. Dans 1P33 il soutient : *« Les choses n'ont pu etre produites par Dieu d'aucune autre maniere ni dans aucun autre ordre que celui dans lequel elles ont ete produites. »* Il n'existe qu'un seul monde possible. Le monde qui existe est le seul monde qui aurait pu exister.

C'est une position radicale. Cela signifie que les operateurs modaux — *necessairement* et *possiblement* — s'effondrent sur la verite simple. Si quelque chose est vrai, cela a toujours ete necessairement vrai. Si quelque chose est possible, cela doit effectivement exister.

Nous encodons cela directement :

```lean
def Necessarily (p : Prop) : Prop := p
def Possibly   (p : Prop) : Prop := p
```

`Necessarily p` et `Possibly p` signifient tous deux simplement `p`. C'est l'axiome de la logique modale S5 pousse a sa limite — l'effondrement de toutes les distinctions modales dans la verite actuelle.

Est-ce philosophiquement correct ? Les specialistes de Spinoza en debattent. Certains le lisent comme affirmant seulement une necessite *causale*, non une necessite *logique*. Mais pour les besoins de la formalisation, c'est le bon choix : cela encode fidelement son necessitarisme, et ses consequences sont spectaculaires, comme nous le verrons.

---

## Etape 5 : Les preuves

Nous arrivons maintenant aux theoremes proprement dits. Nous en detaillerons quatre.

### Theoreme 1 : Deux substances ne partagent pas d'attribut (1P5)

> *« Dans la nature, il ne peut exister deux ou plusieurs substances de meme nature ou attribut. »* — 1P5

**L'argument informel** : Supposons que deux substances distinctes s₁ et s₂ partagent un attribut a. Alors elles ont quelque chose en commun. Mais Spinoza montrera (1P4) que ce qui distingue les choses ne peut etre que des attributs ou des modes. Si s₁ et s₂ partagent tous les attributs et modes, elles sont la meme chose — contredisant notre hypothese qu'elles sont distinctes.

Dans la formalisation, nous utilisons l'axiome-pont `attribute_individuates` directement :

```lean
theorem no_shared_attribute
    (s₁ s₂ : Entity)
    (hs₁ : IsSubstance s₁) (hs₂ : IsSubstance s₂)
    (hshared : ∃ a : Entity, HasAttribute s₁ a ∧ HasAttribute s₂ a) :
    s₁ = s₂ := by
  obtain ⟨a, ha₁, ha₂⟩ := hshared
  exact attribute_individuates s₁ s₂ a hs₁ hs₂ ha₁ ha₂
```

Lisez la signature de type comme : « Etant donne que s₁ et s₂ sont des substances et qu'elles partagent un attribut a, conclure que s₁ = s₂. »

La preuve tient en une ligne : depaqueter l'attribut partage de `hshared`, puis appliquer `attribute_individuates`. Cet axiome-pont fait le vrai travail philosophique.

### Theoreme 2 : Une substance ne peut etre produite par une autre (1P6)

> *« Une substance ne peut etre produite par une autre substance. »* — 1P6

**L'argument informel** : Supposons que la substance s₁ cause la substance s₂, et que s₁ ≠ s₂. Pour que s₁ cause s₂, elles doivent avoir quelque chose en commun (A5). Mais deux substances distinctes partageant un attribut violeraient 1P5. Contradiction.

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

La preuve a deux etapes. D'abord, montrer que s₁ et s₂ ne peuvent partager d'attribut (car si elles le faisaient, par 1P5 elles seraient la meme substance, contredisant `hne`). Ensuite, appliquer A5 : les choses sans attribut commun ne peuvent se causer mutuellement. Donc s₁ ne peut causer s₂.

### Theoreme 3 : Toute substance est Causa Sui (1P6C)

> *« Une substance ne peut avoir de cause externe a son existence ; elle est donc cause de soi. »* — 1P6C (Corollaire)

C'est la preuve que je trouve la plus belle de la Partie I. Elle utilise le PSR — il doit y avoir *une* raison de l'existence ou de la non-existence d'une substance — et elimine toute option sauf l'auto-causalite.

```lean
theorem substance_is_causa_sui
    (s : Entity) (hs : IsSubstance s) : IsCausaSui s := by
  constructor
  · -- Premier conjoint : Causes s s
    rcases PSR_symmetric s with ⟨c, hc⟩ | ⟨c, hc⟩
    · -- Cas 1 : un c cause s
      have hc_sub : IsSubstance c := substance_cause_is_substance s c hs hc
      by_cases heq : c = s
      · exact heq ▸ hc       -- c = s, donc s se cause
      · exact absurd hc       -- c ≠ s : une substance en cause une autre → contradiction (1P6)
            (substance_not_produced_by_substance c s hc_sub hs heq)
    · -- Cas 2 : un c empeche s
      by_cases heq : c = s
      · exact absurd ⟨c, heq, hc⟩ (no_internal_prevention s hs)   -- pas d'auto-prevention
      · exact absurd hc (substance_external_prevention_impossible s c hs heq) -- pas de prevention externe
  · -- Second conjoint : Necessarily (∃ y, y = s)
    exact ⟨s, rfl⟩
```

Suivons l'argument attentivement.

Le PSR nous donne deux cas. Soit quelque chose cause s, soit quelque chose empeche s.

**Cas 1 — quelque chose cause s** : Ce quelque chose doit etre une substance (axiome-pont : les causes des substances sont des substances). Est-ce s lui-meme, ou une substance differente ? Si c'est s lui-meme, c'est termine — s se cause. Si c'est une substance differente, nous avons une substance qui en produit une autre, ce que 1P6 vient de prouver impossible. Contradiction.

**Cas 2 — quelque chose empeche s** : Est-ce s lui-meme, ou externe ? L'auto-prevention est exclue par `no_internal_prevention`. La prevention externe est exclue par `substance_external_prevention_impossible`. Contradiction.

Les deux cas du PSR menent soit a l'auto-causalite soit a une contradiction. Donc s se cause lui-meme.

Le second conjoint — `Necessarily (∃ y, y = s)` — est immediat : s existe (nous l'avons comme hypothese du theoreme entier), et sous l'effondrement S5, l'existence implique l'existence necessaire. Le temoin est `s` lui-meme (`⟨s, rfl⟩` signifie en Lean « le temoin est s, et s = s est evident »).

### Theoreme 4 : Dieu existe necessairement (1P11)

> *« Dieu, c'est-a-dire une substance consistant en une infinite d'attributs, dont chacun exprime une essence eternelle et infinie, existe necessairement. »* — 1P11

C'est la proposition la plus celebre de la Partie I — la version spinoziste de l'argument ontologique pour l'existence de Dieu. Voici la preuve complete en Lean :

```lean
theorem God_necessarily_exists :
    Necessarily (∃ g : Entity, IsGod g) :=
  God_is_possible
```

Une ligne. La preuve est : `God_is_possible`.

`God_is_possible` est l'axiome `∃ g : Entity, IsGod g` — il existe une entite satisfaisant `IsGod`. Et `Necessarily p` se deplie en `p`. Donc `God_necessarily_exists` est litteralement identique a `God_is_possible`.

Comment l'argument ontologique le plus celebre de la philosophie moderne peut-il se reduire a un seul axiome ? A cause de l'effondrement S5.

Sous le necessitarisme de Spinoza, *la possibilite est l'actualite*. Si Dieu est possible — si le concept de Dieu est coherent — alors Dieu existe. Il n'y a pas d'ecart entre l'existence possible et l'existence actuelle, car il n'y a qu'un seul monde possible. On ne peut pas dire « Dieu pourrait exister mais n'existe pas » dans le systeme de Spinoza ; la coherence meme du concept de Dieu garantit l'existence.

La preuve en une ligne n'est pas une triche. C'est une expression formelle precise de ce que fait l'argument ontologique de Spinoza : l'argument passe de la simple coherence du concept de Dieu (Dieu est possible) a l'existence actuelle de Dieu (Dieu existe necessairement), et sous le necessitarisme, cette etape n'est rien — elle est definitionnelle.

Ce qui reste philosophiquement interessant est l'axiome `God_is_possible` lui-meme. Le concept de Dieu (substance avec une infinite d'attributs) est-il reellement coherent ? Peut-on etre sur qu'aucune contradiction cachee ne se tapit dans D6 ? Spinoza le pense. La formalisation rend l'hypothese explicite : on nous demande de l'accorder comme axiome, et tout le reste suit.

### Theoreme 5 : Le monisme substantiel (1P14)

> *« Hormis Dieu, aucune substance ne peut etre ni etre concue. »* — 1P14

Si Dieu existe necessairement et possede une infinite d'attributs, alors il n'y a pas de place pour une autre substance.

```lean
theorem substance_monism
    (s : Entity) (hs : IsSubstance s) : s = God := by
  have hGod_sub := (@isGod_axiom Entity _).1   -- Dieu est une substance
  by_contra hne                                 -- supposons s ≠ Dieu
  obtain ⟨a, ha⟩ := substance_has_attribute s hs  -- s a un attribut a
  have hca : ConceivedThrough a a :=
    hasAttribute_implies_conceived_through_self s a ha  -- a est auto-concu
  have hGa : HasAttribute (God : Entity) a :=
    god_has_attribute a hca   -- tout attribut auto-concu appartient a Dieu
  exact hne (no_shared_attribute s God hs hGod_sub ⟨a, ha, hGa⟩)
  -- s et Dieu partagent l'attribut a → s = Dieu → contredit hne
```

L'argument : toute substance possede au moins un attribut. Tout attribut auto-concu appartient a Dieu (car Dieu possede une infinite d'attributs, incluant tous les auto-concus). Deux substances partageant un attribut sont la meme substance (1P5). Donc toute substance egale Dieu.

Il n'y a qu'une seule substance. Tout le reste — chaque esprit, chaque corps, chaque pensee, chaque pierre — est un *mode* de cette substance unique. C'est le *monisme* de Spinoza.

### Theoreme 6 : Rien n'est contingent (1P29)

> *« Rien dans la nature n'est contingent, mais toutes choses sont determinees a exister et a agir d'une maniere particuliere par la necessite de la nature divine. »* — 1P29

Pour chaque entite, il existe une cause de son existence :

```lean
theorem no_contingency (x : Entity) : ∃ c : Entity, Causes c x := by
  rcases A1 x with hself | ⟨y, hyne, hy⟩
  · -- x inhere en soi → x est une substance → x se cause
    ...
    exact ⟨x, (substance_is_causa_sui x hx_sub).1⟩
  · -- x inhere dans y (y ≠ x) → x est un mode → Dieu cause x
    ...
    exact ⟨God, all_things_follow_from_God x hx_mode⟩
```

A1 partitionne tout : soit x est en soi (une substance), soit dans autre chose (un mode). Les substances sont causa sui — elles se causent elles-memes. Les modes sont causes par Dieu (puisque toutes choses sont en Dieu, et l'inherence implique la causalite). Dans tous les cas, x a une cause. Rien n'existe sans raison. Rien n'aurait pu ne pas exister.

---

## Etape 6 : Vue d'ensemble

Apres 1P14 et 1P29, le tableau est complet :

- Il existe exactement **une substance** : Dieu.
- Toute autre chose est un **mode** de Dieu.
- Tout a une **cause** : les substances se causent elles-memes ; les modes sont causes par Dieu.
- Rien n'est **contingent** : tout ce qui existe devait exister, exactement de la maniere dont cela existe.

C'est l'univers philosophique de Spinoza dans ses traits essentiels. Il est moniste (une substance), necessitariste (pas de contingence) et pantheiste (Dieu = Nature = la totalite de ce qui est).

La formalisation ne prouve pas que Spinoza a *raison*. Ce qu'elle prouve, c'est que ses conclusions decoulent de ses premisses — que si l'on accorde ses definitions, ses axiomes et les 14 axiomes-ponts que la formalisation a rendus explicites, alors le monisme substantiel et le necessitarisme s'ensuivent. L'argument est valide. Que les premisses soient vraies est une autre question.

---

## Ce que le code nous a appris

Trois choses ressortent de la formalisation de la Partie I :

**1. La structure est plus rigoureuse qu'il n'y parait.** Les theoremes cles (1P5, 1P6, 1P7, 1P11, 1P14, 1P29) forment une veritable chaine deductive. Chacun repose sur les resultats anterieurs. L'ordre choisi par Spinoza n'est pas arbitraire — c'est l'ordre impose par les dependances logiques.

**2. Les axiomes-ponts revelent des hypotheses implicites.** Les preuves informelles de Spinoza reposent sur 14 choses qu'il n'enonce jamais comme axiomes. Un philosophe professionnel lisant l'*Ethique* les accorderait sans hesitation. Mais la formalisation exige de les nommer. C'est precieux : cela montre exactement sur quoi l'argument repose *reellement*, au-dela de ce qui est officiellement affirme.

**3. La preuve en une ligne de l'existence de Dieu est le resultat philosophiquement le plus interessant.** Non parce qu'il est trivial, mais parce que sa trivialite sous l'effondrement S5 est *precisement ce que Spinoza voulait*. Sous son necessitarisme, possibilite et actualite coincident. La preuve formelle rend cela limpide d'une maniere que des centaines de pages de commentaire ne peuvent pas.

---

## Note finale : Ce que « preuve » signifie ici

Quand Lean dit qu'un theoreme est prouve, cela signifie : etant donne les axiomes et definitions que vous avez enonces, la conclusion decoule par des etapes logiques valides. Ni plus, ni moins.

Les axiomes du `SpinozaFramework` ne sont pas de l'evidence euclidienne. Ce sont des engagements philosophiques. Accorder A5 — que la causalite requiert une nature partagee — c'est deja prendre parti dans les debats sur les pouvoirs causaux et l'ontologie des substances. Accorder `God_is_possible` — que le concept de substance infinie est coherent — c'est deja la premisse centrale disputee de l'argument ontologique.

Spinoza croyait que ses axiomes etaient evidents par eux-memes. La formalisation est neutre a ce sujet. Ce qu'elle offre a la place est une separation nette entre la *structure* de l'argument (qui est desormais verifiee par machine) et le *contenu* des premisses (qui reste une affaire de jugement philosophique).

Cette separation, en elle-meme, est philosophiquement eclairante.

---

*Source : `output/spinoza/Spinoza/` — fichiers `ModalLogic.lean`, `Domain.lean`, `Definitions.lean`, `Axioms.lean`, `Part1_Core.lean`, `Part1_God.lean`, `Part1_Necessity.lean`.*

*Compilation : `cd output/spinoza && lake build`. Lean 4.29.0-rc1 + Mathlib.*
