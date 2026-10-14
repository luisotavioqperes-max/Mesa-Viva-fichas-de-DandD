export type Ability = 'for' | 'des' | 'con' | 'int' | 'sab' | 'car';

export type Spell = {
  name: string;
  level: number;
  description: string;
  uses: number;
  unlockedAt?: number;
};

export type CharacterFeature = {
  name: string;
  category: 'Classe' | 'Subclasse' | 'Ancestralidade' | 'Antecedente';
  description: string;
  resource?: 'kiPoints' | 'sorceryPoints';
  unlockedAt?: number;
};

export type Character = {
  id: string;
  name: string;
  className: string;
  ancestry: string;
  subrace?: string;
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
  proficiencies?: string[];
  savingThrows: Ability[];
  features: CharacterFeature[];
  resources: { kiPoints: number; sorceryPoints: number };
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

const feature = (
  category: CharacterFeature['category'],
  name: string,
  description: string,
  resource?: CharacterFeature['resource'],
): CharacterFeature => ({ category, name, description, ...(resource ? { resource } : {}) });

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
    features: [
      feature('Classe', 'Perícia', 'Escolha duas perícias ou ferramentas em que já seja proficiente; seu bônus de proficiência é dobrado nelas.'),
      feature('Classe', 'Ataque Furtivo (1d6)', 'Uma vez por turno, causa 1d6 extra ao acertar com arma de acuidade ou à distância quando tem vantagem, ou quando um aliado ameaça o alvo e você não tem desvantagem.'),
      feature('Classe', 'Gíria de Ladrão', 'Conhece uma mistura secreta de dialeto, códigos e sinais usada para transmitir mensagens sem que outras pessoas entendam.'),
      feature('Classe', 'Ação Ardilosa', 'No seu turno, pode usar uma ação bônus para Correr, Desengajar ou Esconder-se.'),
      feature('Subclasse', 'Poder Psíquico', 'Usa energia psíquica para apoiar proezas da Alma Laminada; os dados de energia retornam após descanso longo e um deles pode ser recuperado em descanso curto.'),
      feature('Subclasse', 'Lâminas Psíquicas', 'Manifesta lâminas de energia psíquica para realizar ataques corpo a corpo ou à distância, sem precisar sacar uma arma física.'),
      feature('Subclasse', 'Sussurros Psíquicos', 'Forma um elo telepático com criaturas escolhidas para trocar mensagens mentalmente por um período limitado.'),
      feature('Ancestralidade', 'Visão no Escuro', 'Enxerga na penumbra a até 18 m como se fosse luz plena e na escuridão como se fosse penumbra.'),
      feature('Ancestralidade', 'Agilidade Felina', 'Quando se move no seu turno, pode dobrar o deslocamento até o fim do turno; precisa passar um turno sem se mover para usar de novo.'),
      feature('Ancestralidade', 'Garras de Gato', 'Tem garras naturais que causam 1d4 de dano cortante e permitem escalar com deslocamento de escalada de 6 m.'),
      feature('Ancestralidade', 'Sentidos Apurados', 'A ficha registra sentidos treinados, com proficiência em Percepção e Furtividade.'),
      feature('Antecedente', 'Segredos da Cidade', 'Conhece atalhos e passagens escondidas nos centros urbanos; circula pela cidade com o dobro do deslocamento normal.'),
    ],
    resources: { kiPoints: 0, sorceryPoints: 0 },
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
    features: [
      feature('Classe', 'Conjuração', 'Lança magias usando Carisma. Conhece os truques e magias indicados nesta ficha e recupera espaços de magia após descanso longo.'),
      feature('Classe', 'Fonte de Magia', 'Converte espaços de magia em pontos de feitiçaria ou pontos em espaços de magia conforme as regras da classe.', 'sorceryPoints'),
      feature('Classe', 'Metamagia', 'Gasta pontos de feitiçaria para modificar a forma de conjurar uma magia; as opções escolhidas ficam a cargo da mesa.'),
      feature('Subclasse', 'Surto de Magia Selvagem', 'Depois de conjurar uma magia de feiticeiro, o mestre pode pedir uma rolagem para provocar um efeito mágico imprevisível.'),
      feature('Subclasse', 'Marés do Caos', 'Uma vez antes de um descanso longo, pode ganhar vantagem em um teste de ataque, habilidade ou resistência; o mestre pode então provocar um surto selvagem.'),
      feature('Ancestralidade', 'Aumento de Atributos', 'Recebe os aumentos de atributo de meio-elfo anotados na ficha.'),
      feature('Ancestralidade', 'Visão no Escuro', 'Enxerga na penumbra a até 18 m como se fosse luz plena e na escuridão como se fosse penumbra.'),
      feature('Ancestralidade', 'Ancestral Feérico', 'Tem vantagem em testes de resistência contra ser enfeitiçado; magia não pode colocá-lo para dormir.'),
      feature('Ancestralidade', 'Versatilidade em Perícia', 'Ganha proficiência em duas perícias à escolha; as proficiências marcadas aparecem na seção Perícias.'),
      feature('Antecedente', 'Identidade Falsa', 'Mantém uma identidade alternativa com documentação, contatos e disfarce para se apresentar como outra pessoa.'),
    ],
    resources: { kiPoints: 0, sorceryPoints: 3 },
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
    features: [
      feature('Classe', 'Conjuração', 'Lança magias usando Sabedoria. As magias conhecidas e preparadas aparecem na seção Magias.'),
      feature('Classe', 'Domínio Divino', 'O domínio concede magias e características temáticas; as magias de domínio ficam sempre preparadas.'),
      feature('Classe', 'Canalizar Divindade', 'Conduz energia divina por meio de um efeito de classe ou domínio; a quantidade de usos cresce com o nível.'),
      feature('Subclasse', 'Proficiências Bônus', 'O Domínio do Crepúsculo concede treinamento com armas e armaduras adicionais conforme a escolha registrada.'),
      feature('Subclasse', 'Olhos da Noite', 'Enxerga na escuridão a até 90 m; também pode compartilhar essa visão com aliados por um período limitado.'),
      feature('Subclasse', 'Bênção Vigilante', 'Com uma ação, concede vantagem no próximo teste de iniciativa de uma criatura.'),
      feature('Subclasse', 'Santuário do Crepúsculo', 'Canaliza Divindade para criar uma esfera protetora que concede vigor temporário ou encerra medo e encantamento em aliados.'),
      feature('Ancestralidade', 'Visão no Escuro', 'Enxerga na penumbra a até 18 m como se fosse luz plena e na escuridão como se fosse penumbra.'),
      feature('Ancestralidade', 'Sentidos Aguçados', 'Tem proficiência em Percepção, conforme a ficha.'),
      feature('Ancestralidade', 'Ancestral Feérico', 'Tem vantagem em testes de resistência contra ser enfeitiçado; magia não pode colocá-lo para dormir.'),
      feature('Ancestralidade', 'Transe', 'Não precisa dormir; medita profundamente por quatro horas para obter o benefício de um descanso longo.'),
      feature('Ancestralidade', 'Treinamento com Armas Élficas', 'Tem treinamento com armas élficas tradicionais.'),
      feature('Ancestralidade', 'Truque de Alto-Elfo', 'Conhece um truque da lista de magias de mago, escolhido conforme anotado na ficha.'),
      feature('Ancestralidade', 'Idioma Adicional', 'Pode falar, ler e escrever um idioma adicional.'),
      feature('Antecedente', 'Posto Militar', 'Soldados leais ao seu antigo posto reconhecem sua autoridade e influência militar.'),
    ],
    resources: { kiPoints: 0, sorceryPoints: 0 },
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
    features: [
      feature('Classe', 'Magia Pactual', 'Conjura magias usando Carisma. Seus espaços são todos do mesmo círculo, retornam após descanso curto ou longo e são gastos para conjurar magias de nível igual ou menor.'),
      feature('Classe', 'Invocações Místicas', 'Escolhe invocações que concedem capacidades mágicas ou sobrenaturais permanentes.'),
      feature('Classe', 'Dádiva do Pacto', 'Recebe um benefício especial de pacto; a dádiva escolhida na ficha define a forma desse recurso.'),
      feature('Subclasse', 'Maldição da Lâmina Maldita', 'Amaldiçoa um alvo para aumentar o dano contra ele, ampliar a chance de acerto crítico e recuperar vida se ele morrer.'),
      feature('Subclasse', 'Guerreiro Hex', 'Usa Carisma nos ataques e dano com a arma de pacto escolhida e ganha treinamento com armaduras e armas adequadas.'),
      feature('Ancestralidade', 'Visão no Escuro', 'Enxerga na penumbra a até 18 m como se fosse luz plena e na escuridão como se fosse penumbra.'),
      feature('Ancestralidade', 'Resistência Celestial', 'Tem resistência a dano necrótico e radiante.'),
      feature('Ancestralidade', 'Mãos Curativas', 'Com um toque, restaura pontos de vida uma vez por descanso longo.'),
      feature('Ancestralidade', 'Luz', 'Conhece o truque Luz, que ilumina um objeto tocado.'),
      feature('Ancestralidade', 'Consumo Radiante', 'Libera energia luminosa ao redor de si; causa dano radiante próximo e a si mesmo, uma vez por descanso longo.'),
      feature('Antecedente', 'Errante', 'Tem memória geográfica excelente e encontra comida e água para si e até cinco outras pessoas em regiões naturais.'),
    ],
    resources: { kiPoints: 0, sorceryPoints: 0 },
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
    features: [
      feature('Classe', 'Defesa sem Armadura', 'Sem armadura nem escudo, sua CA é 10 + modificador de Destreza + modificador de Sabedoria.'),
      feature('Classe', 'Artes Marciais', 'Sem armadura ou escudo, pode usar Destreza em ataques desarmados e armas de monge; seus golpes desarmados causam 1d4.'),
      feature('Classe', 'Ki', 'Tem 3 pontos de ki no nível atual. Pode gastar ki para Rajada de Golpes, Defesa Paciente ou Passo do Vento; recupera tudo em descanso curto ou longo.', 'kiPoints'),
      feature('Classe', 'Movimento sem Armadura', 'Seu deslocamento aumenta em 3 m enquanto não usa armadura nem escudo.'),
      feature('Subclasse', 'Técnica do Mestre Embriagado', 'Após usar Rajada de Golpes, pode se Desengajar e ganhar 3 m de deslocamento até o fim do turno.'),
      feature('Subclasse', 'Proficiência em Suprimentos de Cervejeiro', 'Ganha proficiência em suprimentos de cervejeiro e em Atuação, conforme os benefícios do caminho.'),
      feature('Ancestralidade', 'Sortudo', 'Quando tira 1 natural em uma jogada de ataque, teste de habilidade ou resistência, pode rolar o dado novamente.'),
      feature('Ancestralidade', 'Bravura', 'Tem vantagem em testes de resistência para evitar ou encerrar a condição amedrontado.'),
      feature('Ancestralidade', 'Agilidade Halfling', 'Pode atravessar o espaço de criaturas maiores que você.'),
      feature('Ancestralidade', 'Resiliência Robusta', 'Tem vantagem em testes de resistência contra veneno e resistência a dano venenoso.'),
      feature('Antecedente', 'Hospitalidade Rústica', 'Pessoas comuns podem oferecer abrigo e esconderijo, embora não arrisquem a própria segurança.'),
    ],
    resources: { kiPoints: 3, sorceryPoints: 0 },
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
    features: [
      feature('Classe', 'Conjuração', 'Lança magias usando Carisma; consulte a seção Magias para ver os truques e espaços da ficha.'),
      feature('Classe', 'Inspiração Bárdica (d6)', 'Como ação bônus, concede a uma criatura um dado d6 para somar a um teste de habilidade, ataque ou resistência; recupera os usos em descanso longo.'),
      feature('Classe', 'Talento para Tudo', 'Soma metade do bônus de proficiência, arredondada para baixo, a testes de habilidade que ainda não incluam proficiência.'),
      feature('Classe', 'Canção do Descanso (d6)', 'Durante um descanso curto, aliados que gastam Dados de Vida recuperam 1d6 PV adicionais se puderem ouvir sua atuação.'),
      feature('Subclasse', 'Mote de Potencial', 'A Inspiração Bárdica ganha um efeito extra, determinado pelo uso: proteção, dano ou melhoria de um teste.'),
      feature('Subclasse', 'Atuação da Criação', 'Cria temporariamente um objeto não mágico de tamanho e valor limitados, sujeito aos usos e limites da característica.'),
      feature('Ancestralidade', 'Visão no Escuro', 'Enxerga na penumbra a até 18 m como se fosse luz plena e na escuridão como se fosse penumbra.'),
      feature('Ancestralidade', 'Resistência Infernal', 'Tem resistência a dano de fogo.'),
      feature('Ancestralidade', 'Legado Infernal', 'Recebe magias raciais ligadas à herança infernal, conforme a ficha e o nível.'),
      feature('Antecedente', 'Pela Demanda Popular', 'Consegue atuar em estabelecimentos para obter alojamento e refeições modestos, desde que se apresente.'),
    ],
    resources: { kiPoints: 0, sorceryPoints: 0 },
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
