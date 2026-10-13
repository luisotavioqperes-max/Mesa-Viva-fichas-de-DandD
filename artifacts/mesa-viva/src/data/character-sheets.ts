export type Ability = 'for' | 'des' | 'con' | 'int' | 'sab' | 'car';

export type Spell = {
  name: string;
  level: number;
  description: string;
  uses: number;
};

export type Character = {
  id: string;
  name: string;
  className: string;
  ancestry: string;
  subclass: string;
  background: string;
  alignment: string;
  player: string;
  speed: string;
  level: number;
  abilities: Record<Ability, number>;
  hp: number;
  maxHp: number;
  hitDie: number;
  armorBase: number;
  armorDex: boolean;
  armorDexCap?: number;
  armorWis?: boolean;
  skills: string[];
  savingThrows: Ability[];
  passives: string[];
  color: string;
  slots: number[];
  usedSlots: number[];
  spells: Spell[];
  spellcastingAbility?: Ability;
  notes: string;
};

const spell = (name: string, level: number, description: string): Spell => ({
  name,
  level,
  description,
  uses: 0,
});

export const abilityKeys: Ability[] = ['for', 'des', 'con', 'int', 'sab', 'car'];

export const abilityLabels: Record<Ability, string> = {
  for: 'Força',
  des: 'Destreza',
  con: 'Constituição',
  int: 'Inteligência',
  sab: 'Sabedoria',
  car: 'Carisma',
};

export const abilityAbbr: Record<Ability, string> = {
  for: 'FOR',
  des: 'DES',
  con: 'CON',
  int: 'INT',
  sab: 'SAB',
  car: 'CAR',
};

export const skillList: { name: string; ability: Ability }[] = [
  { name: 'Acrobacia', ability: 'des' },
  { name: 'Adestrar Animais', ability: 'sab' },
  { name: 'Arcanismo', ability: 'int' },
  { name: 'Atletismo', ability: 'for' },
  { name: 'Atuação', ability: 'car' },
  { name: 'Enganação', ability: 'car' },
  { name: 'Furtividade', ability: 'des' },
  { name: 'História', ability: 'int' },
  { name: 'Intimidação', ability: 'car' },
  { name: 'Intuição', ability: 'sab' },
  { name: 'Investigação', ability: 'int' },
  { name: 'Medicina', ability: 'sab' },
  { name: 'Natureza', ability: 'int' },
  { name: 'Percepção', ability: 'sab' },
  { name: 'Persuasão', ability: 'car' },
  { name: 'Prestidigitação', ability: 'des' },
  { name: 'Religião', ability: 'int' },
  { name: 'Sobrevivência', ability: 'sab' },
];

export const starters: Character[] = [
  {
    id: 'dart',
    name: 'dart',
    className: 'Ladino',
    ancestry: 'Tabaxi',
    subclass: 'Alma Laminada',
    background: 'Órfão',
    alignment: 'Leal e Neutro',
    player: 'lian',
    speed: '9 m',
    level: 3,
    abilities: { for: 14, des: 17, con: 12, int: 8, sab: 10, car: 14 },
    hp: 21,
    maxHp: 21,
    hitDie: 8,
    armorBase: 10,
    armorDex: true,
    skills: [
      'Acrobacia',
      'Atletismo',
      'Atuação',
      'Furtividade',
      'Intimidação',
      'Prestidigitação',
    ],
    savingThrows: ['des', 'int'],
    passives: [
      'Ladino: Perícia, Ataque Furtivo (1d6), Gíria de Ladrão e Ação Ardilosa.',
      'Subclasse: Alma Laminada.',
      'Tabaxi: Visão no Escuro (18 m), Agilidade Felina (dobra o deslocamento uma vez por turno), Garras de Gato (1d4 cortante e escalada de 6 m) e sentidos apurados.',
      'Órfão — Segredos da Cidade: conhece caminhos escondidos e se move duas vezes mais rápido em ambientes urbanos.',
    ],
    color: 'coral',
    slots: [],
    usedSlots: [],
    spells: [],
    notes: '',
  },
  {
    id: 'borubas',
    name: 'borubas',
    className: 'Feiticeiro',
    ancestry: 'Meio-elfo',
    subclass: 'Magia Selvagem',
    background: 'Charlatão',
    alignment: 'Caótico e Bom',
    player: 'lucas',
    speed: '9 m',
    level: 3,
    abilities: { for: 8, des: 10, con: 14, int: 14, sab: 13, car: 17 },
    hp: 20,
    maxHp: 20,
    hitDie: 6,
    armorBase: 10,
    armorDex: true,
    skills: ['Enganação', 'Intimidação', 'Persuasão'],
    savingThrows: ['con', 'car'],
    passives: [
      'Feiticeiro: Origem Feiticeira, Conjuração, Fonte de Magia e Metamagia.',
      'Subclasse: Magia Selvagem.',
      'Meio-elfo: visão no escuro (18 m), Ancestral Feérico, Versatilidade em Perícia e os aumentos de atributo anotados na ficha.',
      'Charlatão — Identidade Falsa: mantém uma segunda identidade com documentação, relações e disfarce.',
    ],
    color: 'lilac',
    slots: [4, 2],
    usedSlots: [4, 2],
    spellcastingAbility: 'car',
    spells: [
      spell('Raio de Fogo', 0, 'Ação · 36 m · V/S · Instantânea. Faça um ataque mágico à distância; no acerto, causa 1d10 de dano de fogo.'),
      spell('Amizade', 0, 'Ação · Próprio · S/M · Concentração, até 1 minuto. Você tem vantagem em testes de Carisma contra uma criatura não hostil; ela percebe a influência quando o efeito termina.'),
      spell('Moldar Água', 0, 'Ação · 9 m · S · Instantânea ou até 1 hora. Molda uma porção pequena de água, muda sua cor/opacidade ou a congela/descongela, dentro dos limites do truque.'),
      spell('Rompante de Espadas', 0, 'Ação · 1,5 m ao redor de você · V · Instantânea. Criaturas próximas fazem um teste de Destreza; em falha, sofrem dano de energia.'),
      spell('Mísseis Mágicos', 1, 'Ação · 36 m · V/S · Instantânea. Três dardos acertam automaticamente, cada um causando 1d4 + 1 de dano de energia; pode dividir os alvos.'),
      spell('Disfarçar-se', 1, 'Ação · Próprio · V/S · 1 hora. Altera sua aparência e roupas por ilusão; uma criatura pode identificar o disfarce examinando você.'),
      spell('Imagem Espelhada', 2, 'Ação · Próprio · V/S · 1 minuto. Três duplicatas ilusórias confundem ataques contra você; cada acerto pode atingir uma duplicata em vez de você.'),
      spell('Teia', 2, 'Ação · 18 m · V/S/M · Concentração, até 1 hora. Cria teias que dificultam o terreno e podem prender criaturas; fogo pode incendiá-las.'),
    ],
    notes: '',
  },
  {
    id: 'talia',
    name: 'Talia',
    className: 'Clérigo',
    ancestry: 'Alto-Elfo',
    subclass: 'Domínio do Crepúsculo',
    background: 'Soldado',
    alignment: 'Caótico e Bom',
    player: 'Tessa',
    speed: '9 m',
    level: 3,
    abilities: { for: 12, des: 15, con: 14, int: 11, sab: 15, car: 8 },
    hp: 24,
    maxHp: 24,
    hitDie: 8,
    armorBase: 16,
    armorDex: false,
    skills: ['Atletismo', 'Intuição', 'Medicina', 'Percepção'],
    savingThrows: ['sab', 'car'],
    passives: [
      'Clérigo: Conjuração, Domínio Divino e Canalizar Divindade.',
      'Subclasse: Domínio do Crepúsculo.',
      'Alto-elfo: visão no escuro (18 m), Sentidos Aguçados, Ancestral Feérico, Transe, Treinamento com Armas Élficas, truque de mago e um idioma adicional.',
      'Soldado — Posto Militar: soldados leais ao antigo posto reconhecem sua autoridade.',
    ],
    color: 'gold',
    slots: [4, 2],
    usedSlots: [4, 2],
    spellcastingAbility: 'sab',
    spells: [
      spell('Mãos Mágicas', 0, 'Ação · 9 m · V/S · 1 minuto. Cria uma mão espectral que manipula objetos leves; ela não pode atacar nem ativar itens mágicos.'),
      spell('Chama Sagrada', 0, 'Ação · 18 m · V/S · Instantânea. O alvo faz um teste de Destreza; em falha, sofre 1d8 de dano radiante.'),
      spell('Ilusão Menor', 0, 'Ação · 9 m · S/M · 1 minuto. Cria um som ou uma imagem estática pequena; examinar a ilusão revela sua natureza.'),
      spell('Rompante de Espadas', 0, 'Ação · 1,5 m ao redor de você · V · Instantânea. Criaturas próximas fazem um teste de Destreza; em falha, sofrem dano de energia.'),
      spell('Mãos Flamejantes', 1, 'Ação · Cone de 4,5 m · V/S · Instantânea. Criaturas na área fazem um teste de Destreza; em falha, sofrem 3d6 de dano de fogo.'),
      spell('Névoa Obscurecente', 1, 'Ação · 36 m · V/S · Concentração, até 1 hora. Uma esfera de névoa obscurece fortemente a área; vento forte pode dispersá-la.'),
      spell('Servo Invisível', 1, 'Ação · 18 m · V/S/M · 1 hora. Uma força invisível executa tarefas simples sob seu comando, mas não pode atacar.'),
      spell('Ver o Invisível', 2, 'Ação · Próprio · V/S/M · 1 hora. Você percebe criaturas e objetos invisíveis e enxerga no Plano Etéreo dentro do alcance da visão.'),
      spell('Reflexos', 2, 'Ação · Próprio · V/S · 1 minuto. Cópias ilusórias confundem ataques contra você; cada ataque pode atingir uma cópia em vez do original.'),
    ],
    notes: '',
  },
  {
    id: 'manu',
    name: 'Manu',
    className: 'Bruxo',
    ancestry: 'Aasimar Flagelo',
    subclass: 'A Lâmina Maldita',
    background: 'Forasteiro',
    alignment: 'Leal e Bom',
    player: 'Manu',
    speed: '9 m',
    level: 3,
    abilities: { for: 12, des: 14, con: 14, int: 8, sab: 10, car: 17 },
    hp: 24,
    maxHp: 24,
    hitDie: 8,
    armorBase: 10,
    armorDex: true,
    skills: ['Atletismo', 'Enganação', 'Intimidação', 'Sobrevivência'],
    savingThrows: ['sab', 'car'],
    passives: [
      'Bruxo: Patrono Supremo, Conjuração Pactual, Invocações Místicas e Dádiva do Pacto.',
      'Subclasse: A Lâmina Maldita.',
      'Aasimar Flagelo: visão no escuro (18 m), resistência a dano necrótico e radiante, Mãos Curativas, truque Luz e Consumo Radiante (1 vez por dia).',
      'Forasteiro — Errante: excelente memória geográfica; encontra comida e água para até seis pessoas na natureza.',
    ],
    color: 'jade',
    slots: [0, 2],
    usedSlots: [0, 2],
    spellcastingAbility: 'car',
    spells: [
      spell('Lâmina da Chama Esverdeada', 0, 'Ação · Próprio · S/M · Instantânea. Faça um ataque corpo a corpo com arma; no acerto, o alvo recebe o dano normal e a chama pode atingir outra criatura próxima.'),
      spell('Lâmina Estrondosa', 0, 'Ação · Próprio · S/M · 1 rodada. Faça um ataque corpo a corpo com arma; se o alvo se mover voluntariamente antes do próximo turno, recebe dano trovejante adicional.'),
      spell('Raio da Bruxa', 1, 'Ação · 9 m · V/S/M · Concentração, até 1 minuto. Ataque mágico à distância causa 1d12 elétrico; nos turnos seguintes, você pode manter o dano com uma ação.'),
      spell('Bruxaria', 1, 'Ação bônus · 27 m · V/S/M · Concentração, até 1 hora. Marca uma criatura: seus ataques causam 1d6 necrótico adicional e você tem vantagem em testes para rastreá-la.'),
      spell('Passo das Brumas', 2, 'Ação bônus · Próprio · V · Instantânea. Você se teletransporta para um espaço desocupado visível a até 9 m.'),
      spell('Escuridão', 2, 'Ação · 18 m · V/M · Concentração, até 10 minutos. Cria uma esfera de escuridão mágica que bloqueia a visão no escuro comum.'),
    ],
    notes: '',
  },
  {
    id: 'hofbauer',
    name: 'Hofbauer',
    className: 'Monge',
    ancestry: 'Halfling Robusto',
    subclass: 'Caminho do Mestre Embriagado',
    background: 'Herói do Povo',
    alignment: 'Caótico e Bom',
    player: 'Danilo',
    speed: '10,5 m',
    level: 3,
    abilities: { for: 13, des: 17, con: 13, int: 8, sab: 14, car: 10 },
    hp: 21,
    maxHp: 21,
    hitDie: 8,
    armorBase: 10,
    armorDex: true,
    armorWis: true,
    skills: ['Acrobacia', 'Atletismo', 'Adestrar Animais', 'Sobrevivência'],
    savingThrows: ['for', 'des'],
    passives: [
      'Monge: Defesa sem Armadura, Artes Marciais, Ki e Movimento sem Armadura.',
      'Subclasse: Caminho do Mestre Embriagado.',
      'Halfling Robusto: Sortudo (pode rerrolar 1 natural), Bravura, Agilidade Halfling e vantagem contra veneno.',
      'Herói do Povo — Hospitalidade Rústica: pessoas comuns oferecem abrigo e esconderijo.',
    ],
    color: 'blue',
    slots: [],
    usedSlots: [],
    spells: [],
    notes: '',
  },
  {
    id: 'vorath',
    name: 'Vorath nethral',
    className: 'Bardo',
    ancestry: 'Tiefling',
    subclass: 'Colégio da Criação',
    background: 'Artista',
    alignment: 'Caótico e Bom',
    player: 'luis',
    speed: '9 m',
    level: 3,
    abilities: { for: 12, des: 13, con: 14, int: 9, sab: 10, car: 17 },
    hp: 24,
    maxHp: 24,
    hitDie: 8,
    armorBase: 10,
    armorDex: true,
    skills: ['Acrobacia', 'Atuação', 'Enganação', 'Furtividade', 'Persuasão'],
    savingThrows: ['des', 'car'],
    passives: [
      'Bardo: Conjuração, Inspiração Bárdica (d6), Talento para Tudo e Canção do Descanso.',
      'Subclasse: Colégio da Criação.',
      'Tiefling: visão no escuro (18 m), Resistência Infernal a fogo e Legado Infernal.',
      'Artista — Pela Demanda Popular: pode atuar em estabelecimentos em troca de alojamento e refeições modestos.',
    ],
    color: 'plum',
    slots: [4, 2],
    usedSlots: [4, 2],
    spellcastingAbility: 'car',
    spells: [
      spell('Zombaria Viciosa', 0, 'Ação · 18 m · V · Instantânea. O alvo faz um teste de Sabedoria; em falha, sofre 1d4 psíquico e tem desvantagem no próximo ataque.'),
      spell('Trovoada', 0, 'Ação · 1,5 m ao redor de você · V · Instantânea. Criaturas próximas fazem um teste de Constituição; em falha, sofrem dano trovejante.'),
      spell('Curar Ferimentos', 1, 'Ação · Toque · V/S · Instantânea. Uma criatura recupera 1d8 + seu modificador de habilidade de conjuração em pontos de vida.'),
      spell('Enfeitiçar Pessoa', 1, 'Ação · 9 m · V/S · 1 hora. O alvo faz um teste de Sabedoria; em falha, fica enfeitiçado por você até o efeito terminar ou sofrer dano.'),
      spell('Onda Trovejante', 1, 'Ação · Cubo de 4,5 m · V/S · Instantânea. Criaturas fazem um teste de Constituição; em falha, sofrem 2d8 trovejante e são empurradas.'),
      spell('Tremor da Terra', 1, 'Ação · 3 m ao redor de você · V/S · Instantânea. Criaturas fazem um teste de Destreza; em falha, sofrem 1d6 contundente e podem cair no chão.'),
      spell('Nuvem de Adagas', 2, 'Ação · 18 m · V/S/M · Concentração, até 1 minuto. Preenche um cubo pequeno com lâminas; criaturas sofrem dano ao entrar ou iniciar o turno na área.'),
      spell('Invisibilidade', 2, 'Ação · Toque · V/S/M · Concentração, até 1 hora. Uma criatura tocada fica invisível até o efeito terminar ou atacar/conjurar uma magia.'),
    ],
    notes: 'Brincalhão, enganador, preparado.',
  },
];

export const legacyNotes: Record<string, string> = {
  dart: 'Passos leves, lâmina pronta. O silêncio também é uma resposta.',
  borubas: 'A magia nem sempre pergunta antes de acontecer.',
  talia: 'Guardiã da hora entre a última luz e a primeira estrela.',
  manu: 'Um pacto tem duas assinaturas. Nem sempre são feitas com tinta.',
  hofbauer: 'O equilíbrio é uma questão de perspectiva — e de mais um gole.',
  vorath: 'Toda criação começa com uma nota que ainda não existe.',
};
