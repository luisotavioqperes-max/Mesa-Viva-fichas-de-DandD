import { useEffect, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import {
  ArrowLeft, ArrowUpRight, BookOpen, Check, ChevronDown,
  ChevronRight, CircleHelp, Crown, Dices, Download, Heart, Moon, Plus,
  Shield, Sparkles, Sun, Swords, Upload, Users, WandSparkles, X,
} from 'lucide-react';

type Ability = 'for' | 'des' | 'con' | 'int' | 'sab' | 'car';
type Character = {
  id: string; name: string; className: string; ancestry: string; subclass: string;
  level: number; abilities: Record<Ability, number>; hp: number; maxHp: number;
  hitDie: number; armorBase: number; armorDex: boolean; armorDexCap?: number; armorWis?: boolean; skills: string[];
  color: string; slots: number[]; notes: string;
};

const abilityKeys: Ability[] = ['for', 'des', 'con', 'int', 'sab', 'car'];
const abilityLabels: Record<Ability, string> = { for: 'Força', des: 'Destreza', con: 'Constituição', int: 'Inteligência', sab: 'Sabedoria', car: 'Carisma' };
const abilityAbbr: Record<Ability, string> = { for: 'FOR', des: 'DES', con: 'CON', int: 'INT', sab: 'SAB', car: 'CAR' };
const skillList: { name: string; ability: Ability }[] = [
  { name: 'Acrobacia', ability: 'des' }, { name: 'Adestrar Animais', ability: 'sab' },
  { name: 'Arcanismo', ability: 'int' }, { name: 'Atletismo', ability: 'for' },
  { name: 'Atuação', ability: 'car' }, { name: 'Enganação', ability: 'car' },
  { name: 'Furtividade', ability: 'des' }, { name: 'História', ability: 'int' },
  { name: 'Intimidação', ability: 'car' }, { name: 'Intuição', ability: 'sab' },
  { name: 'Investigação', ability: 'int' }, { name: 'Medicina', ability: 'sab' },
  { name: 'Natureza', ability: 'int' }, { name: 'Percepção', ability: 'sab' },
  { name: 'Persuasão', ability: 'car' }, { name: 'Prestidigitação', ability: 'des' },
  { name: 'Religião', ability: 'int' }, { name: 'Sobrevivência', ability: 'sab' },
];
const starters: Character[] = [
  { id: 'dart', name: 'Dart', className: 'Ladino', ancestry: 'Tabaxi', subclass: 'Alma Laminada', level: 3, abilities: { for: 10, des: 17, con: 14, int: 12, sab: 13, car: 10 }, hp: 24, maxHp: 24, hitDie: 8, armorBase: 11, armorDex: true, skills: ['Acrobacia', 'Enganação', 'Furtividade', 'Percepção', 'Prestidigitação', 'Investigação'], color: 'coral', slots: [], notes: 'Passos leves, lâmina pronta. O silêncio também é uma resposta.' },
  { id: 'borubas', name: 'Borubas', className: 'Feiticeiro', ancestry: 'Meio-elfo', subclass: 'Magia Selvagem', level: 3, abilities: { for: 8, des: 14, con: 14, int: 12, sab: 10, car: 17 }, hp: 20, maxHp: 20, hitDie: 6, armorBase: 10, armorDex: true, skills: ['Arcanismo', 'Enganação', 'Intuição', 'Persuasão'], color: 'lilac', slots: [4, 2], notes: 'A magia nem sempre pergunta antes de acontecer.' },
  { id: 'talia', name: 'Talia', className: 'Clérigo', ancestry: 'Alto-Elfo', subclass: 'Domínio do Crepúsculo', level: 3, abilities: { for: 10, des: 14, con: 14, int: 12, sab: 17, car: 10 }, hp: 24, maxHp: 24, hitDie: 8, armorBase: 16, armorDex: false, skills: ['História', 'Intuição', 'Medicina', 'Percepção'], color: 'gold', slots: [4, 2], notes: 'Guardiã da hora entre a última luz e a primeira estrela.' },
  { id: 'manu', name: 'Manu', className: 'Bruxo', ancestry: 'Aasimar Flagelo', subclass: 'Lâmina Maldita', level: 3, abilities: { for: 10, des: 14, con: 14, int: 10, sab: 12, car: 17 }, hp: 24, maxHp: 24, hitDie: 8, armorBase: 14, armorDex: false, skills: ['Arcanismo', 'Enganação', 'Intimidação', 'Religião'], color: 'jade', slots: [2], notes: 'Um pacto tem duas assinaturas. Nem sempre são feitas com tinta.' },
  { id: 'hofbauer', name: 'Hofbauer', className: 'Monge', ancestry: 'Halfling Robusto', subclass: 'Mestre Embriagado', level: 3, abilities: { for: 10, des: 17, con: 14, int: 10, sab: 15, car: 8 }, hp: 24, maxHp: 24, hitDie: 8, armorBase: 10, armorDex: true, armorWis: true, skills: ['Acrobacia', 'Atletismo', 'Furtividade', 'Intuição'], color: 'blue', slots: [], notes: 'O equilíbrio é uma questão de perspectiva — e de mais um gole.' },
  { id: 'vorath', name: 'Vorath nethral', className: 'Bardo', ancestry: 'Tiefling', subclass: 'Colégio da Criação', level: 3, abilities: { for: 8, des: 14, con: 14, int: 12, sab: 10, car: 17 }, hp: 20, maxHp: 20, hitDie: 8, armorBase: 12, armorDex: true, skills: ['Atuação', 'Enganação', 'História', 'Persuasão', 'Prestidigitação'], color: 'plum', slots: [4, 2], notes: 'Toda criação começa com uma nota que ainda não existe.' },
];
const standardArray = [15, 14, 13, 12, 10, 8];
const pointCost: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
const mod = (n: number) => Math.floor((n - 10) / 2);
const signed = (n: number) => n >= 0 ? `+${n}` : `${n}`;
const profFor = (level: number) => Math.floor((level - 1) / 4) + 2;
const hpForLevel = (c: Character, level: number) => c.hitDie + mod(c.abilities.con) + Math.max(0, level - 1) * (Math.floor(c.hitDie / 2) + 1 + mod(c.abilities.con));
const slotsFor = (className: string, level: number): number[] => {
  if (className === 'Bruxo') return level >= 3 ? [2] : [1];
  const full: Record<number, number[]> = { 1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1], 8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2] };
  return full[Math.min(level, 10)] ?? [4, 3, 3, 3, 2];
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
  try { const stored = localStorage.getItem('mesa-viva-characters-v1'); return stored ? JSON.parse(stored) as Character[] : starters; } catch { return starters; }
}

function App() {
  const [characters, setCharacters] = useState<Character[]>(loadCharacters);
  const [dark, setDark] = useState(() => localStorage.getItem('mesa-viva-theme') === 'dark');
  const [toast, setToast] = useState('');
  const [, navigate] = useLocation();
  useEffect(() => { localStorage.setItem('mesa-viva-characters-v1', JSON.stringify(characters)); }, [characters]);
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
    reader.onload = () => { try { const value = JSON.parse(String(reader.result)); if (!Array.isArray(value) || !value.every(x => x.id && x.abilities)) throw new Error(); setCharacters(value); setToast('Fichas importadas com sucesso.'); } catch { setToast('Não foi possível ler este arquivo de fichas.'); } };
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
  return <Link href={`/characters/${c.id}`} className={`character-card accent-${c.color}`} style={{ animationDelay: `${index * 65}ms` }} data-testid={`card-character-${c.id}`}>
    <div className="card-topline"><span className="class-chip">{c.className.toUpperCase()}</span><span className="card-level">NÍV. {String(c.level).padStart(2, '0')}</span></div>
    <div className="character-monogram">{c.name.slice(0, 1).toUpperCase()}</div>
    <h3>{c.name}</h3><p className="character-line">{c.ancestry} <span>·</span> {c.subclass}</p>
    <div className="card-rule" />
    <div className="card-metrics"><div className="card-hp"><Heart size={14} /><span>PV</span><b>{c.hp}</b><small>/ {c.maxHp}</small><div className="hp-track"><i style={{ width: `${Math.max(0, Math.min(100, c.hp / c.maxHp * 100))}%` }} /></div></div><div className="card-ac"><Shield size={14} /><span>CA</span><b>{c.armorBase + (c.armorDex ? Math.min(2, mod(c.abilities.des)) : 0)}</b></div><div className="card-prof"><span>PROF.</span><b>{signed(prof)}</b></div></div>
    <div className="card-bottom"><span>ABRIR FICHA</span><ArrowUpRight size={15} /></div>
  </Link>;
}

function CharacterPage({ id, characters, update, notify }: { id: string; characters: Character[]; update: (id: string, fn: (c: Character) => Character) => void; notify: (s: string) => void }) {
  const c = characters.find(x => x.id === id);
  const [mode, setMode] = useState('Manual');
  const [leveling, setLeveling] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [hpInput, setHpInput] = useState('');
  if (!c) return <NotFound />;
  const prof = profFor(c.level);
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
  const levelUp = () => {
    if (c.level >= 20) return;
    const nextLevel = c.level + 1;
    const nextHp = hpForLevel(c, nextLevel);
    update(c.id, old => ({ ...old, level: nextLevel, maxHp: nextHp, hp: Math.min(nextHp, old.hp + Math.max(1, Math.floor(old.hitDie / 2) + 1 + mod(old.abilities.con))), slots: slotsFor(old.className, nextLevel) }));
    setLeveling(false); notify(`${c.name} avançou para o nível ${nextLevel}.`);
  };
  const toggleSkill = (name: string) => update(c.id, old => ({ ...old, skills: old.skills.includes(name) ? old.skills.filter(s => s !== name) : [...old.skills, name] }));
  return <div className="page page-character">
    <div className="detail-toolbar"><Link href="/" className="back-link" data-testid="link-back"><ArrowLeft size={15} /> Todas as fichas</Link><div className="autosave"><span className="save-dot" /> SALVO NESTE DISPOSITIVO</div></div>
    <div className="detail-hero">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> FICHA DE AVENTUREIRO <span className="hero-number">Nº {c.id.slice(0, 3).toUpperCase()}</span></div>
        <input className="character-name-input" value={c.name} onChange={e => update(c.id, old => ({ ...old, name: e.target.value }))} aria-label="Nome do personagem" data-testid="input-character-name" />
        <div className="hero-meta"><input value={c.ancestry} onChange={e => update(c.id, old => ({ ...old, ancestry: e.target.value }))} aria-label="Ancestralidade" data-testid="input-ancestry" /><span>·</span><input value={c.className} onChange={e => update(c.id, old => ({ ...old, className: e.target.value }))} aria-label="Classe" data-testid="input-class" /><span>·</span><input value={c.subclass} onChange={e => update(c.id, old => ({ ...old, subclass: e.target.value }))} aria-label="Subclasse" data-testid="input-subclass" /></div>
      </div>
      <div className="level-plaque"><span>NÍVEL</span><strong>{String(c.level).padStart(2, '0')}</strong><button onClick={() => setLeveling(true)} disabled={c.level >= 20} data-testid="button-level-up"><ArrowUpRight size={14} /> SUBIR DE NÍVEL</button></div>
    </div>
    <div className="quick-stats">
      <div className="quick-stat"><span>CLASSE DE ARMADURA</span><b><Shield size={18} /> {ac}</b><small>CA</small></div>
      <div className="quick-stat initiative-stat"><span>INICIATIVA</span><b><Dices size={17} /> {signed(initiative)}</b><small>DES</small></div>
      <div className="quick-stat proficiency-stat"><span>BÔNUS DE PROFICIÊNCIA</span><b>{signed(prof)}</b><small>NÍVEL {c.level}</small></div>
      <div className="quick-stat hp-stat"><span>PONTOS DE VIDA</span><div className="hp-controls"><button aria-label="Perder um ponto de vida" onClick={() => changeHp(-1)} data-testid="button-hp-minus">−</button><b>{c.hp}<small> / {c.maxHp}</small></b><button aria-label="Recuperar um ponto de vida" onClick={() => changeHp(1)} data-testid="button-hp-plus">+</button></div><div className="hp-progress"><i style={{ width: `${Math.max(0, c.hp / c.maxHp * 100)}%` }} /></div><div className="hp-manual"><input value={hpInput} onChange={e => setHpInput(e.target.value)} placeholder="PV atual" type="number" aria-label="Definir pontos de vida atuais" data-testid="input-hp" /><button onClick={applyHp} data-testid="button-set-hp">DEFINIR</button></div></div>
    </div>
    <div className="sheet-layout">
      <section className="sheet-panel attributes-panel">
        <div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> FUNDAMENTOS</span><h2>Atributos</h2></div><span className="panel-index">01 / 04</span></div>
        <div className="mode-row"><label htmlFor="mode-select">MÉTODO DE GERAÇÃO</label><div className="mode-select-wrap"><select id="mode-select" value={mode} onChange={e => selectMode(e.target.value)} data-testid="select-ability-mode"><option>Manual</option><option>Standard Array</option><option>Point Buy</option><option>4d6</option></select><ChevronDown size={14} /></div><span className="mode-help">{mode === 'Point Buy' ? `${pointsSpent} / 27 pontos` : mode === 'Standard Array' ? '15 · 14 · 13 · 12 · 10 · 8' : mode === '4d6' ? '4 dados, menor descartado' : 'Edite os valores livremente'}</span>{mode === '4d6' && <button className="reroll-button" onClick={rollAbilities} aria-label="Rolar atributos novamente"><Dices size={14} /></button>}</div>
        <div className="ability-grid">{abilityKeys.map(key => <div className="ability-card" key={key} data-testid={`stat-ability-${key}`}><span className="ability-name">{abilityAbbr[key]}</span><strong className="ability-mod">{signed(mod(c.abilities[key]))}</strong><div className="ability-score-wrap"><button onClick={() => changeAbility(key, c.abilities[key] - 1)} aria-label={`Diminuir ${abilityLabels[key]}`} data-testid={`button-${key}-minus`}>−</button><input type="number" min="3" max="20" value={c.abilities[key]} onChange={e => changeAbility(key, Number(e.target.value) || 3)} aria-label={abilityLabels[key]} data-testid={`input-${key}`} /><button onClick={() => changeAbility(key, c.abilities[key] + 1)} aria-label={`Aumentar ${abilityLabels[key]}`} data-testid={`button-${key}-plus`}>+</button></div><span className="ability-full">{abilityLabels[key]}</span></div>)}</div>
        {mode === 'Point Buy' && <div className={`point-buy-note ${pointsSpent > 27 ? 'over-budget' : ''}`}><span>{pointsSpent > 27 ? 'Acima do limite de 27 pontos' : `${27 - pointsSpent} pontos restantes`}</span><span>Custo padrão de compra</span></div>}
      </section>
      <section className="sheet-panel skills-panel">
        <div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> TREINO E TALENTO</span><h2>Perícias</h2></div><span className="panel-index">02 / 04</span></div>
        <p className="panel-intro">Marque as perícias em que {c.name} tem proficiência.</p>
        <div className="skills-list">{skillList.map(skill => { const proficient = c.skills.includes(skill.name); const bonus = mod(c.abilities[skill.ability]) + (proficient ? prof : 0); return <button key={skill.name} className={`skill-row ${proficient ? 'is-proficient' : ''}`} onClick={() => toggleSkill(skill.name)} data-testid={`skill-${skill.name.toLowerCase().replaceAll(' ', '-')}`}><span className="skill-check">{proficient && <Check size={12} />}</span><span className="skill-name">{skill.name}</span><span className="skill-ability">{abilityAbbr[skill.ability]}</span><b>{signed(bonus)}</b></button>; })}</div>
      </section>
      <section className="sheet-panel progression-panel">
        <div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> PRÓXIMO CAPÍTULO</span><h2>Progressão</h2></div><span className="panel-index">03 / 04</span></div>
        <div className="progression-current"><div><span>AGORA</span><b>Nível {c.level}</b></div><ChevronRight size={17} /><div className="next-level"><span>PRÓXIMO</span><b>Nível {Math.min(20, c.level + 1)}</b></div><button onClick={() => setLeveling(true)} disabled={c.level >= 20} aria-label="Ver progressão" data-testid="button-progression"><ArrowUpRight size={16} /></button></div>
        <div className="unlock-card"><div className="unlock-symbol"><Crown size={19} /></div><div><span>DESTAQUE DO NÍVEL {Math.min(20, c.level + 1)}</span><p>{c.level < 3 ? 'Seu caminho de classe começa a se revelar.' : c.level === 3 ? classFeature[c.className] ?? 'Novas opções de classe e aprimoramentos.' : c.level === 4 ? 'Aprimoramento de Atributo ou talento.' : 'Novas capacidades de classe e maior proficiência.'}</p></div></div>
        <div className="slot-area"><div className="slot-heading"><span>ESPAÇOS DE MAGIA</span><span className="subtle">{c.className === 'Bruxo' ? 'pacto' : 'por círculo'}</span></div>{c.slots.length ? <div className="slot-groups">{c.slots.map((slot, i) => <div className="slot-group" key={i}><span>{i + 1}º CÍRCULO</span><div>{Array.from({ length: slot }, (_, j) => <i key={j} className="slot-pip" />)}</div><b>{slot}</b></div>)}</div> : <div className="no-slots">Nenhum espaço de magia nesta ficha.</div>}</div>
        <button className="text-action" onClick={() => setShowDetails(v => !v)} data-testid="button-class-details"><CircleHelp size={14} /> {showDetails ? 'Ocultar detalhes' : 'Ver notas de progressão'} <ChevronDown size={14} className={showDetails ? 'rotated' : ''} /></button>
        {showDetails && <div className="progression-details">Ao subir, o bônus de proficiência muda nos níveis 5, 9, 13 e 17. Os pontos de vida máximos usam o valor médio do dado de vida mais o modificador de Constituição por nível. Consulte a mesa para escolhas de classe e magias.</div>}
      </section>
      <section className="sheet-panel notes-panel">
        <div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> ENTRE UMA ROLAGEM E OUTRA</span><h2>Notas de mesa</h2></div><span className="panel-index">04 / 04</span></div>
        <textarea value={c.notes} onChange={e => update(c.id, old => ({ ...old, notes: e.target.value }))} placeholder="Anote uma promessa, uma pista ou o nome de quem ficou devendo..." aria-label="Notas do personagem" data-testid="textarea-notes" />
        <div className="note-foot"><span><WandSparkles size={13} /> GUARDADO AUTOMATICAMENTE</span><span>{c.notes.length} caracteres</span></div>
      </section>
    </div>
    {leveling && <div className="modal-backdrop" role="presentation" onClick={() => setLeveling(false)}><div className="level-modal" role="dialog" aria-modal="true" aria-labelledby="level-title" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setLeveling(false)} aria-label="Fechar"><X size={18} /></button><div className="modal-sigil"><Crown size={21} /></div><span className="eyebrow"><span className="eyebrow-line" /> UM NOVO CAPÍTULO</span><h2 id="level-title">Subir para o nível {c.level + 1}?</h2><p>Uma escolha de cada vez. A ficha atualiza os valores derivados para você.</p>
      <div className="level-change-list"><div><span>PONTOS DE VIDA MÁXIMOS</span><b>{c.maxHp} <ArrowUpRight size={13} /> {hpForLevel(c, c.level + 1)}</b><small>+{Math.max(1, Math.floor(c.hitDie / 2) + 1 + mod(c.abilities.con))} PV pelo valor médio do dado de vida</small></div><div><span>BÔNUS DE PROFICIÊNCIA</span><b>{signed(prof)} <ArrowUpRight size={13} /> {signed(profFor(c.level + 1))}</b><small>{profFor(c.level + 1) > prof ? 'Seu bônus aumenta neste nível.' : 'Mantém o valor atual.'}</small></div><div><span>DESTAQUE DA CLASSE</span><p>{classFeature[c.className] ?? 'Consulte as opções de classe disponíveis para este nível.'}</p></div>{c.slots.length > 0 && <div><span>ESPAÇOS DE MAGIA</span><p>{slotsFor(c.className, c.level + 1).map((n, i) => `${i + 1}º círculo: ${n}`).join(' · ')}</p></div>}</div>
      <div className="modal-actions"><button className="secondary-button" onClick={() => setLeveling(false)}>Ainda não</button><button className="primary-button" onClick={levelUp} data-testid="button-confirm-level-up"><Sparkles size={15} /> Avançar nível</button></div><small className="level-note">Aumentos de atributo, magias e escolhas de classe são decididos à mesa.</small>
    </div></div>}
  </div>;
}

function NotFound() {
  return <div className="not-found"><span className="eyebrow"><span className="eyebrow-line" /> PÁGINA PERDIDA NO MAPA</span><h1>Nem toda trilha<br /><em>leva ao destino.</em></h1><p>Esta ficha não está nesta campanha.</p><Link href="/" className="primary-button"><ArrowLeft size={16} /> Voltar para a mesa</Link></div>;
}

export default App;
