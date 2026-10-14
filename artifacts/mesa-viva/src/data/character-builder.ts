import type { Ability, Character, CharacterFeature, Spell } from './character-sheets';
import { abilityKeys, skillList } from './character-sheets';

type RaceVariant = {
  name: string;
  bonuses: Partial<Record<Ability, number>>;
  speed: number;
  traits: [string, string][];
};
type RaceOption = { name: string; variants: RaceVariant[]; bonuses?: Partial<Record<Ability, number>>; traits?: [string, string][]; speed?: number };
type ClassOption = {
  name: string;
  subclasses: string[];
  hitDie: number;
  saves: Ability[];
  skillCount: number;
  skillOptions: string[];
  spellAbility?: Ability;
  color: string;
  features: [string, string][];
};

const variant = (name: string, bonuses: RaceVariant['bonuses'] = {}, traits: [string, string][] = [], speed = 9): RaceVariant => ({ name, bonuses, traits, speed });
export const raceOptions: RaceOption[] = [
  { name: 'Anão', variants: [variant('Colina', { con: 2, sab: 1 }, [['Resiliência Anã', 'Vantagem contra veneno e resistência a dano venenoso.']], 7.5), variant('Montanha', { con: 2, for: 2 }, [['Treinamento Anão', 'Proficiência com armaduras leves e médias.']], 7.5), variant('Duergar', { con: 2, for: 1 }, [['Resistência Duergar', 'Vantagem contra ilusões e contra ficar enfeitiçado ou paralisado.']], 7.5)] },
  { name: 'Aasimar', variants: [variant('Protetor', { car: 2, sab: 1 }, [['Mãos Curativas', 'Como ação, restaura pontos de vida iguais ao seu nível uma vez por descanso longo.'], ['Alma Radiante', 'No nível 3, manifesta asas luminosas por 1 minuto e causa dano radiante adicional.']]), variant('Flagelador', { car: 2, con: 1 }, [['Consumo Radiante', 'No nível 3, emana energia radiante que causa dano a você e a criaturas próximas.']]), variant('Caído', { car: 2, for: 1 }, [['Mortalha Necrótica', 'No nível 3, transforma-se por 1 minuto e pode amedrontar criaturas próximas.']])] },
  { name: 'Draconato', variants: [variant('Padrão', { for: 2, car: 1 }, [['Ancestral Dracônico', 'Escolha um tipo de dragão; ele define seu sopro e sua resistência elemental.'], ['Sopro Dracônico', 'Substitui um ataque por um sopro elemental, conforme sua ancestralidade.']]) ] },
  { name: 'Elfo', variants: [variant('Alto Elfo', { des: 2, int: 1 }, [['Visão no Escuro', 'Enxerga na penumbra a até 18 m e na escuridão como se fosse penumbra.'], ['Sentidos Aguçados', 'Ganha proficiência em Percepção.']]), variant('Elfo da Floresta', { des: 2, sab: 1 }, [['Pés Ligeiros', 'Seu deslocamento aumenta para 10,5 m.'], ['Máscara da Natureza', 'Pode tentar se esconder mesmo com cobertura natural leve.']]), variant('Drow', { des: 2, car: 1 }, [['Magia Drow', 'Aprende magias drow conforme avança de nível.'], ['Sensibilidade à Luz Solar', 'Tem desvantagem em ataques e testes de Percepção baseados em visão sob luz solar direta.']]), variant('Eladrin', { des: 2, car: 1 }, [['Passo Feérico', 'Teletransporta-se magicamente; efeitos adicionais dependem da estação escolhida.']]), variant('Shadar-kai', { des: 2, con: 1 }, [['Passo Feérico Sombrio', 'Teletransporta-se e recebe resistência temporária a dano.']]) ] },
  { name: 'Gnomo', variants: [variant('Floresta', { int: 2, des: 1 }, [['Ilusionista Nato', 'Conhece o truque Ilusão Menor.']]), variant('Pedra', { int: 2, con: 1 }, [['Conhecimento de Artífice', 'Dobra o bônus de proficiência em testes de História sobre itens mágicos, alquímicos ou tecnológicos.']]), variant('Profundo', { int: 2, des: 1 }, [['Camuflagem de Pedra', 'Tem vantagem em testes de Furtividade para se esconder em terreno rochoso.']]) ] },
  { name: 'Halfling', variants: [variant('Pés-Leves', { des: 2, car: 1 }, [['Furtividade Natural', 'Pode tentar se esconder atrás de criaturas maiores.']]), variant('Robusto', { des: 2, con: 1 }, [['Resiliência dos Robustos', 'Tem vantagem contra veneno e resistência a dano venenoso.']]), variant('Fantasma', { des: 2, sab: 1 }, [['Discrição Natural', 'Pode se esconder atrás de uma criatura ao menos uma categoria maior.']]) ] },
  { name: 'Humano', variants: [variant('Padrão', { for: 1, des: 1, con: 1, int: 1, sab: 1, car: 1 }, [['Versatilidade Humana', 'Recebe +1 em todos os atributos e aprende um idioma adicional.']]), variant('Variante', { for: 1, des: 1 }, [['Talento Variante', 'Recebe uma perícia e um talento, escolhidos com a mesa.']]) ] },
  { name: 'Meio-Elfo', variants: [variant('Padrão', { car: 2, con: 1, des: 1 }, [['Ancestral Feérico', 'Tem vantagem contra ser enfeitiçado; magia não pode fazê-lo dormir.'], ['Versatilidade em Perícia', 'Escolhe duas perícias para receber proficiência.']]) ] },
  { name: 'Meio-Orc', variants: [variant('Padrão', { for: 2, con: 1 }, [['Resistência Implacável', 'Uma vez por descanso longo, fica com 1 PV em vez de cair a 0.'], ['Ataques Selvagens', 'Em um acerto crítico corpo a corpo, rola um dado de dano da arma adicional.']]) ] },
  { name: 'Tiefling', variants: [variant('Asmodeus', { car: 2, int: 1 }, [['Legado Infernal', 'Aprende magia infernal conforme avança de nível.'], ['Resistência Infernal', 'Tem resistência a dano de fogo.']]), variant('Abissal', { car: 2, int: 1 }, [['Legado Abissal', 'Recebe resistência e magia relacionadas à sua linhagem infernal.']]), variant('Feral', { des: 2, int: 1 }, [['Legado Infernal', 'Aprende magia infernal conforme avança de nível.']]) ] },
  { name: 'Tabaxi', variants: [variant('Padrão', { des: 2, car: 1 }, [['Agilidade Felina', 'Pode dobrar o deslocamento até o fim do turno; recupera o uso após ficar parado.'], ['Garras de Gato', 'Tem armas naturais que causam 1d4 de dano cortante.']]) ] },
  { name: 'Aarakocra', variants: [variant('Padrão', { des: 2, sab: 1 }, [['Voo', 'Tem deslocamento de voo de 15 m enquanto não estiver usando armadura média ou pesada.']]) ] },
  { name: 'Bugbear', variants: [variant('Padrão', { for: 2, des: 1 }, [['Alcance Longo', 'Seu alcance corpo a corpo é maior no seu turno.'], ['Ataque Surpresa', 'Causa dano adicional ao atingir uma criatura que ainda não agiu no combate.']]) ] },
  { name: 'Centauro', variants: [variant('Padrão', { for: 2, sab: 1 }, [['Carga', 'Após correr em linha reta, pode fazer um ataque adicional com os cascos.']]) ] },
  { name: 'Changeling', variants: [variant('Padrão', { car: 2, des: 1 }, [['Mudança de Forma', 'Altera aparência e voz, sem mudar tamanho ou estatísticas.']]) ] },
  { name: 'Fada', variants: [variant('Padrão', { des: 2, car: 1 }, [['Voo Feérico', 'Tem deslocamento de voo e magia feérica inata.']]) ] },
  { name: 'Firbolg', variants: [variant('Padrão', { sab: 2, for: 1 }, [['Magia Firbolg', 'Pode usar Disfarçar-se e Detectar Magia conforme as regras da ancestralidade.'], ['Passo Oculto', 'Fica invisível magicamente por um período breve.']]) ] },
  { name: 'Genasi', variants: [variant('Ar', { con: 2, des: 1 }, [['Herança Genasi', 'Tem resistência e magia associadas ao elemento ar.']]), variant('Água', { con: 2, sab: 1 }, [['Herança Genasi', 'Respira ar e água e recebe magia associada à água.']]), variant('Fogo', { con: 2, int: 1 }, [['Herança Genasi', 'Tem visão no escuro, resistência a fogo e magia elemental.']]), variant('Terra', { con: 2, for: 1 }, [['Herança Genasi', 'Pode atravessar terreno difícil de pedra ou terra sem gastar movimento adicional.']]) ] },
  { name: 'Gith', variants: [variant('Githyanki', { int: 1, for: 2 }, [['Conhecimento Astral', 'Ganha proficiência temporária em uma perícia ou ferramenta após um descanso.']]), variant('Githzerai', { int: 1, sab: 2 }, [['Disciplina Mental', 'Tem vantagem contra ser enfeitiçado ou amedrontado.']]) ] },
  { name: 'Goblin', variants: [variant('Padrão', { des: 2, con: 1 }, [['Fuga Ágil', 'Pode usar Desengajar ou Esconder-se como ação bônus.']]) ] },
  { name: 'Golias', variants: [variant('Padrão', { for: 2, con: 1 }, [['Resistência da Pedra', 'Usa a reação para reduzir dano recebido.'], ['Atleta Natural', 'Tem proficiência em Atletismo.']]) ] },
  { name: 'Hobgoblin', variants: [variant('Padrão', { con: 2, int: 1 }, [['Salvamento Feérico', 'Pode receber bônus em um teste ou ataque quando aliados próximos ajudam.']]) ] },
  { name: 'Kenku', variants: [variant('Padrão', { des: 2, sab: 1 }, [['Mimetismo', 'Imita sons e vozes que tenha ouvido.'], ['Treinamento Kenku', 'Ganha proficiência em duas perícias à escolha.']]) ] },
  { name: 'Kobold', variants: [variant('Padrão', { des: 2 }, [['Tática de Matilha', 'Pode ganhar vantagem em ataques quando um aliado está próximo do alvo.']]) ] },
  { name: 'Lizardfolk', variants: [variant('Padrão', { con: 2, sab: 1 }, [['Armadura Natural', 'Sua pele fornece uma CA natural.'], ['Mordida', 'Tem um ataque natural que causa dano perfurante.']]) ] },
  { name: 'Orc', variants: [variant('Padrão', { for: 2, con: 1 }, [['Agressivo', 'Pode avançar rapidamente em direção a um inimigo como ação bônus.']]) ] },
  { name: 'Tritão', variants: [variant('Padrão', { for: 1, con: 1, car: 1 }, [['Anfíbio', 'Respira ar e água e tem deslocamento de natação.'], ['Emissário do Mar', 'Comunica ideias simples a criaturas subaquáticas.']]) ] },
  { name: 'Tortle', variants: [variant('Padrão', { for: 2, sab: 1 }, [['Carapaça', 'Sua carapaça fornece CA 17; não soma Destreza.']]) ] },
  { name: 'Warforged', variants: [variant('Padrão', { con: 2, for: 1 }, [['Construção Resiliente', 'Tem resistência a veneno, vantagem contra doenças e não precisa respirar.']]) ] },
  { name: 'Yuan-ti', variants: [variant('Puro-Sangue', { car: 2, int: 1 }, [['Resistência Mágica', 'Tem vantagem em testes de resistência contra magias e efeitos mágicos.'], ['Resistência a Veneno', 'Tem resistência a dano venenoso e vantagem contra envenenamento.']]) ] },
  { name: 'Kalashtar', variants: [variant('Padrão', { sab: 2, car: 1 }, [['Mente Desperta', 'Pode falar telepaticamente com uma criatura próxima que consiga ver.'], ['Resistência Psíquica', 'Tem resistência a dano psíquico e vantagem em testes de resistência de Sabedoria.']]) ] },
  { name: 'Leonino', variants: [variant('Padrão', { con: 2, for: 1 }, [['Garras', 'Tem armas naturais que causam dano cortante.'], ['Rugido Assustador', 'Pode amedrontar criaturas próximas com um rugido.']]) ] },
  { name: 'Loxodonte', variants: [variant('Padrão', { con: 2, sab: 1 }, [['Tromba', 'Usa a tromba para manipular objetos simples e fazer ataques desarmados.'], ['Serenidade Loxodonte', 'Tem vantagem contra ser enfeitiçado ou amedrontado.']]) ] },
  { name: 'Simic Hybrid', variants: [variant('Padrão', { con: 2, int: 1 }, [['Adaptação Simic', 'Escolhe adaptações biológicas adicionais conforme avança de nível.']]) ] },
  { name: 'Vedalken', variants: [variant('Padrão', { int: 2, sab: 1 }, [['Precisão Vedalken', 'Soma 1d4 a certos testes de habilidade.'], ['Resistência Vedalken', 'Tem vantagem em testes de resistência de Inteligência, Sabedoria e Carisma.']]) ] },
  { name: 'Satyr', variants: [variant('Padrão', { car: 2, des: 1 }, [['Resistência Mágica', 'Tem vantagem em testes de resistência contra magias e outros efeitos mágicos.'], ['Salto Mítico', 'Pode saltar distâncias adicionais.']]) ] },
  { name: 'Shifter', variants: [variant('Pele de Fera', { con: 2, des: 1 }, [['Transformação', 'Assume uma forma bestial por um período breve e recebe benefícios próprios da sub-raça.']]), variant('Presa Longa', { con: 2, for: 1 }, [['Transformação', 'Assume uma forma bestial por um período breve e recebe benefícios próprios da sub-raça.']]), variant('Passo Rápido', { con: 2, des: 1 }, [['Transformação', 'Assume uma forma bestial por um período breve e recebe benefícios próprios da sub-raça.']]), variant('Caça Selvagem', { con: 2, sab: 1 }, [['Transformação', 'Assume uma forma bestial por um período breve e recebe benefícios próprios da sub-raça.']]) ] },
  { name: 'Hadozee', variants: [variant('Padrão', { des: 2, sab: 1 }, [['Planar', 'Pode planar para reduzir quedas e atravessar distâncias horizontais.']]) ] },
  { name: 'Giff', variants: [variant('Padrão', { for: 2, con: 1 }, [['Constituição Hipopótamo', 'Tem vantagem em testes de Força e em testes contra ser derrubado.']]) ] },
  { name: 'Autognomo', variants: [variant('Padrão', { con: 2, int: 1 }, [['Construído para o Sucesso', 'Pode somar 1d4 a um teste de habilidade, ataque ou resistência.']]) ] },
  { name: 'Plasmoide', variants: [variant('Padrão', { con: 2, car: 1 }, [['Corpo Amorfo', 'Pode atravessar aberturas estreitas e alterar a forma do corpo.']]) ] },
  { name: 'Thri-kreen', variants: [variant('Padrão', { des: 2, sab: 1 }, [['Carapaça Camaleônica', 'Pode alterar as cores para obter vantagem ao se esconder.'], ['Membros Secundários', 'Possui membros extras para manipular objetos simples.']]) ] },
  { name: 'Owlin', variants: [variant('Padrão', { des: 2, sab: 1 }, [['Voo', 'Tem deslocamento de voo igual ao deslocamento de caminhada.'], ['Furtividade', 'Tem proficiência em Furtividade.']]) ] },
  { name: 'Reborn', variants: [variant('Padrão', { con: 2, int: 1 }, [['Legado Ancestral', 'Retém proficiências de uma vida anterior e tem resistência a veneno.'], ['Conhecimento de uma Vida Passada', 'Soma 1d6 a um teste de habilidade algumas vezes por descanso longo.']]) ] },
  { name: 'Dhampir', variants: [variant('Padrão', { con: 2, car: 1 }, [['Natureza Imortal', 'Não precisa respirar e tem deslocamento de escalada.'], ['Mordida Vampírica', 'Uma mordida pode causar dano e fortalecer um teste ou ataque.']]) ] },
  { name: 'Hexblood', variants: [variant('Padrão', { con: 2, sab: 1 }, [['Bruxa Presciente', 'Pode lançar Detectar Magia e Disfarçar-se conforme a ancestralidade.'], ['Token de Bruxa', 'Cria um token que pode transmitir mensagens e observações.']]) ] },
  { name: 'Locathah', variants: [variant('Padrão', { for: 2, des: 1 }, [['Anfíbio Limitado', 'Respira ar e água, mas precisa se submergir a cada quatro horas.'], ['Defesa Limitada', 'Tem resistência a dano de frio e pode usar sua pele como proteção natural.']]) ] },
  { name: 'Verdan', variants: [variant('Padrão', { car: 2, con: 1 }, [['Telepatia', 'Pode comunicar pensamentos simples telepaticamente.'], ['Crescimento Mutável', 'Seu tamanho e características mudam após certas experiências.']]) ] },
];

const allSkills = skillList.map(skill => skill.name);
export const classOptions: ClassOption[] = [
  { name: 'Bárbaro', subclasses: ['Berserker', 'Totem Guerreiro', 'Guardião Ancestral', 'Arauto da Tempestade', 'Fanático', 'Fera', 'Magia Selvagem'], hitDie: 12, saves: ['for', 'con'], skillCount: 2, skillOptions: ['Adestrar Animais', 'Atletismo', 'Intimidação', 'Natureza', 'Percepção', 'Sobrevivência'], color: 'coral', features: [['Fúria', 'Entra em fúria para aumentar dano corpo a corpo e resistir a certos danos.'], ['Defesa sem Armadura', 'Sem armadura, sua CA é 10 + modificador de Destreza + modificador de Constituição.']] },
  { name: 'Bardo', subclasses: ['Colégio do Conhecimento', 'Colégio da Bravura', 'Colégio do Glamour', 'Colégio das Espadas', 'Colégio dos Sussurros', 'Colégio da Criação', 'Colégio da Eloquência', 'Colégio dos Espíritos'], hitDie: 8, saves: ['des', 'car'], skillCount: 3, skillOptions: allSkills, spellAbility: 'car', color: 'amber', features: [['Conjuração', 'Aprende truques e magias de bardo usando Carisma.'], ['Inspiração Bárdica', 'Concede a uma criatura um dado para somar a um teste, ataque ou resistência.']] },
  { name: 'Bruxo', subclasses: ['Arquifada', 'Corruptor', 'Grande Antigo', 'Imortal', 'Celestial', 'A Lâmina Maldita', 'Abissal', 'Gênio', 'Morto-Vivo'], hitDie: 8, saves: ['sab', 'car'], skillCount: 2, skillOptions: ['Arcanismo', 'Enganação', 'História', 'Intimidação', 'Investigação', 'Natureza', 'Religião'], spellAbility: 'car', color: 'plum', features: [['Magia Pactual', 'Conjura magias usando espaços de pacto, recuperados em descanso curto ou longo.'], ['Patrono Sobrenatural', 'Seu patrono concede características de subclasse conforme você avança.']] },
  { name: 'Clérigo', subclasses: ['Conhecimento', 'Vida', 'Luz', 'Natureza', 'Tempestade', 'Trapaça', 'Guerra', 'Forja', 'Sepultura', 'Domínio do Crepúsculo', 'Ordem', 'Paz', 'Arcana'], hitDie: 8, saves: ['sab', 'car'], skillCount: 2, skillOptions: ['História', 'Intuição', 'Medicina', 'Persuasão', 'Religião'], spellAbility: 'sab', color: 'blue', features: [['Conjuração', 'Prepara magias divinas usando Sabedoria.'], ['Domínio Divino', 'Seu domínio concede magias e características de subclasse.']] },
  { name: 'Druida', subclasses: ['Círculo da Terra', 'Círculo da Lua', 'Círculo dos Sonhos', 'Círculo do Pastor', 'Círculo dos Esporos', 'Círculo das Estrelas', 'Círculo do Fogo Selvagem'], hitDie: 8, saves: ['int', 'sab'], skillCount: 2, skillOptions: ['Arcanismo', 'Adestrar Animais', 'Intuição', 'Medicina', 'Natureza', 'Percepção', 'Religião', 'Sobrevivência'], spellAbility: 'sab', color: 'jade', features: [['Druídico', 'Conhece o idioma secreto dos druidas.'], ['Conjuração', 'Prepara magias da natureza usando Sabedoria.']] },
  { name: 'Guerreiro', subclasses: ['Campeão', 'Mestre de Batalha', 'Cavaleiro Arcano', 'Arqueiro Arcano', 'Cavalheiro', 'Samurai', 'Cavaleiro das Runas', 'Guerreiro Psiônico', 'Eco Guerreiro'], hitDie: 10, saves: ['for', 'con'], skillCount: 2, skillOptions: ['Acrobacia', 'Adestrar Animais', 'Atletismo', 'História', 'Intuição', 'Intimidação', 'Percepção', 'Sobrevivência'], color: 'blue', features: [['Estilo de Luta', 'Escolhe um estilo de combate que aprimora uma forma de lutar.'], ['Retomar o Fôlego', 'Recupera pontos de vida como ação bônus uma vez por descanso curto ou longo.']] },
  { name: 'Ladino', subclasses: ['Ladrão', 'Assassino', 'Trapaceiro Arcano', 'Mestre da Intriga', 'Espadachim', 'Inquisitivo', 'Batedor', 'Fantasma', 'Alma Laminada'], hitDie: 8, saves: ['des', 'int'], skillCount: 4, skillOptions: ['Acrobacia', 'Atletismo', 'Atuação', 'Enganação', 'Furtividade', 'Intimidação', 'Intuição', 'Investigação', 'Percepção', 'Persuasão', 'Prestidigitação'], color: 'teal', features: [['Perícia', 'Dobra o bônus de proficiência em duas perícias ou ferramentas escolhidas.'], ['Ataque Furtivo', 'Uma vez por turno, causa dano adicional ao acertar com vantagem ou com um aliado adjacente ao alvo.'], ['Gíria de Ladrão', 'Conhece um código secreto usado para transmitir mensagens ocultas.']] },
  { name: 'Mago', subclasses: ['Abjuração', 'Adivinhação', 'Conjuração', 'Encantamento', 'Evocação', 'Ilusão', 'Necromancia', 'Transmutação', 'Lâminas Cantantes', 'Magia de Guerra', 'Cronurgia', 'Graviturguia', 'Escriba'], hitDie: 6, saves: ['int', 'sab'], skillCount: 2, skillOptions: ['Arcanismo', 'História', 'Intuição', 'Investigação', 'Medicina', 'Religião'], spellAbility: 'int', color: 'blue', features: [['Conjuração', 'Aprende truques e magias arcanas usando Inteligência.'], ['Recuperação Arcana', 'Recupera alguns espaços de magia em um descanso curto uma vez por dia.']] },
  { name: 'Monge', subclasses: ['Mão Aberta', 'Sombra', 'Quatro Elementos', 'Kensei', 'Sol', 'Caminho do Mestre Embriagado', 'Misericórdia', 'Eu Astral', 'Dragão Ascendente', 'Morte Longa'], hitDie: 8, saves: ['for', 'des'], skillCount: 2, skillOptions: ['Acrobacia', 'Atletismo', 'Furtividade', 'História', 'Intuição', 'Religião'], color: 'amber', features: [['Defesa sem Armadura', 'Sem armadura ou escudo, sua CA é 10 + Destreza + Sabedoria.'], ['Artes Marciais', 'Pode usar Destreza em ataques desarmados e armas de monge; seus golpes causam 1d4.']] },
  { name: 'Paladino', subclasses: ['Devoção', 'Anciões', 'Vingança', 'Coroa', 'Conquista', 'Redenção', 'Glória', 'Vigilantes', 'Quebra-Juramento'], hitDie: 10, saves: ['sab', 'car'], skillCount: 2, skillOptions: ['Atletismo', 'Intuição', 'Intimidação', 'Medicina', 'Persuasão', 'Religião'], spellAbility: 'car', color: 'gold', features: [['Sentido Divino', 'Detecta celestiais, ínferos e mortos-vivos próximos.'], ['Imposição das Mãos', 'Mantém uma reserva de cura igual a cinco vezes seu nível de paladino.']] },
  { name: 'Patrulheiro', subclasses: ['Caçador', 'Mestre das Feras', 'Perseguidor Sombrio', 'Andarilho do Horizonte', 'Matador de Monstros', 'Andarilho Feérico', 'Enxame', 'Draconato Guardião'], hitDie: 10, saves: ['for', 'des'], skillCount: 3, skillOptions: ['Adestrar Animais', 'Atletismo', 'Furtividade', 'Intuição', 'Investigação', 'Natureza', 'Percepção', 'Sobrevivência'], spellAbility: 'sab', color: 'jade', features: [['Inimigo Favorito', 'Escolhe tipos de inimigo para rastrear e estudar; recebe benefícios conforme a regra da mesa.'], ['Explorador Natural', 'Escolhe um terreno favorito e melhora a exploração e a sobrevivência nele.']] },
  { name: 'Feiticeiro', subclasses: ['Dracônica', 'Magia Selvagem', 'Tempestade', 'Alma Divina', 'Sombras', 'Mente Aberrante', 'Alma Mecânica', 'Lunar'], hitDie: 6, saves: ['con', 'car'], skillCount: 2, skillOptions: ['Arcanismo', 'Enganação', 'Intuição', 'Intimidação', 'Persuasão', 'Religião'], spellAbility: 'car', color: 'lilac', features: [['Conjuração', 'Conhece truques e magias de feiticeiro usando Carisma.'], ['Origem Feiticeira', 'Sua origem concede características de subclasse conforme você avança.']] },
];

type BackgroundOption = { name: string; skills: string[]; detail: string; feature: string };
export const backgroundOptions: BackgroundOption[] = [
  { name: 'Acólito', skills: ['Intuição', 'Religião'], detail: 'Idiomas adicionais escolhidos com a mesa.', feature: 'Abrigo dos Fiéis: pode receber abrigo e auxílio em templos da sua fé.' },
  { name: 'Charlatão', skills: ['Enganação', 'Prestidigitação'], detail: 'Kit de disfarce e kit de falsificação.', feature: 'Identidade Falsa: mantém uma identidade alternativa com documentos e contatos.' },
  { name: 'Criminoso', skills: ['Enganação', 'Furtividade'], detail: 'Um tipo de jogo ou ferramentas de ladrão.', feature: 'Contato Criminal: tem um contato confiável na rede criminosa.' },
  { name: 'Artista', skills: ['Acrobacia', 'Atuação'], detail: 'Instrumento musical e favor de admiradores.', feature: 'Pela Popularidade: pode encontrar hospedagem e apresentações entre admiradores.' },
  { name: 'Herói do Povo', skills: ['Adestrar Animais', 'Sobrevivência'], detail: 'Ferramentas de artesão e veículos terrestres.', feature: 'Hospitalidade Rústica: pessoas comuns oferecem abrigo e auxílio modesto.' },
  { name: 'Artesão de Guilda', skills: ['Intuição', 'Persuasão'], detail: 'Ferramentas de artesão e filiação a uma guilda.', feature: 'Filiação à Guilda: pode obter apoio e contatos profissionais da guilda.' },
  { name: 'Eremita', skills: ['Medicina', 'Religião'], detail: 'Kit de herbalismo e um idioma adicional.', feature: 'Descoberta: seu isolamento levou a uma descoberta importante, definida com a mesa.' },
  { name: 'Nobre', skills: ['História', 'Persuasão'], detail: 'Um conjunto de jogos e um idioma adicional.', feature: 'Posição de Privilégio: pessoas de alta posição tendem a recebê-lo e ajudá-lo.' },
  { name: 'Forasteiro', skills: ['Atletismo', 'Sobrevivência'], detail: 'Um instrumento musical e um idioma adicional.', feature: 'Andarilho: lembra mapas e geografia e encontra comida e água para o grupo.' },
  { name: 'Sábio', skills: ['Arcanismo', 'História'], detail: 'Dois idiomas adicionais.', feature: 'Pesquisador: sabe onde buscar informação e como acessar bibliotecas e especialistas.' },
  { name: 'Marinheiro', skills: ['Atletismo', 'Percepção'], detail: 'Ferramentas de navegador e veículos aquáticos.', feature: 'Passagem de Navio: consegue passagem em embarcações para si e companheiros.' },
  { name: 'Soldado', skills: ['Atletismo', 'Intimidação'], detail: 'Um conjunto de jogos e veículos terrestres.', feature: 'Patente Militar: pode solicitar auxílio de soldados e reconhecimento de sua patente.' },
  { name: 'Órfão', skills: ['Prestidigitação', 'Furtividade'], detail: 'Kit de disfarce e ferramentas de ladrão.', feature: 'Segredos da Cidade: encontra rotas e passagens escondidas em ambientes urbanos.' },
  { name: 'Investigador', skills: ['Intuição', 'Investigação'], detail: 'Ferramentas de ladrão e um idioma adicional.', feature: 'Olho para Detalhes: identifica pistas e conexões que outras pessoas ignoram.' },
];

const baseStats: Record<Ability, number> = { for: 15, des: 14, con: 13, int: 12, sab: 10, car: 8 };
const abilityModifier = (score: number) => Math.floor((score - 10) / 2);
const asFeature = (category: CharacterFeature['category'], name: string, description: string): CharacterFeature => ({ category, name, description, unlockedAt: 1 });
const asSpell = (name: string, level: number, description: string): Spell => ({ name, level, description, uses: 0 });

export type CharacterDraftInput = {
  name: string;
  className: string;
  ancestry: string;
  subrace: string;
  subclass: string;
  background: string;
  selectedClassSkills: string[];
};

export function createCharacterFromOptions(input: CharacterDraftInput, id: string): Character {
  const race = raceOptions.find(option => option.name === input.ancestry) ?? raceOptions.find(option => option.name === 'Humano')!;
  const raceVariant = race.variants.find(option => option.name === input.subrace) ?? race.variants[0];
  const characterClass = classOptions.find(option => option.name === input.className) ?? classOptions.find(option => option.name === 'Ladino')!;
  const background = backgroundOptions.find(option => option.name === input.background) ?? backgroundOptions[0];
  const abilities = { ...baseStats };
  for (const key of abilityKeys) abilities[key] = Math.min(20, abilities[key] + (race.bonuses?.[key] ?? 0) + (raceVariant.bonuses[key] ?? 0));
  const features: CharacterFeature[] = [
    ...(race.traits ?? []).map(([name, description]) => asFeature('Ancestralidade', name, description)),
    ...raceVariant.traits.map(([name, description]) => asFeature('Ancestralidade', name, description)),
    ...characterClass.features.map(([name, description]) => asFeature('Classe', name, description)),
    asFeature('Antecedente', background.name, `${background.feature} Proficiências: ${background.skills.join(', ')}. ${background.detail}`),
  ];
  if (['Clérigo', 'Feiticeiro', 'Bruxo'].includes(input.className) && input.subclass !== '—') {
    features.push(asFeature('Subclasse', input.subclass, `Esta subclasse concede características próprias ao nível 1. Consulte as escolhas e regras específicas da campanha para ${input.subclass}.`));
  }
  const racialSkills = race.name === 'Elfo' ? ['Percepção']
    : race.name === 'Meio-Elfo' ? ['Percepção', 'Intuição']
      : race.name === 'Humano' && input.subrace === 'Variante' ? ['Atuação']
        : race.name === 'Kenku' ? ['Furtividade', 'Enganação']
          : race.name === 'Golias' ? ['Atletismo']
            : race.name === 'Owlin' ? ['Furtividade']
              : [];
  const skills = [...new Set([...racialSkills, ...background.skills, ...input.selectedClassSkills])];
  const classProficiencies: Record<string, string[]> = {
    Bárbaro: ['Armaduras leves e médias', 'Escudos', 'Armas simples e marciais'],
    Bardo: ['Armaduras leves', 'Armas simples', 'Besta de mão', 'Espada longa', 'Rapieira', 'Espada curta', 'Três instrumentos musicais'],
    Bruxo: ['Armaduras leves', 'Armas simples'],
    Clérigo: ['Armaduras leves e médias', 'Escudos', 'Armas simples'],
    Druida: ['Armaduras leves e médias (não metálicas)', 'Escudos (não metálicos)', 'Armas simples'],
    Guerreiro: ['Todas as armaduras', 'Escudos', 'Armas simples e marciais'],
    Ladino: ['Armaduras leves', 'Armas simples', 'Besta de mão', 'Espada longa', 'Rapieira', 'Espada curta', 'Ferramentas de ladrão'],
    Mago: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas leves'],
    Monge: ['Armas simples', 'Espadas curtas'],
    Paladino: ['Todas as armaduras', 'Escudos', 'Armas simples e marciais'],
    Patrulheiro: ['Armaduras leves e médias', 'Escudos', 'Armas simples e marciais'],
    Feiticeiro: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas leves'],
  };
  const racialProficiencies = race.name === 'Anão' ? ['Ferramentas de ferreiro, cervejeiro ou pedreiro (conforme a sub-raça)']
    : race.name === 'Elfo' ? ['Armas élficas da sub-raça']
      : race.name === 'Meio-Elfo' ? ['Um idioma adicional']
        : race.name === 'Humano' ? ['Um idioma adicional']
          : race.name === 'Tabaxi' ? ['Percepção', 'Furtividade']
            : [];
  const maxHp = characterClass.hitDie + abilityModifier(abilities.con);
  const armorBase = input.className === 'Bárbaro' ? 10 + abilityModifier(abilities.con) : 10;
  const armorWis = input.className === 'Monge';
  const slots = ['Bardo', 'Clérigo', 'Druida', 'Feiticeiro', 'Mago'].includes(input.className) ? [2] : input.className === 'Bruxo' ? [1] : [];
  const initialSpellOptions: Record<string, Spell[]> = {
    Bardo: [
      asSpell('Zombaria Viciosa', 0, 'Uma provocação mágica causa dano psíquico e pode impor desvantagem no próximo ataque.'),
      asSpell('Mãos Mágicas', 0, 'Cria uma mão espectral para manipular objetos leves à distância.'),
      asSpell('Palavra Curativa', 1, 'Uma ação bônus restaura pontos de vida de uma criatura ao alcance.'),
      asSpell('Enfeitiçar Pessoa', 1, 'Tenta enfeitiçar um humanoide que falha no teste de resistência.'),
      asSpell('Onda Trovejante', 1, 'Uma onda de som causa dano e pode empurrar criaturas próximas.'),
      asSpell('Fogo das Fadas', 1, 'Revela criaturas em uma área e facilita ataques contra elas.'),
    ],
    Clérigo: [
      asSpell('Chama Sagrada', 0, 'Uma criatura recebe dano radiante após falhar em um teste de Destreza.'),
      asSpell('Orientação', 0, 'Uma criatura tocada soma 1d4 a um teste de habilidade antes da magia terminar.'),
      asSpell('Taumaturgia', 0, 'Manifesta pequenos sinais sobrenaturais, como alterar a voz ou fazer portas baterem.'),
      asSpell('Curar Ferimentos', 1, 'Uma criatura tocada recupera pontos de vida.'),
      asSpell('Bênção', 1, 'Até três aliados somam 1d4 a ataques e testes de resistência.'),
      asSpell('Raio Guia', 1, 'Um ataque mágico causa dano radiante e facilita o próximo ataque contra o alvo.'),
    ],
    Druida: [
      asSpell('Orientação', 0, 'Uma criatura tocada soma 1d4 a um teste de habilidade antes da magia terminar.'),
      asSpell('Chicote de Espinhos', 0, 'Um ataque mágico causa dano perfurante e pode puxar a criatura.'),
      asSpell('Curar Ferimentos', 1, 'Uma criatura tocada recupera pontos de vida.'),
      asSpell('Fogo das Fadas', 1, 'Revela criaturas em uma área e facilita ataques contra elas.'),
    ],
    Feiticeiro: [
      asSpell('Raio de Fogo', 0, 'Um ataque mágico à distância causa dano de fogo.'),
      asSpell('Prestidigitação', 0, 'Cria pequenos efeitos mágicos sensoriais e inofensivos.'),
      asSpell('Mãos Mágicas', 0, 'Cria uma mão espectral para manipular objetos leves à distância.'),
      asSpell('Raio de Gelo', 0, 'Um ataque mágico à distância causa dano gélido e reduz o deslocamento do alvo.'),
      asSpell('Mísseis Mágicos', 1, 'Cria dardos de energia que atingem automaticamente seus alvos.'),
      asSpell('Escudo Arcano', 1, 'Uma reação concede bônus temporário à CA e bloqueia Mísseis Mágicos.'),
    ],
    Bruxo: [
      asSpell('Rajada Mística', 0, 'Dispara um raio de energia mágica em um ataque à distância.'),
      asSpell('Ilusão Menor', 0, 'Cria um som ou uma imagem estática pequena.'),
      asSpell('Bruxaria', 1, 'Amaldiçoa uma criatura para causar dano adicional quando você a atinge.'),
      asSpell('Armadura de Agathys', 1, 'Recebe pontos de vida temporários e causa dano de frio a quem o atingir corpo a corpo.'),
    ],
    Mago: [
      asSpell('Raio de Gelo', 0, 'Um ataque mágico à distância causa dano gélido e reduz o deslocamento do alvo.'),
      asSpell('Prestidigitação', 0, 'Cria pequenos efeitos mágicos sensoriais e inofensivos.'),
      asSpell('Mãos Mágicas', 0, 'Cria uma mão espectral para manipular objetos leves à distância.'),
      asSpell('Mísseis Mágicos', 1, 'Cria dardos de energia que atingem automaticamente seus alvos.'),
      asSpell('Armadura Arcana', 1, 'Protege uma criatura sem armadura, definindo sua CA enquanto a magia durar.'),
      asSpell('Encontrar Familiar', 1, 'Invoca um espírito que assume a forma de um animal pequeno e o auxilia.'),
      asSpell('Sono', 1, 'Coloca criaturas com poucos pontos de vida para dormir magicamente.'),
      asSpell('Onda Trovejante', 1, 'Uma onda de som causa dano e pode empurrar criaturas próximas.'),
      asSpell('Disfarçar-se', 1, 'Muda a aparência física do conjurador por um período.'),
    ],
  };
  const initialSpells = [...(initialSpellOptions[input.className] ?? [])];
  if (input.className === 'Clérigo' || input.className === 'Druida') {
    const preparedCount = Math.max(0, 1 + abilityModifier(abilities.sab));
    const cantripCount = input.className === 'Clérigo' ? 3 : 2;
    initialSpells.splice(0, initialSpells.length, ...initialSpells.filter(spell => spell.level === 0).slice(0, cantripCount), ...initialSpells.filter(spell => spell.level > 0).slice(0, preparedCount));
  } else if (input.className === 'Bardo') {
    initialSpells.splice(0, initialSpells.length, ...initialSpells.filter(spell => spell.level === 0).slice(0, 2), ...initialSpells.filter(spell => spell.level > 0).slice(0, 4));
  } else if (input.className === 'Feiticeiro') {
    initialSpells.splice(0, initialSpells.length, ...initialSpells.filter(spell => spell.level === 0).slice(0, 4), ...initialSpells.filter(spell => spell.level > 0).slice(0, 2));
  } else if (input.className === 'Bruxo') {
    initialSpells.splice(0, initialSpells.length, ...initialSpells.filter(spell => spell.level === 0).slice(0, 2), ...initialSpells.filter(spell => spell.level > 0).slice(0, 2));
  } else if (input.className === 'Mago') {
    initialSpells.splice(0, initialSpells.length, ...initialSpells.filter(spell => spell.level === 0).slice(0, 3), ...initialSpells.filter(spell => spell.level > 0).slice(0, 6));
  }
  const classSkills = input.selectedClassSkills.filter(skill => characterClass.skillOptions.includes(skill)).slice(0, characterClass.skillCount);
  return {
    id,
    name: input.name.trim() || 'Novo aventureiro',
    className: input.className,
    ancestry: race.name,
    subrace: input.subrace,
    subclass: input.subclass || '—',
    background: background.name,
    alignment: 'Neutro',
    player: '',
    speed: `${raceVariant.speed} m`,
    level: 1,
    abilities,
    hp: maxHp,
    maxHp,
    hitDie: characterClass.hitDie,
    armorBase,
    armorDex: input.className !== 'Mago' && input.className !== 'Feiticeiro' && input.className !== 'Clérigo',
    armorWis,
    skills,
    proficiencies: [...new Set([...(classProficiencies[input.className] ?? []), ...racialProficiencies, background.detail])],
    savingThrows: characterClass.saves,
    features,
    resources: { kiPoints: 0, sorceryPoints: 0 },
    color: characterClass.color,
    slots,
    usedSlots: slots.map(() => 0),
    spells: initialSpells,
    spellcastingAbility: characterClass.spellAbility,
    notes: `${input.subrace} · ${background.name}. Ajuste equipamento, perícias e magias conforme a campanha.`,
  };
}
