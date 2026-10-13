import { useEffect, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import {
  ArrowLeft, ArrowUpRight, BookOpen, Check, ChevronDown,
  ChevronRight, CircleHelp, Crown, Dices, Download, Heart, Moon, Plus,
  RotateCcw, Shield, Sparkles, Sun, Swords, Upload, Users, WandSparkles, X,
} from 'lucide-react';
import {
  abilityAbbr,
  abilityKeys,
  abilityLabels,
  legacyNotes,
  skillList,
  starters,
  type Ability,
  type Character,
  type Spell,
} from './data/character-sheets';
import {
  featuresUnlockedAtLevel,
  hasAbilityImprovement,
  spellChoicesAtLevel,
  spellSuggestions,
} from './data/level-progression';

const standardArray = [15, 14, 13, 12, 10, 8];
const pointCost: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
const mod = (n: number) => Math.floor((n - 10) / 2);
const signed = (n: number) => n >= 0 ? `+${n}` : `${n}`;
const profFor = (level: number) => Math.floor((level - 1) / 4) + 2;
const hpForLevel = (c: Character, level: number) => c.hitDie + mod(c.abilities.con) + Math.max(0, level - 1) * (Math.floor(c.hitDie / 2) + 1 + mod(c.abilities.con));
const resourceMaximum = (className: string, level: number, resource: 'kiPoints' | 'sorceryPoints') => {
  const expectedClass = resource === 'kiPoints' ? 'Monge' : 'Feiticeiro';
  return className === expectedClass && level >= 2 ? level : 0;
};
const slotsFor = (className: string, level: number): number[] => {
  if (className === 'Bruxo') {
    const pactSlotLevel = level >= 17 ? 5 : level >= 11 ? 5 : level >= 9 ? 5 : level >= 7 ? 4 : level >= 5 ? 3 : level >= 3 ? 2 : 1;
    const pactSlotCount = level >= 17 ? 4 : level >= 11 ? 3 : level >= 2 ? 2 : 1;
    return Array.from({ length: pactSlotLevel }, (_, index) => index + 1 === pactSlotLevel ? pactSlotCount : 0);
  }
  const full: Record<number, number[]> = {
    1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2],
    6: [4, 3, 3], 7: [4, 3, 3, 1], 8: [4, 3, 3, 2],
    9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2],
    11: [4, 3, 3, 3, 2, 1], 12: [4, 3, 3, 3, 2, 1],
    13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1],
    15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
  };
  return full[Math.max(1, Math.min(level, 20))] ?? [];
};
const classFeature: Record<string, string> = {
  Ladino: 'Aprimoramento de Atributo ou talento.',
  Feiticeiro: 'Aprimoramento de Atributo ou talento.',
  Clérigo: 'Aprimoramento de Atributo ou talento. Acesso a magias de 2º círculo.',
  Bruxo: 'Aprimoramento de Atributo ou talento. Acesso a invocações e magias de 2º círculo.',
  Monge: 'Aprimoramento de Atributo ou talento. Queda Lenta reduz dano de queda com sua reação.',
  Bardo: 'Aprimoramento de Atributo ou talento. Acesso a magias de 2º círculo.',
};
function loadCharacters(): Character[] {
  try {
    const current = localStorage.getItem('mesa-viva-characters-v2');
    if (current) {
      const parsed: unknown = JSON.parse(current);
      if (Array.isArray(parsed)) return parsed.map(value => normalizeCharacter(value));
    }
    const previous = localStorage.getItem('mesa-viva-characters-v1');
    if (!previous) return starters;
    const parsed: unknown = JSON.parse(previous);
    if (!Array.isArray(parsed)) return starters;
    const oldById = new Map(parsed.filter(value => value && typeof value.id === 'string').map(value => [value.id as string, value as Partial<Character>]));
    const migrated = starters.map(template => {
      const old = oldById.get(template.id);
      if (!old) return template;
      const damageTaken = Math.max(0, (old.maxHp ?? template.maxHp) - (old.hp ?? template.hp));
      const notes = old.notes && old.notes !== legacyNotes[template.id] ? old.notes : template.notes;
      return { ...template, hp: Math.max(0, Math.min(template.maxHp, template.maxHp - damageTaken)), notes };
    });
    const extra = parsed.filter(value => value?.id && !starters.some(template => template.id === value.id))
      .map(value => normalizeCharacter(value));
    return [...migrated, ...extra];
  } catch {
    return starters;
  }
}

function normalizeCharacter(value: unknown): Character {
  const raw = value && typeof value === 'object' ? value as Partial<Character> : {};
  const base = starters.find(character => character.id === raw.id) ?? starters[0];
  const slots = Array.isArray(raw.slots) ? raw.slots : base.slots;
  return {
    ...base,
    ...raw,
    abilities: { ...base.abilities, ...(raw.abilities ?? {}) },
    skills: Array.isArray(raw.skills) ? raw.skills : base.skills,
    savingThrows: Array.isArray(raw.savingThrows) ? raw.savingThrows : base.savingThrows,
    features: Array.isArray(raw.features) ? raw.features : base.features,
    resources: { ...base.resources, ...(raw.resources ?? {}) },
    slots,
    usedSlots: Array.isArray(raw.usedSlots) ? raw.usedSlots : slots.map(() => 0),
    spells: Array.isArray(raw.spells) ? raw.spells.map(spell => ({ ...spell, uses: Number.isFinite(spell.uses) ? spell.uses : 0 })) : base.spells,
    notes: typeof raw.notes === 'string' ? raw.notes : base.notes,
  };
}

function App() {
  const [characters, setCharacters] = useState<Character[]>(loadCharacters);
  const [dark, setDark] = useState(() => localStorage.getItem('mesa-viva-theme') === 'dark');
  const [toast, setToast] = useState('');
  const [, navigate] = useLocation();
  useEffect(() => { localStorage.setItem('mesa-viva-characters-v2', JSON.stringify(characters)); }, [characters]);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('mesa-viva-theme', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2600); return () => window.clearTimeout(timer); }, [toast]);
  const update = (id: string, next: (c: Character) => Character) => setCharacters(prev => prev.map(c => c.id === id ? next(c) : c));
  const createCharacter = () => {
    const id = `aventureiro-${Date.now().toString(36)}`;
    const c: Character = { ...starters[0], id, name: 'Novo aventureiro', className: 'Ladino', ancestry: 'Humano', subclass: '—', level: 1, abilities: { for: 15, des: 14, con: 13, int: 12, sab: 10, car: 8 }, maxHp: 9, hp: 9, skills: [], slots: [], notes: 'Uma nova história começa aqui.' };
    setCharacters(prev => [c, ...prev]); navigate(`/characters/${id}`); setToast('A ficha nova está pronta para ganhar forma.');
  };
  const exportData = () => {
    const blob = new Blob([JSON.stringify(characters, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'mesa-viva-personagens.json'; a.click(); URL.revokeObjectURL(a.href); setToast('Fichas exportadas em JSON.');
  };
  const importData = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { const value: unknown = JSON.parse(String(reader.result)); if (!Array.isArray(value) || !value.every(x => x && typeof x.id === 'string' && x.abilities)) throw new Error(); setCharacters(value.map(normalizeCharacter)); setToast('Fichas importadas com sucesso.'); } catch { setToast('Não foi possível ler este arquivo de fichas.'); } };
    reader.readAsText(file);
  };
  return <div className={`app-shell ${dark ? 'theme-dark' : ''}`}>
    <header className="topbar">
      <Link href="/" className="brand" data-testid="link-home"><span className="brand-mark"><Swords size={18} /></span><span>MESA <b>VIVA</b><small>DIÁRIO DE AVENTURA</small></span></Link>
      <div className="topbar-right"><span className="campaign-tag"><span className="pulse-dot" /> CAMPANHA ATIVA <b>O Véu de Sal</b></span>
        <button className="icon-button theme-toggle" onClick={() => setDark(v => !v)} aria-label="Alternar tema" data-testid="button-theme">{dark ? <Sun size={17} /> : <Moon size={17} />}<span>{dark ? 'Claro' : 'Escuro'}</span></button>
        <button className="avatar-button" onClick={() => setToast('Mesa Viva salva neste dispositivo.')} aria-label="Status da mesa">MV</button>
      </div>
    </header>
    <div className="workspace">
      <aside className="rail">
        <div className="rail-label">SUA MESA</div>
        <Link href="/" className="rail-link active" data-testid="link-party"><Users size={17} /><span>Personagens</span><span className="rail-count">{characters.length}</span></Link>
        <button className="rail-link" onClick={exportData} data-testid="button-export"><Download size={17} /><span>Exportar fichas</span></button>
        <label className="rail-link import-link"><Upload size={17} /><span>Importar fichas</span><input type="file" accept="application/json,.json" onChange={e => importData(e.target.files?.[0])} data-testid="input-import" /></label>
        <div className="rail-note"><div className="rail-note-mark"><BookOpen size={15} /></div><p>Uma boa sessão começa com a ficha à mão.</p><span>SEU CADERNO DE MESA</span></div>
        <div className="rail-footer">FEITO PARA JOGAR<br /><b>sem tirar os olhos da mesa.</b></div>
      </aside>
      <main className="main-content">
        <Switch>
          <Route path="/">{() => <Home characters={characters} onCreate={createCharacter} />}</Route>
          <Route path="/characters/:id">{params => <CharacterPage id={params.id ?? ''} characters={characters} update={update} notify={setToast} />}</Route>
          <Route><NotFound /></Route>
        </Switch>
      </main>
    </div>
    {toast && <div className="toast-message" role="status"><Check size={16} />{toast}</div>}
  </div>;
}

function Home({ characters, onCreate }: { characters: Character[]; onCreate: () => void }) {
  const alive = characters.reduce((n, c) => n + (c.hp > 0 ? 1 : 0), 0);
  return <div className="page page-home">
    <div className="page-kicker"><span>QUARTA-FEIRA, 18 DE JUNHO</span><span className="kicker-divider" /> <span>PRÓXIMA SESSÃO · HOJE ÀS 20H</span></div>
    <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line" /> A MESA ESTÁ POSTA</div><h1>Quem vai<br /><em>viver a história?</em></h1><p className="welcome-copy">Suas fichas, seus números, suas histórias. Tudo no alcance de um olhar — e de uma mão com dados.</p></div>
      <div className="session-stamp"><span>SESSÃO</span><strong>08</strong><small>O VÉU DE SAL</small><div className="stamp-stars">· &nbsp;· &nbsp;·</div></div>
    </section>
    <div className="overview-strip">
      <div className="overview-stat"><span>NA MESA</span><b>{String(characters.length).padStart(2, '0')}</b><small>aventureiros</small></div>
      <div className="overview-stat"><span>PRONTOS</span><b>{String(alive).padStart(2, '0')}</b><small>com pontos de vida</small></div>
      <div className="overview-stat"><span>NÍVEL DA CAMPANHA</span><b>03</b><small>e contando</small></div>
      <div className="overview-quote">“O destino não está escrito.<br /><i>Mas a ficha ajuda.</i>”</div>
    </div>
    <div className="section-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> SEU GRUPO</span><h2>Fichas de personagem</h2></div><button className="primary-button" onClick={onCreate} data-testid="button-new-character"><Plus size={17} /> Novo personagem</button></div>
    <div className="character-grid">
      {characters.map((c, i) => <CharacterCard key={c.id} character={c} index={i} />)}
      <button className="add-card" onClick={onCreate} data-testid="button-add-card"><span className="add-card-icon"><Plus size={22} /></span><b>Uma nova jornada?</b><small>Crie uma ficha para sua próxima aventura.</small><span className="add-card-action">CRIAR PERSONAGEM <ArrowUpRight size={14} /></span></button>
    </div>
    <footer className="home-footer"><span><Sparkles size={14} /> CADA PERSONAGEM É UM MUNDO.</span><span>MESA VIVA <b>·</b> SUA COMPANHEIRA DE MESA</span></footer>
  </div>;
}

function CharacterCard({ character: c, index }: { character: Character; index: number }) {
  const prof = profFor(c.level);
  const ac = c.armorBase
    + (c.armorDex ? Math.max(-1, c.armorDexCap === undefined ? mod(c.abilities.des) : Math.min(c.armorDexCap, mod(c.abilities.des))) : 0)
    + (c.armorWis ? mod(c.abilities.sab) : 0);
  return <Link href={`/characters/${c.id}`} className={`character-card accent-${c.color}`} style={{ animationDelay: `${index * 65}ms` }} data-testid={`card-character-${c.id}`}>
    <div className="card-topline"><span className="class-chip">{c.className.toUpperCase()}</span><span className="card-level">NÍV. {String(c.level).padStart(2, '0')}</span></div>
    <div className="character-monogram">{c.name.slice(0, 1).toUpperCase()}</div>
    <h3>{c.name}</h3><p className="character-line">{c.ancestry} <span>·</span> {c.subclass}</p>
    <div className="card-rule" />
    <div className="card-metrics"><div className="card-hp"><Heart size={14} /><span>PV</span><b>{c.hp}</b><small>/ {c.maxHp}</small><div className="hp-track"><i style={{ width: `${Math.max(0, Math.min(100, c.hp / c.maxHp * 100))}%` }} /></div></div><div className="card-ac"><Shield size={14} /><span>CA</span><b>{ac}</b></div><div className="card-prof"><span>PROF.</span><b>{signed(prof)}</b></div></div>
    <div className="card-bottom"><span>ABRIR FICHA</span><ArrowUpRight size={15} /></div>
  </Link>;
}

function CharacterPage({ id, characters, update, notify }: { id: string; characters: Character[]; update: (id: string, fn: (c: Character) => Character) => void; notify: (s: string) => void }) {
  const c = characters.find(x => x.id === id);
  const [mode, setMode] = useState('Manual');
  const [leveling, setLeveling] = useState(false);
  const [asiBonuses, setAsiBonuses] = useState<Record<Ability, number>>({ for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 });
  const [spellSelections, setSpellSelections] = useState<Record<number, string>>({});
  const [customSpellNames, setCustomSpellNames] = useState<Record<number, string>>({});
  const [customSpellLevels, setCustomSpellLevels] = useState<Record<number, number>>({});
  const [customSpellDescriptions, setCustomSpellDescriptions] = useState<Record<number, string>>({});
  const [showDetails, setShowDetails] = useState(false);
  const [hpInput, setHpInput] = useState('');
  const [expandedSpell, setExpandedSpell] = useState<string | null>(null);
  if (!c) return <NotFound />;
  const openLevelUp = () => {
    setAsiBonuses({ for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 });
    setSpellSelections({});
    setCustomSpellNames({});
    setCustomSpellLevels({});
    setCustomSpellDescriptions({});
    setLeveling(true);
  };
  const prof = profFor(c.level);
  const nextLevel = Math.min(20, c.level + 1);
  const needsAsi = hasAbilityImprovement(c.className, nextLevel);
  const asiPointsUsed = Object.values(asiBonuses).reduce((sum, value) => sum + value, 0);
  const previewAbilities = { ...c.abilities, ...Object.fromEntries(abilityKeys.map(key => [key, c.abilities[key] + asiBonuses[key]])) } as Record<Ability, number>;
  const previewCharacter = { ...c, abilities: previewAbilities };
  const nextMaxHp = hpForLevel(previewCharacter, nextLevel);
  const levelSpellChoices = spellChoicesAtLevel(c, nextLevel, previewAbilities.sab);
  const newLevelFeatures = featuresUnlockedAtLevel(c.className, c.subclass, nextLevel);
  const resolvedLevelSpells = levelSpellChoices.map((choice, index): Spell | null => {
    const selected = spellSelections[index];
    if (!selected) return null;
    if (selected === '__custom__') {
      const name = customSpellNames[index]?.trim();
      if (!name) return null;
      const level = choice.kind === 'cantrip' ? 0 : customSpellLevels[index] ?? Math.min(1, choice.maxLevel);
      return {
        name,
        level,
        description: customSpellDescriptions[index]?.trim() || 'Magia escolhida ao subir de nível. Consulte o texto completo na fonte da campanha.',
        uses: 0,
      };
    }
    return spellSuggestions(c, choice).find(spell => spell.name === selected) ?? null;
  });
  const spellChoicesComplete = resolvedLevelSpells.every((spell): spell is Spell => Boolean(spell))
    && new Set([...c.spells.map(spell => spell.name.toLocaleLowerCase('pt-BR')), ...resolvedLevelSpells.map(spell => spell!.name.toLocaleLowerCase('pt-BR'))]).size === c.spells.length + resolvedLevelSpells.length;
  const canConfirmLevelUp = c.level < 20 && (!needsAsi || asiPointsUsed === 2) && spellChoicesComplete;
  const initiative = mod(c.abilities.des);
  const ac = c.armorBase + (c.armorDex ? Math.max(-1, c.armorDexCap === undefined ? mod(c.abilities.des) : Math.min(c.armorDexCap, mod(c.abilities.des))) : 0) + (c.armorWis ? mod(c.abilities.sab) : 0);
  const pointsSpent = Object.values(c.abilities).reduce((sum, v) => sum + (pointCost[v] ?? 99), 0);
  const saveAbilities = (abilities: Record<Ability, number>) => update(c.id, old => {
    const maxHp = hpForLevel({ ...old, abilities }, old.level);
    const missing = old.maxHp - old.hp;
    return { ...old, abilities, maxHp, hp: Math.max(0, maxHp - missing) };
  });
  const changeAbility = (key: Ability, value: number) => {
    const abilities = { ...c.abilities, [key]: Math.max(mode === 'Point Buy' ? 8 : 3, Math.min(mode === 'Point Buy' ? 15 : 20, value)) };
    if (mode === 'Point Buy' && Object.values(abilities).reduce((sum, score) => sum + (pointCost[score] ?? 99), 0) > 27) return;
    saveAbilities(abilities);
  };
  const assignArray = () => { const sorted = [...abilityKeys].sort((a, b) => c.abilities[b] - c.abilities[a]); saveAbilities(Object.fromEntries(sorted.map((key, i) => [key, standardArray[i]])) as Record<Ability, number>); };
  const selectMode = (nextMode: string) => { setMode(nextMode); if (nextMode === 'Standard Array' || nextMode === 'Point Buy') assignArray(); if (nextMode === '4d6') rollAbilities(); };
  const rollAbilities = () => {
    const rolls = abilityKeys.map(() => { const dice = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => a - b); return dice.slice(1).reduce((a, b) => a + b, 0); });
    saveAbilities(Object.fromEntries(abilityKeys.map((key, i) => [key, rolls[i]])) as Record<Ability, number>); notify('Quatro dados, menor resultado descartado. Atributos rolados.');
  };
  const changeHp = (delta: number) => update(c.id, old => ({ ...old, hp: Math.max(0, Math.min(old.maxHp, old.hp + delta)) }));
  const applyHp = () => { const n = Number(hpInput); if (Number.isFinite(n)) update(c.id, old => ({ ...old, hp: Math.max(0, Math.min(old.maxHp, n)) })); setHpInput(''); };
  const changeSlotUse = (index: number, delta: number) => update(c.id, old => {
    const usedSlots = [...old.usedSlots];
    usedSlots[index] = Math.max(0, Math.min(old.slots[index] ?? 0, (usedSlots[index] ?? 0) + delta));
    return { ...old, usedSlots };
  });
  const castSpell = (target: Spell) => {
    if (target.level === 0) {
      update(c.id, old => ({ ...old, spells: old.spells.map(spell => spell.name === target.name ? { ...spell, uses: spell.uses + 1 } : spell) }));
      notify(`${target.name}: truque conjurado, sem gastar espaço.`);
      return;
    }
    const slotIndex = c.slots.findIndex((total, index) => index + 1 >= target.level && total > (c.usedSlots[index] ?? 0));
    if (slotIndex < 0) {
      notify(`Sem espaços disponíveis para conjurar ${target.name}.`);
      return;
    }
    update(c.id, old => ({
      ...old,
      usedSlots: old.slots.map((_, index) => index === slotIndex ? (old.usedSlots[index] ?? 0) + 1 : old.usedSlots[index] ?? 0),
      spells: old.spells.map(spell => spell.name === target.name ? { ...spell, uses: spell.uses + 1 } : spell),
    }));
    notify(`${target.name} conjurada com espaço de ${slotIndex + 1}º círculo.`);
  };
  const shortRest = () => {
    if (c.className !== 'Bruxo' && c.className !== 'Monge') return;
    update(c.id, old => ({
      ...old,
      usedSlots: old.className === 'Bruxo' ? old.slots.map(() => 0) : old.usedSlots,
      resources: { ...old.resources, kiPoints: resourceMaximum(old.className, old.level, 'kiPoints') },
    }));
    notify(c.className === 'Bruxo' ? 'Espaços de pacto recuperados no descanso curto.' : 'Pontos de Ki recuperados no descanso curto.');
  };
  const longRest = () => {
    update(c.id, old => ({
      ...old,
      hp: old.maxHp,
      usedSlots: old.slots.map(() => 0),
      spells: old.spells.map(spell => ({ ...spell, uses: 0 })),
      resources: {
        kiPoints: resourceMaximum(old.className, old.level, 'kiPoints'),
        sorceryPoints: resourceMaximum(old.className, old.level, 'sorceryPoints'),
      },
    }));
    notify('PV, espaços de magia e recursos recuperados; contadores de conjuração reiniciados.');
  };
  const changeResource = (resource: 'kiPoints' | 'sorceryPoints', delta: number) => update(c.id, old => ({
    ...old,
    resources: {
      ...old.resources,
      [resource]: Math.max(0, Math.min(resourceMaximum(old.className, old.level, resource), old.resources[resource] + delta)),
    },
  }));
  const adjustAsi = (ability: Ability, delta: number) => setAsiBonuses(current => {
    const used = Object.values(current).reduce((sum, value) => sum + value, 0);
    const nextValue = current[ability] + delta;
    if (nextValue < 0 || nextValue > 2) return current;
    if (delta > 0 && used >= 2) return current;
    if (c.abilities[ability] + nextValue > 20) return current;
    return { ...current, [ability]: nextValue };
  });
  const levelUp = () => {
    if (!canConfirmLevelUp) return;
    update(c.id, old => {
      const abilities = { ...old.abilities, ...Object.fromEntries(abilityKeys.map(key => [key, old.abilities[key] + asiBonuses[key]])) } as Record<Ability, number>;
      const nextCharacter = { ...old, abilities };
      const maxHp = hpForLevel(nextCharacter, nextLevel);
      const newFeatures = featuresUnlockedAtLevel(old.className, old.subclass, nextLevel)
        .filter(feature => !old.features.some(existing => existing.name === feature.name));
      const oldKiMax = resourceMaximum(old.className, old.level, 'kiPoints');
      const nextKiMax = resourceMaximum(old.className, nextLevel, 'kiPoints');
      const oldSorceryMax = resourceMaximum(old.className, old.level, 'sorceryPoints');
      const nextSorceryMax = resourceMaximum(old.className, nextLevel, 'sorceryPoints');
      const spells = [...old.spells, ...resolvedLevelSpells.filter((spell): spell is Spell => Boolean(spell))]
        .filter((spell, index, list) => list.findIndex(candidate => candidate.name.toLocaleLowerCase('pt-BR') === spell.name.toLocaleLowerCase('pt-BR')) === index);
      return {
        ...old,
        level: nextLevel,
        abilities,
        maxHp,
        hp: Math.min(maxHp, old.hp + Math.max(1, maxHp - old.maxHp)),
        slots: slotsFor(old.className, nextLevel),
        features: [...old.features, ...newFeatures],
        spells,
        resources: {
          kiPoints: old.resources.kiPoints >= oldKiMax && nextKiMax > oldKiMax ? nextKiMax : Math.min(nextKiMax, old.resources.kiPoints),
          sorceryPoints: old.resources.sorceryPoints >= oldSorceryMax && nextSorceryMax > oldSorceryMax ? nextSorceryMax : Math.min(nextSorceryMax, old.resources.sorceryPoints),
        },
      };
    });
    setLeveling(false); notify(`${c.name} avançou para o nível ${nextLevel}.`);
  };
  const toggleSkill = (name: string) => update(c.id, old => ({ ...old, skills: old.skills.includes(name) ? old.skills.filter(s => s !== name) : [...old.skills, name] }));
  return <div className="page page-character">
    <div className="detail-toolbar"><Link href="/" className="back-link" data-testid="link-back"><ArrowLeft size={15} /> Todas as fichas</Link><div className="autosave"><span className="save-dot" /> SALVO NESTE DISPOSITIVO</div></div>
    <div className="detail-hero">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> FICHA DE AVENTUREIRO <span className="hero-number">Nº {c.id.slice(0, 3).toUpperCase()}</span></div>
        <input className="character-name-input" value={c.name} onChange={e => update(c.id, old => ({ ...old, name: e.target.value }))} aria-label="Nome do personagem" data-testid="input-character-name" />
        <div className="hero-meta"><input value={c.ancestry} onChange={e => update(c.id, old => ({ ...old, ancestry: e.target.value }))} aria-label="Ancestralidade" data-testid="input-ancestry" /><span>·</span><input value={c.className} onChange={e => update(c.id, old => ({ ...old, className: e.target.value }))} aria-label="Classe" data-testid="input-class" /><span>·</span><input value={c.subclass} onChange={e => update(c.id, old => ({ ...old, subclass: e.target.value }))} aria-label="Subclasse" data-testid="input-subclass" /></div>
        <div className="sheet-origin">{c.background} · {c.alignment} · Jogador: {c.player} · Deslocamento: {c.speed}</div>
      </div>
      <div className="level-plaque"><span>NÍVEL</span><strong>{String(c.level).padStart(2, '0')}</strong><button onClick={openLevelUp} disabled={c.level >= 20} data-testid="button-level-up"><ArrowUpRight size={14} /> SUBIR DE NÍVEL</button></div>
    </div>
    <div className="quick-stats">
      <div className="quick-stat"><span>CLASSE DE ARMADURA</span><b><Shield size={18} /> {ac}</b><small>CA</small></div>
      <div className="quick-stat initiative-stat"><span>INICIATIVA</span><b><Dices size={17} /> {signed(initiative)}</b><small>DES</small></div>
      <div className="quick-stat proficiency-stat"><span>BÔNUS DE PROFICIÊNCIA</span><b>{signed(prof)}</b><small>NÍVEL {c.level}</small></div>
      <div className="quick-stat hp-stat"><span>PONTOS DE VIDA</span><div className="hp-controls"><button aria-label="Perder um ponto de vida" onClick={() => changeHp(-1)} data-testid="button-hp-minus">−</button><b>{c.hp}<small> / {c.maxHp}</small></b><button aria-label="Recuperar um ponto de vida" onClick={() => changeHp(1)} data-testid="button-hp-plus">+</button></div><div className="hp-progress"><i style={{ width: `${Math.max(0, c.hp / c.maxHp * 100)}%` }} /></div><div className="hp-manual"><input value={hpInput} onChange={e => setHpInput(e.target.value)} placeholder="PV atual" type="number" aria-label="Definir pontos de vida atuais" data-testid="input-hp" /><button onClick={applyHp} data-testid="button-set-hp">DEFINIR</button></div></div>
    </div>
    <div className="sheet-layout">
      <section className="sheet-panel attributes-panel">
        <div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> FUNDAMENTOS</span><h2>Atributos</h2></div><span className="panel-index">01 / 06</span></div>
        <div className="mode-row"><label htmlFor="mode-select">MÉTODO DE GERAÇÃO</label><div className="mode-select-wrap"><select id="mode-select" value={mode} onChange={e => selectMode(e.target.value)} data-testid="select-ability-mode"><option>Manual</option><option>Standard Array</option><option>Point Buy</option><option>4d6</option></select><ChevronDown size={14} /></div><span className="mode-help">{mode === 'Point Buy' ? `${pointsSpent} / 27 pontos` : mode === 'Standard Array' ? '15 · 14 · 13 · 12 · 10 · 8' : mode === '4d6' ? '4 dados, menor descartado' : 'Edite os valores livremente'}</span>{mode === '4d6' && <button className="reroll-button" onClick={rollAbilities} aria-label="Rolar atributos novamente"><Dices size={14} /></button>}</div>
        <div className="ability-grid">{abilityKeys.map(key => <div className="ability-card" key={key} data-testid={`stat-ability-${key}`}><span className="ability-name">{abilityAbbr[key]}</span><strong className="ability-mod">{signed(mod(c.abilities[key]))}</strong><div className="ability-score-wrap"><button onClick={() => changeAbility(key, c.abilities[key] - 1)} aria-label={`Diminuir ${abilityLabels[key]}`} data-testid={`button-${key}-minus`}>−</button><input type="number" min="3" max="20" value={c.abilities[key]} onChange={e => changeAbility(key, Number(e.target.value) || 3)} aria-label={abilityLabels[key]} data-testid={`input-${key}`} /><button onClick={() => changeAbility(key, c.abilities[key] + 1)} aria-label={`Aumentar ${abilityLabels[key]}`} data-testid={`button-${key}-plus`}>+</button></div><span className="ability-full">{abilityLabels[key]}</span></div>)}</div>
        {mode === 'Point Buy' && <div className={`point-buy-note ${pointsSpent > 27 ? 'over-budget' : ''}`}><span>{pointsSpent > 27 ? 'Acima do limite de 27 pontos' : `${27 - pointsSpent} pontos restantes`}</span><span>Custo padrão de compra</span></div>}
        <div className="save-throws"><span>TESTES DE RESISTÊNCIA</span>{abilityKeys.map(key => <div key={key} className={c.savingThrows.includes(key) ? 'save-proficient' : ''}><span>{abilityAbbr[key]}</span><b>{signed(mod(c.abilities[key]) + (c.savingThrows.includes(key) ? prof : 0))}</b></div>)}</div>
      </section>
      <section className="sheet-panel skills-panel">
        <div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> TREINO E TALENTO</span><h2>Perícias</h2></div><span className="panel-index">02 / 06</span></div>
        <p className="panel-intro">Marque as perícias em que {c.name} tem proficiência.</p>
        <div className="skills-list">{skillList.map(skill => { const proficient = c.skills.includes(skill.name); const bonus = mod(c.abilities[skill.ability]) + (proficient ? prof : 0); return <button key={skill.name} className={`skill-row ${proficient ? 'is-proficient' : ''}`} onClick={() => toggleSkill(skill.name)} data-testid={`skill-${skill.name.toLowerCase().replaceAll(' ', '-')}`}><span className="skill-check">{proficient && <Check size={12} />}</span><span className="skill-name">{skill.name}</span><span className="skill-ability">{abilityAbbr[skill.ability]}</span><b>{signed(bonus)}</b></button>; })}</div>
      </section>
      <section className="sheet-panel progression-panel">
        <div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> PRÓXIMO CAPÍTULO</span><h2>Progressão</h2></div><span className="panel-index">03 / 06</span></div>
        <div className="progression-current"><div><span>AGORA</span><b>Nível {c.level}</b></div><ChevronRight size={17} /><div className="next-level"><span>PRÓXIMO</span><b>Nível {nextLevel}</b></div><button onClick={openLevelUp} disabled={c.level >= 20} aria-label="Ver progressão" data-testid="button-progression"><ArrowUpRight size={16} /></button></div>
        <div className="unlock-card"><div className="unlock-symbol"><Crown size={19} /></div><div><span>DESTAQUE DO NÍVEL {nextLevel}</span><p>{needsAsi ? 'Aprimoramento de atributos disponível neste nível.' : newLevelFeatures.length ? newLevelFeatures.map(feature => feature.name).join(' · ') : c.level < 3 ? 'Seu caminho de classe começa a se revelar.' : classFeature[c.className] ?? 'Novas opções de classe e magias.'}</p></div></div>
        <button className="text-action" onClick={() => setShowDetails(v => !v)} data-testid="button-class-details"><CircleHelp size={14} /> {showDetails ? 'Ocultar detalhes' : 'Ver notas de progressão'} <ChevronDown size={14} className={showDetails ? 'rotated' : ''} /></button>
        {showDetails && <div className="progression-details">Ao subir, o bônus de proficiência muda nos níveis 5, 9, 13 e 17. Os pontos de vida máximos usam o valor médio do dado de vida mais o modificador de Constituição por nível. Consulte a mesa para escolhas de classe e magias.</div>}
      </section>
      <section className="sheet-panel passives-panel">
        <div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> RECURSOS E TRAÇOS DA FICHA</span><h2>Habilidades</h2></div><span className="panel-index">04 / 06</span></div>
        <div className="feature-list">{c.features.map((feature, index) => {
          const current = feature.resource ? c.resources[feature.resource] : undefined;
          const maximum = feature.resource ? resourceMaximum(c.className, c.level, feature.resource) : 0;
          const resourceName = feature.resource === 'kiPoints' ? 'Pontos de Ki' : 'Pontos de Feitiçaria';
          return <article className="feature-card" key={`${c.id}-feature-${index}`}>
            <div className="feature-card-heading"><span>{feature.category}</span>{feature.resource && <small>RECURSO CONTÁVEL</small>}</div>
            <h3>{feature.name}</h3>
            <p>{feature.description}</p>
            {feature.resource && current !== undefined && <div className="feature-resource">
              <div className="feature-resource-title"><span>{resourceName}</span><b>{current} <small>/ {maximum}</small></b></div>
              <div className="feature-resource-controls">
                <button onClick={() => changeResource(feature.resource!, -1)} disabled={current <= 0} aria-label={`Gastar 1 ponto de ${feature.resource === 'kiPoints' ? 'Ki' : 'Feitiçaria'}`} data-testid={`button-${feature.resource}-minus`}>−</button>
                <div className="resource-pips" aria-label={`${current} de ${maximum} ${resourceName.toLowerCase()} disponíveis`}>{Array.from({ length: maximum }, (_, point) => <i key={point} className={point < current ? 'is-ready' : ''} />)}</div>
                <button onClick={() => changeResource(feature.resource!, 1)} disabled={current >= maximum} aria-label={`Recuperar 1 ponto de ${feature.resource === 'kiPoints' ? 'Ki' : 'Feitiçaria'}`} data-testid={`button-${feature.resource}-plus`}>+</button>
              </div>
              {feature.resource === 'kiPoints' && <button className="feature-rest-action" onClick={shortRest} data-testid="button-ki-short-rest"><RotateCcw size={12} /> Recuperar no descanso curto</button>}
              {feature.resource === 'sorceryPoints' && <button className="feature-rest-action" onClick={longRest} data-testid="button-sorcery-long-rest"><RotateCcw size={12} /> Recuperar no descanso longo</button>}
            </div>}
          </article>;
        })}</div>
      </section>
      <section className="sheet-panel spells-panel">
        <div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> LIVRO DE CONJURAÇÕES</span><h2>Magias</h2></div><span className="panel-index">05 / 06</span></div>
        {c.spells.length ? <>
          {c.spellcastingAbility && <div className="spellcasting-stats"><div><span>HABILIDADE-CHAVE</span><b>{abilityLabels[c.spellcastingAbility]}</b></div><div><span>CD DO TESTE</span><b>{8 + prof + mod(c.abilities[c.spellcastingAbility])}</b></div><div><span>ATAQUE MÁGICO</span><b>{signed(prof + mod(c.abilities[c.spellcastingAbility]))}</b></div></div>}
          <div className="spell-slots">
            <div className="spell-slots-heading"><span>ESPAÇOS DE MAGIA</span><span>{c.className === 'Bruxo' ? 'MAGIA PACTUAL' : 'POR CÍRCULO'}</span></div>
            {c.slots.some(total => total > 0) ? <div className="slot-groups">{c.slots.map((total, index) => total > 0 && <div className="slot-group" key={index}><span>{index + 1}º CÍRCULO</span><div>{Array.from({ length: total }, (_, slot) => {
              const used = slot < (c.usedSlots[index] ?? 0);
              return <button key={slot} className={`slot-pip ${used ? 'is-used' : ''}`} aria-label={`${used ? 'Recuperar' : 'Gastar'} espaço de ${index + 1}º círculo`} aria-pressed={used} onClick={() => changeSlotUse(index, used ? -1 : 1)} />;
            })}</div><b>{Math.max(0, total - (c.usedSlots[index] ?? 0))} disponíveis / {total}</b></div>)}</div> : <div className="no-slots">Sem espaços de magia disponíveis.</div>}
            <div className="rest-actions">{(c.className === 'Bruxo' || c.className === 'Monge') && <button onClick={shortRest} data-testid="button-short-rest"><RotateCcw size={13} /> Descanso curto</button>}<button onClick={longRest} data-testid="button-long-rest"><RotateCcw size={13} /> Descanso longo</button></div>
            <p className="slots-source-note">Contagem inicial conforme os espaços marcados nos PDFs. Clique nos círculos para gastar ou recuperar um espaço.</p>
          </div>
          <div className="spell-list">
            {c.spells.map((spell, index) => <article className="spell-card" key={`${spell.name}-${index}`}>
              <div className="spell-card-top">
                <button className="spell-name-button" onClick={() => setExpandedSpell(expandedSpell === spell.name ? null : spell.name)} aria-expanded={expandedSpell === spell.name} data-testid={`button-spell-${index}`}>
                  <span><b>{spell.name}</b><small>{spell.level === 0 ? 'TRUQUE' : `${spell.level}º CÍRCULO`}</small></span><ChevronDown size={15} className={expandedSpell === spell.name ? 'rotated' : ''} />
                </button>
                <span className="spell-casts">{spell.uses} conjurações</span>
                <button className="cast-button" onClick={() => castSpell(spell)} data-testid={`button-cast-spell-${index}`}><Sparkles size={13} /> Conjurar</button>
              </div>
              {expandedSpell === spell.name && <p className="spell-description">{spell.description}</p>}
            </article>)}
          </div>
          <p className="spell-disclaimer">Descrições resumidas para consulta durante a sessão; confira o texto completo da magia na fonte da campanha.</p>
        </> : <div className="empty-spells"><BookOpen size={21} /><b>Esta ficha não tem magias.</b><span>Os truques e espaços serão exibidos aqui quando aplicáveis à classe.</span></div>}
      </section>
      <section className="sheet-panel notes-panel">
        <div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> ENTRE UMA ROLAGEM E OUTRA</span><h2>Notas de mesa</h2></div><span className="panel-index">06 / 06</span></div>
        <textarea value={c.notes} onChange={e => update(c.id, old => ({ ...old, notes: e.target.value }))} placeholder="Anote uma promessa, uma pista ou o nome de quem ficou devendo..." aria-label="Notas do personagem" data-testid="textarea-notes" />
        <div className="note-foot"><span><WandSparkles size={13} /> GUARDADO AUTOMATICAMENTE</span><span>{c.notes.length} caracteres</span></div>
      </section>
    </div>
    {leveling && <div className="modal-backdrop" role="presentation" onClick={() => setLeveling(false)}><div className="level-modal" role="dialog" aria-modal="true" aria-labelledby="level-title" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setLeveling(false)} aria-label="Fechar"><X size={18} /></button><div className="modal-sigil"><Crown size={21} /></div><span className="eyebrow"><span className="eyebrow-line" /> UM NOVO CAPÍTULO</span><h2 id="level-title">Subir para o nível {nextLevel}?</h2><p>Revise os ganhos e faça as escolhas desta progressão antes de atualizar a ficha.</p>
      <div className="level-change-list">
        <div><span>PONTOS DE VIDA MÁXIMOS</span><b>{c.maxHp} <ArrowUpRight size={13} /> {nextMaxHp}</b><small>O aumento considera o dado de vida e os ajustes de Constituição.</small></div>
        <div><span>BÔNUS DE PROFICIÊNCIA</span><b>{signed(prof)} <ArrowUpRight size={13} /> {signed(profFor(nextLevel))}</b><small>{profFor(nextLevel) > prof ? 'Seu bônus aumenta neste nível.' : 'Mantém o valor atual.'}</small></div>
        <div><span>DESTAQUE DA CLASSE</span><p>{classFeature[c.className] ?? 'Novas opções de classe, magias ou recursos podem ser liberados neste nível.'}</p></div>
        {c.slots.length > 0 && <div><span>ESPAÇOS DE MAGIA</span><p>{slotsFor(c.className, nextLevel).map((n, i) => `${i + 1}º círculo: ${n}`).join(' · ')}</p></div>}
      </div>

      {needsAsi && <section className="level-up-section asi-section">
        <div className="level-section-heading"><div><span>AVISO · NÍVEL {nextLevel}</span><h3>Aprimoramento de atributos</h3></div><b>{Math.max(0, 2 - asiPointsUsed)} <small>/ 2 pontos</small></b></div>
        <p>Neste nível você pode distribuir +2 pontos entre atributos. Cada atributo tem limite 20; divida em +1 e +1 ou coloque os dois no mesmo.</p>
        <div className="asi-choice-grid">{abilityKeys.map(ability => <div className="asi-choice" key={ability}>
          <span>{abilityLabels[ability]}</span><b>{c.abilities[ability]} <ArrowUpRight size={11} /> {previewAbilities[ability]}</b>
          <div><button onClick={() => adjustAsi(ability, -1)} disabled={asiBonuses[ability] <= 0} aria-label={`Remover ponto de ${abilityLabels[ability]}`}>−</button><small>+{asiBonuses[ability]}</small><button onClick={() => adjustAsi(ability, 1)} disabled={asiPointsUsed >= 2 || previewAbilities[ability] >= 20} aria-label={`Aumentar ${abilityLabels[ability]}`}>+</button></div>
        </div>)}</div>
        {asiPointsUsed < 2 && <small className="level-choice-hint">Distribua os 2 pontos para continuar.</small>}
      </section>}

      {levelSpellChoices.length > 0 && <section className="level-up-section spell-choice-section">
        <div className="level-section-heading"><div><span>NOVA ESCOLHA</span><h3>Escolha suas magias</h3></div><b>{levelSpellChoices.length} <small>{levelSpellChoices.length === 1 ? 'escolha' : 'escolhas'}</small></b></div>
        <p>Escolha entre as sugestões ou escreva outra magia válida para sua classe e nível. As magias selecionadas entram na ficha ao confirmar.</p>
        {levelSpellChoices.map((choice, index) => {
          const selected = spellSelections[index] ?? '';
          const blockedNames = new Set(Object.entries(spellSelections).filter(([key, name]) => Number(key) !== index && name && name !== '__custom__').map(([, name]) => name));
          const suggestions = spellSuggestions(c, choice).filter(spell => !blockedNames.has(spell.name));
          const customLevel = customSpellLevels[index] ?? (choice.kind === 'cantrip' ? 0 : Math.min(1, choice.maxLevel));
          return <div className="level-spell-choice" key={`${choice.kind}-${index}`}>
            <label htmlFor={`level-spell-${index}`}>{choice.kind === 'cantrip' ? 'Novo truque' : choice.kind === 'prepared' ? 'Nova magia preparada' : choice.kind === 'magical secret' ? 'Segredo Mágico · qualquer classe' : 'Nova magia conhecida'}{choice.kind !== 'cantrip' && <small> · até {choice.maxLevel}º círculo</small>}</label>
            <select id={`level-spell-${index}`} value={selected} onChange={event => setSpellSelections(current => ({ ...current, [index]: event.target.value }))}>
              <option value="">Selecione uma sugestão…</option>
              {suggestions.map(spell => <option key={spell.name} value={spell.name}>{spell.name} · {spell.level === 0 ? 'truque' : `${spell.level}º círculo`}</option>)}
              <option value="__custom__">Escrever outra magia…</option>
            </select>
            {selected === '__custom__' && <div className="custom-spell-fields">
              <input value={customSpellNames[index] ?? ''} onChange={event => setCustomSpellNames(current => ({ ...current, [index]: event.target.value }))} placeholder="Nome da magia" aria-label="Nome da magia escolhida" />
              {choice.kind !== 'cantrip' && <select value={customLevel} onChange={event => setCustomSpellLevels(current => ({ ...current, [index]: Number(event.target.value) }))} aria-label="Círculo da magia">
                {Array.from({ length: choice.maxLevel }, (_, circle) => circle + 1).map(circle => <option key={circle} value={circle}>{circle}º círculo</option>)}
              </select>}
              <input value={customSpellDescriptions[index] ?? ''} onChange={event => setCustomSpellDescriptions(current => ({ ...current, [index]: event.target.value }))} placeholder="Descrição curta (opcional)" aria-label="Descrição curta da magia" />
            </div>}
          </div>;
        })}
        {!spellChoicesComplete && <small className="level-choice-hint">Escolha uma magia diferente em cada campo para continuar.</small>}
      </section>}

      {newLevelFeatures.length > 0 && <section className="level-up-section feature-unlock-section">
        <div className="level-section-heading"><div><span>DESBLOQUEADAS NO NÍVEL {nextLevel}</span><h3>Novas habilidades</h3></div><b>{newLevelFeatures.length}</b></div>
        <div className="level-feature-list">{newLevelFeatures.map(feature => <article key={`${feature.category}-${feature.name}`}><span>{feature.category}</span><b>{feature.name}</b><p>{feature.description}</p></article>)}</div>
      </section>}

      <div className="modal-actions"><button className="secondary-button" onClick={() => setLeveling(false)}>Ainda não</button><button className="primary-button" onClick={levelUp} disabled={!canConfirmLevelUp} data-testid="button-confirm-level-up"><Sparkles size={15} /> Avançar nível</button></div>
      <small className="level-note">{needsAsi ? 'O aumento de atributo é oferecido nos níveis 4, 8, 12, 16 e 19; Ladinos também no 10.' : 'Os novos recursos, espaços e magias são registrados automaticamente na ficha.'}</small>
    </div></div>}
  </div>;
}

function NotFound() {
  return <div className="not-found"><span className="eyebrow"><span className="eyebrow-line" /> PÁGINA PERDIDA NO MAPA</span><h1>Nem toda trilha<br /><em>leva ao destino.</em></h1><p>Esta ficha não está nesta campanha.</p><Link href="/" className="primary-button"><ArrowLeft size={16} /> Voltar para a mesa</Link></div>;
}

export default App;
