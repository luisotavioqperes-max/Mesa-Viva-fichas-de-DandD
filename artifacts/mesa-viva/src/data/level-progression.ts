import type { Ability, Character, CharacterFeature, Spell } from './character-sheets';

export type SpellChoice = {
  kind: 'cantrip' | 'known' | 'prepared' | 'magical secret';
  maxLevel: number;
};

const makeSpell = (name: string, level: number, description: string): Spell => ({
  name,
  level,
  description,
  uses: 0,
});

const makeFeature = (
  category: CharacterFeature['category'],
  name: string,
  description: string,
  unlockedAt: number,
  resource?: CharacterFeature['resource'],
): CharacterFeature => ({ category, name, description, unlockedAt, ...(resource ? { resource } : {}) });

const abilityImprovementLevels: Record<string, number[]> = {
  Ladino: [4, 8, 10, 12, 16, 19],
};

export const hasAbilityImprovement = (className: string, level: number) =>
  (abilityImprovementLevels[className] ?? [4, 8, 12, 16, 19]).includes(level);

const maxSpellCircle = (className: string, level: number) => {
  if (className === 'Bruxo') {
    if (level >= 9) return 5;
    if (level >= 7) return 4;
    if (level >= 5) return 3;
    if (level >= 3) return 2;
    return 1;
  }
  if (['Paladino', 'Patrulheiro', 'Artífice'].includes(className)) return Math.min(5, Math.ceil(level / 4));
  return Math.min(9, Math.floor((level + 1) / 2));
};

const spellsKnownAtLevel: Record<string, number[]> = {
  Bardo: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
  Feiticeiro: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
  Bruxo: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
  Patrulheiro: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
  Mago: Array.from({ length: 20 }, (_, level) => 6 + level * 2),
};

export function spellChoicesAtLevel(character: Character, nextLevel: number, nextAbilities: Record<Ability, number>): SpellChoice[] {
  const className = character.className;
  const choices: SpellChoice[] = [];
  const maxLevel = maxSpellCircle(className, nextLevel);

  if (['Bardo', 'Clérigo', 'Druida', 'Feiticeiro', 'Mago'].includes(className) && [4, 10].includes(nextLevel)
    || className === 'Artífice' && nextLevel === 10) {
    choices.push({ kind: 'cantrip', maxLevel: 0 });
  }

  const preparedAbility: Ability | undefined = ['Clérigo', 'Druida'].includes(className) ? 'sab'
    : className === 'Paladino' ? 'car'
      : className === 'Artífice' ? 'int' : undefined;
  if (preparedAbility) {
    const currentPrepared = character.spells.filter(spell => spell.level > 0).length;
    const nextPrepared = className === 'Paladino'
      ? Math.max(0, Math.floor(nextLevel / 2) + Math.floor((nextAbilities.car - 10) / 2))
      : className === 'Artífice'
        ? Math.max(1, Math.floor(nextLevel / 2)) + Math.floor((nextAbilities.int - 10) / 2)
        : nextLevel + Math.floor((nextAbilities[preparedAbility] - 10) / 2);
    for (let count = currentPrepared; count < nextPrepared; count += 1) {
      choices.push({ kind: 'prepared', maxLevel });
    }
  } else {
    const knownAtLevel = spellsKnownAtLevel[className];
    if (knownAtLevel) {
      const currentKnown = character.spells.filter(spell => spell.level > 0).length;
      const additional = Math.max(0, (knownAtLevel[nextLevel - 1] ?? currentKnown) - currentKnown);
      const magicalSecrets = className === 'Bardo' && [10, 14, 18].includes(nextLevel);
      for (let count = 0; count < additional; count += 1) {
        choices.push({ kind: magicalSecrets ? 'magical secret' : 'known', maxLevel });
      }
    }
  }

  return choices;
}

const spellOptions: Record<string, Spell[]> = {
  Feiticeiro: [
    makeSpell('Prestidigitação', 0, 'Cria pequenos efeitos mágicos sensoriais e inofensivos por um período breve.'),
    makeSpell('Mãos Mágicas', 0, 'Cria uma mão espectral para manipular objetos leves à distância.'),
    makeSpell('Raio de Gelo', 0, 'Ataque mágico à distância que causa dano gélido e reduz o deslocamento do alvo.'),
    makeSpell('Toque Chocante', 0, 'Um ataque mágico corpo a corpo causa dano elétrico e pode impedir reações do alvo.'),
    makeSpell('Escudo Arcano', 1, 'Uma reação concede bônus temporário à CA e bloqueia Mísseis Mágicos.'),
    makeSpell('Armadura Arcana', 1, 'Protege uma criatura sem armadura, definindo sua CA enquanto a magia durar.'),
    makeSpell('Onda Trovejante', 1, 'Uma onda trovejante causa dano em uma área próxima e pode empurrar criaturas.'),
    makeSpell('Passo das Brumas', 2, 'Teletransporta você para um espaço desocupado visível a curta distância.'),
    makeSpell('Raio Ardente', 2, 'Dispara três raios de fogo que podem atingir o mesmo alvo ou alvos diferentes.'),
    makeSpell('Sugestão', 2, 'Sugere um curso de ação a uma criatura que falha no teste de resistência.'),
    makeSpell('Bola de Fogo', 3, 'Uma explosão de fogo causa dano em uma grande área.'),
    makeSpell('Contramágica', 3, 'Interrompe uma magia sendo conjurada; magias mais poderosas podem exigir um teste.'),
    makeSpell('Relâmpago', 3, 'Uma linha de relâmpago causa dano elétrico às criaturas no caminho.'),
    makeSpell('Invisibilidade Maior', 4, 'Torna uma criatura invisível mesmo enquanto ela ataca ou conjura magias.'),
    makeSpell('Cone de Frio', 5, 'Uma rajada cônica de frio causa dano e pode congelar criaturas.'),
  ],
  Bardo: [
    makeSpell('Mensagem', 0, 'Sussurra uma mensagem que somente uma criatura escolhida pode ouvir.'),
    makeSpell('Ilusão Menor', 0, 'Cria um som ou uma imagem estática pequena para distrair ou enganar.'),
    makeSpell('Palavra Curativa', 1, 'Uma ação bônus restaura pontos de vida de uma criatura ao alcance.'),
    makeSpell('Dissonância Sussurrante', 1, 'Uma melodia dolorosa causa dano psíquico e pode fazer o alvo se afastar.'),
    makeSpell('Fada de Fogo', 1, 'Contorna criaturas em uma área com luz, revelando-as e facilitando ataques contra elas.'),
    makeSpell('Estilhaçar', 2, 'Um som súbito causa dano trovejante às criaturas em uma área.'),
    makeSpell('Silêncio', 2, 'Cria uma esfera sem som que impede ruídos e dificulta conjurações verbais.'),
    makeSpell('Sugestão', 2, 'Sugere um curso de ação a uma criatura que falha no teste de resistência.'),
    makeSpell('Padrão Hipnótico', 3, 'Um padrão de luzes pode enfeitiçar e incapacitar criaturas que o observam.'),
    makeSpell('Porta Dimensional', 4, 'Teletransporta você e uma criatura próxima para um local distante.'),
    makeSpell('Imobilizar Monstro', 5, 'Paralisa uma criatura que falha no teste de resistência.'),
  ],
  Clérigo: [
    makeSpell('Orientação', 0, 'Uma criatura tocada soma 1d4 a um teste de habilidade antes da magia terminar.'),
    makeSpell('Resistência', 0, 'Uma criatura tocada soma 1d4 a um teste de resistência escolhido.'),
    makeSpell('Taumaturgia', 0, 'Manifesta pequenos sinais sobrenaturais, como alterar a voz ou fazer portas baterem.'),
    makeSpell('Bênção', 1, 'Até três aliados somam 1d4 a ataques e testes de resistência.'),
    makeSpell('Palavra Curativa', 1, 'Uma ação bônus restaura pontos de vida de uma criatura ao alcance.'),
    makeSpell('Raio Guia', 1, 'Um ataque mágico causa dano radiante e concede vantagem no próximo ataque contra o alvo.'),
    makeSpell('Arma Espiritual', 2, 'Cria uma arma mágica que ataca usando uma ação bônus, sem exigir concentração.'),
    makeSpell('Restauração Menor', 2, 'Encerra uma doença ou uma condição que aflige uma criatura tocada.'),
    makeSpell('Guardiões Espirituais', 3, 'Espíritos protegem uma área ao seu redor e ferem inimigos que se aproximam.'),
    makeSpell('Revivificar', 3, 'Traz de volta à vida uma criatura que morreu há pouco tempo.'),
    makeSpell('Coluna de Chamas', 5, 'Uma coluna de fogo sagrado causa dano em uma área escolhida.'),
  ],
  Bruxo: [
    makeSpell('Rajada Mística', 0, 'Dispara um raio de energia mágica que causa dano de energia em um ataque à distância.'),
    makeSpell('Ilusão Menor', 0, 'Cria um som ou uma imagem estática pequena para distrair ou enganar.'),
    makeSpell('Armadura de Agathys', 1, 'Recebe pontos de vida temporários e causa dano de frio a quem o atingir corpo a corpo.'),
    makeSpell('Repreensão Infernal', 1, 'Uma reação envolve o atacante em chamas e causa dano de fogo.'),
    makeSpell('Imobilizar Pessoa', 2, 'Paralisa um humanoide que falha no teste de resistência.'),
    makeSpell('Passo das Brumas', 2, 'Teletransporta você para um espaço desocupado visível a curta distância.'),
    makeSpell('Contramágica', 3, 'Interrompe uma magia sendo conjurada; magias mais poderosas podem exigir um teste.'),
    makeSpell('Fome de Hadar', 3, 'Abre uma esfera de escuridão e frio sobrenatural que fere e restringe a visão.'),
    makeSpell('Banimento', 4, 'Remove temporariamente uma criatura do plano em que se encontra.'),
    makeSpell('Enervação', 5, 'Um feixe necrótico causa dano e pode restaurar seus pontos de vida.'),
  ],
  Druida: [
    makeSpell('Chicote de Espinhos', 0, 'Um ataque mágico causa dano perfurante e pode puxar a criatura.'),
    makeSpell('Orientação', 0, 'Uma criatura tocada soma 1d4 a um teste de habilidade antes da magia terminar.'),
    makeSpell('Enredar', 1, 'Plantas prendem criaturas em uma área que falham no teste de Força.'),
    makeSpell('Onda Trovejante', 1, 'Uma onda de som causa dano e pode empurrar criaturas próximas.'),
    makeSpell('Pele de Árvore', 2, 'A pele de uma criatura fica resistente, concedendo CA mínima enquanto a magia durar.'),
    makeSpell('Passo das Brumas', 2, 'Teletransporta você para um espaço desocupado visível a curta distância.'),
    makeSpell('Relâmpago', 3, 'Uma linha de relâmpago causa dano elétrico às criaturas no caminho.'),
    makeSpell('Conjurar Animais', 3, 'Invoca espíritos feéricos que assumem formas de animais.'),
    makeSpell('Praga', 5, 'Drena vigor de criaturas em uma área com energia necrótica.'),
  ],
  Paladino: [
    makeSpell('Bênção', 1, 'Até três aliados somam 1d4 a ataques e testes de resistência.'),
    makeSpell('Escudo da Fé', 1, 'Uma criatura recebe +2 na CA enquanto a magia durar.'),
    makeSpell('Comando', 1, 'Dá uma ordem de uma palavra a uma criatura que falha no teste de resistência.'),
    makeSpell('Arma Mágica', 2, 'Uma arma recebe bônus em ataques e dano e passa a ser mágica.'),
    makeSpell('Restauração Menor', 2, 'Encerra uma doença ou uma condição que aflige uma criatura tocada.'),
    makeSpell('Aceleração', 3, 'Uma criatura recebe mais velocidade, CA e uma ação adicional limitada.'),
    makeSpell('Dissipar Magia', 3, 'Encerra uma magia em uma criatura, objeto ou efeito.'),
  ],
  Patrulheiro: [
    makeSpell('Marca do Caçador', 1, 'Marca um alvo para causar dano adicional e rastreá-lo.'),
    makeSpell('Curar Ferimentos', 1, 'Uma criatura tocada recupera pontos de vida.'),
    makeSpell('Passos Longos', 1, 'Aumenta o deslocamento de uma criatura.'),
    makeSpell('Passo das Brumas', 2, 'Teletransporta você para um espaço desocupado visível a curta distância.'),
    makeSpell('Crescimento de Espinhos', 2, 'Transforma o terreno em uma área coberta por espinhos camuflados.'),
    makeSpell('Conjurar Animais', 3, 'Invoca espíritos feéricos que assumem formas de animais.'),
    makeSpell('Liberdade de Movimento', 4, 'Impede que terreno difícil e efeitos mágicos restrinjam os movimentos da criatura.'),
  ],
  Mago: [
    makeSpell('Prestidigitação', 0, 'Cria pequenos efeitos mágicos sensoriais e inofensivos por um período breve.'),
    makeSpell('Raio de Gelo', 0, 'Ataque mágico à distância que causa dano gélido e reduz o deslocamento do alvo.'),
    makeSpell('Mãos Mágicas', 0, 'Cria uma mão espectral para manipular objetos leves à distância.'),
    makeSpell('Escudo Arcano', 1, 'Uma reação concede bônus temporário à CA e bloqueia Mísseis Mágicos.'),
    makeSpell('Sono', 1, 'Coloca criaturas com poucos pontos de vida para dormir magicamente.'),
    makeSpell('Detectar Magia', 1, 'Percebe a presença de magia próxima e identifica sua aura.'),
    makeSpell('Imagem Espelhada', 2, 'Cria duplicatas ilusórias que podem fazer ataques errarem você.'),
    makeSpell('Teia', 2, 'Cria teias que tornam uma área difícil de atravessar e podem prender criaturas.'),
    makeSpell('Bola de Fogo', 3, 'Uma explosão de fogo causa dano em uma grande área.'),
    makeSpell('Contramágica', 3, 'Interrompe uma magia sendo conjurada; magias mais poderosas podem exigir um teste.'),
    makeSpell('Porta Dimensional', 4, 'Teletransporta você e uma criatura próxima para um local distante.'),
    makeSpell('Cone de Frio', 5, 'Uma rajada cônica de frio causa dano e pode congelar criaturas.'),
  ],
};

export function spellSuggestions(character: Character, choice: SpellChoice): Spell[] {
  const existingNames = new Set(character.spells.map(spell => spell.name.toLocaleLowerCase('pt-BR')));
  const suggestions = choice.kind === 'magical secret'
    ? Object.values(spellOptions).flat()
    : spellOptions[character.className] ?? [];
  return [...character.spells, ...suggestions]
    .filter(spell => choice.kind === 'cantrip' ? spell.level === 0 : spell.level > 0 && spell.level <= choice.maxLevel)
    .filter((spell, index, list) => !existingNames.has(spell.name.toLocaleLowerCase('pt-BR')) && list.findIndex(candidate => candidate.name === spell.name) === index);
}

const classUnlocks: Record<string, Record<number, CharacterFeature[]>> = {
  Ladino: {
    5: [makeFeature('Classe', 'Esquiva Sobrenatural', 'Usa sua reação para reduzir pela metade o dano de um ataque que consiga ver.', 5)],
    6: [makeFeature('Classe', 'Perícia Adicional', 'Escolhe mais duas perícias ou ferramentas para receber o benefício de Perícia.', 6)],
    7: [makeFeature('Classe', 'Evasão', 'Em efeitos que permitem teste de Destreza para reduzir dano, sofre metade em caso de falha e nenhum dano em caso de sucesso.', 7)],
    11: [makeFeature('Classe', 'Talento Confiável', 'Em testes de habilidade com proficiência, resultados menores que 10 no d20 contam como 10.', 11)],
    14: [makeFeature('Classe', 'Sentido Cego', 'Percebe a localização de criaturas escondidas ou invisíveis próximas, desde que não esteja surdo.', 14)],
    15: [makeFeature('Classe', 'Mente Escorregadia', 'Ganha proficiência em testes de resistência de Sabedoria.', 15)],
    18: [makeFeature('Classe', 'Elusivo', 'Enquanto não estiver incapacitado, nenhum ataque contra você tem vantagem.', 18)],
    20: [makeFeature('Classe', 'Golpe de Sorte', 'Uma vez por descanso curto ou longo, transforma um ataque que errou em acerto ou um teste falho em resultado 20.', 20)],
  },
  Feiticeiro: {
    2: [makeFeature('Classe', 'Fonte de Magia', 'Ganha pontos de feitiçaria iguais ao nível de feiticeiro; pode gastá-los para criar espaços ou alimentar Metamagia.', 2, 'sorceryPoints')],
    10: [makeFeature('Classe', 'Metamagia Adicional', 'Escolhe uma opção adicional de Metamagia para alterar suas conjurações.', 10)],
    20: [makeFeature('Classe', 'Restauração Feiticeira', 'Recupera 4 pontos de feitiçaria gastos após um descanso curto.', 20)],
  },
  Clérigo: {
    5: [makeFeature('Classe', 'Destruir Mortos-Vivos', 'Mortos-vivos que falham no teste contra seu Canalizar Divindade são destruídos se estiverem abaixo do limite de desafio da classe.', 5)],
    6: [makeFeature('Classe', 'Canalizar Divindade Aprimorado', 'Pode usar Canalizar Divindade duas vezes entre descansos, em vez de uma.', 6)],
    10: [makeFeature('Classe', 'Intervenção Divina', 'Pode pedir intervenção à sua divindade; a chance de sucesso aumenta conforme o nível.', 10)],
    18: [makeFeature('Classe', 'Canalizar Divindade: Três Usos', 'Pode usar Canalizar Divindade três vezes entre descansos.', 18)],
    20: [makeFeature('Classe', 'Intervenção Divina Aprimorada', 'Sua Intervenção Divina funciona automaticamente, sem rolagem.', 20)],
  },
  Bruxo: {
    5: [makeFeature('Classe', 'Invocação Mística Adicional', 'Escolhe uma invocação mística adicional entre as opções disponíveis para o nível.', 5)],
    11: [makeFeature('Classe', 'Arcano Místico (6º Círculo)', 'Escolhe uma magia de 6º círculo como arcano místico; pode conjurá-la uma vez sem gastar espaço por descanso longo.', 11)],
    13: [makeFeature('Classe', 'Arcano Místico (7º Círculo)', 'Escolhe uma magia de 7º círculo como arcano místico; pode conjurá-la uma vez sem gastar espaço por descanso longo.', 13)],
    15: [
      makeFeature('Classe', 'Arcano Místico (8º Círculo)', 'Escolhe uma magia de 8º círculo como arcano místico; pode conjurá-la uma vez sem gastar espaço por descanso longo.', 15),
      makeFeature('Classe', 'Invocação Mística Adicional', 'Escolhe uma invocação mística adicional entre as opções disponíveis para o nível.', 15),
    ],
    17: [makeFeature('Classe', 'Arcano Místico (9º Círculo)', 'Escolhe uma magia de 9º círculo como arcano místico; pode conjurá-la uma vez sem gastar espaço por descanso longo.', 17)],
    18: [makeFeature('Classe', 'Invocação Mística Adicional', 'Escolhe uma invocação mística adicional entre as opções disponíveis para o nível.', 18)],
    20: [makeFeature('Classe', 'Mestre Místico', 'Uma vez por descanso longo, pode implorar ao patrono para recuperar todos os espaços de Magia Pactual.', 20)],
  },
  Monge: {
    2: [makeFeature('Classe', 'Ki', 'Ganha pontos de Ki iguais ao nível de monge e aprende Rajada de Golpes, Defesa Paciente e Passo do Vento.', 2, 'kiPoints')],
    4: [makeFeature('Classe', 'Queda Lenta', 'Usa sua reação ao cair para reduzir o dano de queda em cinco vezes seu nível de monge.', 4)],
    5: [
      makeFeature('Classe', 'Ataque Extra', 'Pode atacar duas vezes, em vez de uma, sempre que usar a ação Atacar no seu turno.', 5),
      makeFeature('Classe', 'Golpe Atordoante', 'Gasta 1 ponto de Ki ao acertar para tentar atordoar o alvo com um teste de resistência de Constituição.', 5),
    ],
    6: [makeFeature('Classe', 'Golpes Potencializados por Ki', 'Seus ataques desarmados contam como mágicos para superar resistência e imunidade a dano não mágico.', 6)],
    7: [
      makeFeature('Classe', 'Evasão', 'Em efeitos que permitem teste de Destreza para reduzir dano, sofre metade em caso de falha e nenhum dano em caso de sucesso.', 7),
      makeFeature('Classe', 'Quietude da Mente', 'Usa uma ação para encerrar em si mesmo as condições amedrontado ou enfeitiçado.', 7),
    ],
    9: [makeFeature('Classe', 'Movimento sem Armadura Aprimorado', 'Pode correr por superfícies verticais e atravessar líquidos durante seu movimento, sem cair durante esse deslocamento.', 9)],
    10: [makeFeature('Classe', 'Pureza Corporal', 'Torna-se imune a doenças e venenos.', 10)],
    13: [makeFeature('Classe', 'Língua do Sol e da Lua', 'Compreende todos os idiomas falados e pode ser compreendido por qualquer criatura que entenda um idioma.', 13)],
    14: [makeFeature('Classe', 'Alma de Diamante', 'Ganha proficiência em todos os testes de resistência e pode gastar 1 ponto de Ki para repetir um teste que falhou.', 14)],
    15: [makeFeature('Classe', 'Corpo Atemporal', 'Não sofre as fragilidades da velhice e não pode envelhecer magicamente; ainda precisa de comida e água.', 15)],
    18: [makeFeature('Classe', 'Corpo Vazio', 'Gasta Ki para ficar invisível e resistente a dano, ou para conjurar Projeção Astral.', 18)],
    20: [makeFeature('Classe', 'Eu Perfeito', 'Ao rolar iniciativa e não ter pontos de Ki, recupera 4 pontos.', 20)],
  },
  Bardo: {
    5: [makeFeature('Classe', 'Fonte de Inspiração', 'Recupera todos os usos de Inspiração Bárdica em um descanso curto ou longo.', 5)],
    6: [makeFeature('Classe', 'Contracanto', 'Usa uma ação para iniciar uma atuação que dá vantagem a aliados próximos contra efeitos de medo ou encantamento.', 6)],
    10: [
      makeFeature('Classe', 'Perícia Adicional', 'Escolhe duas perícias para receber o benefício de Perícia.', 10),
      makeFeature('Classe', 'Segredos Mágicos', 'Aprende duas magias de qualquer lista de classe; elas contam como magias de bardo.', 10),
    ],
    14: [makeFeature('Classe', 'Segredos Mágicos Adicionais', 'Aprende duas magias de qualquer lista de classe; elas contam como magias de bardo.', 14)],
    18: [makeFeature('Classe', 'Segredos Mágicos Adicionais', 'Aprende duas magias de qualquer lista de classe; elas contam como magias de bardo.', 18)],
    20: [makeFeature('Classe', 'Inspiração Superior', 'Quando rola iniciativa sem nenhum uso de Inspiração Bárdica restante, recupera um uso.', 20)],
  },
  Bárbaro: {
    5: [makeFeature('Classe', 'Ataque Extra', 'Pode atacar duas vezes, em vez de uma, sempre que usar a ação Atacar no seu turno.' , 5), makeFeature('Classe', 'Movimento Rápido', 'Seu deslocamento aumenta em 3 m enquanto não estiver usando armadura pesada.', 5)],
    7: [makeFeature('Classe', 'Instinto Feral', 'Tem vantagem nas rolagens de iniciativa e pode agir normalmente se começar o combate surpreso, desde que entre em fúria.', 7)],
    9: [makeFeature('Classe', 'Crítico Brutal', 'Rola um dado de dano adicional da arma ao conseguir um acerto crítico corpo a corpo.', 9)],
    11: [makeFeature('Classe', 'Fúria Implacável', 'Seus pontos de vida não caem abaixo de 1 quando a fúria permite resistir a um golpe fatal.', 11)],
    15: [makeFeature('Classe', 'Fúria Persistente', 'Sua fúria só termina se ficar inconsciente ou decidir encerrá-la.', 15)],
    18: [makeFeature('Classe', 'Força Indomável', 'Se o resultado de um teste de Força for menor que seu valor de Força, pode usar esse valor no lugar.', 18)],
    20: [makeFeature('Classe', 'Campeão Primitivo', 'Força e Constituição aumentam em 4, até o máximo de 24.', 20)],
  },
  Druida: {
    2: [makeFeature('Classe', 'Forma Selvagem', 'Assume a forma de uma fera conhecida, com limites de nível de desafio e duração definidos pela classe.', 2)],
    18: [makeFeature('Classe', 'Magias da Fera', 'Pode conjurar muitas magias de druida mesmo sob uma forma de Forma Selvagem.', 18)],
    20: [makeFeature('Classe', 'Arquidruida', 'Pode usar Forma Selvagem à vontade e conjurar várias magias sem componentes verbais, somáticos ou materiais.', 20)],
  },
  Guerreiro: {
    2: [makeFeature('Classe', 'Surto de Ação', 'Pode realizar uma ação adicional no seu turno uma vez por descanso curto ou longo.', 2)],
    5: [makeFeature('Classe', 'Ataque Extra', 'Pode atacar duas vezes, em vez de uma, sempre que usar a ação Atacar no seu turno.', 5)],
    9: [makeFeature('Classe', 'Indomável', 'Pode repetir um teste de resistência que falhou uma vez por descanso longo.', 9)],
    11: [makeFeature('Classe', 'Ataque Extra (2)', 'Pode atacar três vezes sempre que usar a ação Atacar no seu turno.', 11)],
    13: [makeFeature('Classe', 'Indomável (2 usos)', 'Pode usar Indomável duas vezes entre descansos longos.', 13)],
    17: [makeFeature('Classe', 'Surto de Ação (2 usos)', 'Pode usar Surto de Ação duas vezes antes de precisar de um descanso.', 17)],
    20: [makeFeature('Classe', 'Ataque Extra (3)', 'Pode atacar quatro vezes sempre que usar a ação Atacar no seu turno.', 20)],
  },
  Mago: {
    18: [makeFeature('Classe', 'Maestria em Magia', 'Escolhe uma magia de 1º e uma de 2º círculo para conjurar sem gastar espaços, dentro dos limites da habilidade.', 18)],
    20: [makeFeature('Classe', 'Magias Assinatura', 'Escolhe duas magias de 3º círculo que pode conjurar uma vez cada sem gastar espaço por descanso curto ou longo.', 20)],
  },
  Paladino: {
    2: [makeFeature('Classe', 'Estilo de Luta', 'Escolhe um estilo de combate e pode gastar espaços para causar dano radiante com Destruição Divina.', 2)],
    5: [makeFeature('Classe', 'Ataque Extra', 'Pode atacar duas vezes, em vez de uma, sempre que usar a ação Atacar no seu turno.', 5)],
    6: [makeFeature('Classe', 'Aura de Proteção', 'Você e aliados próximos somam seu modificador de Carisma aos testes de resistência.', 6)],
    10: [makeFeature('Classe', 'Aura de Coragem', 'Você e aliados próximos não podem ficar amedrontados enquanto estiver consciente.', 10)],
    11: [makeFeature('Classe', 'Destruição Divina Aprimorada', 'Seus ataques com arma causam dano radiante adicional.', 11)],
    14: [makeFeature('Classe', 'Toque Purificador', 'Encerra uma magia que afete você ou uma criatura tocada.', 14)],
  },
  Patrulheiro: {
    5: [makeFeature('Classe', 'Ataque Extra', 'Pode atacar duas vezes, em vez de uma, sempre que usar a ação Atacar no seu turno.', 5)],
    8: [makeFeature('Classe', 'Passo da Terra', 'Mover-se por terreno não mágico difícil não custa movimento adicional e plantas não mágicas não o atrasam.', 8)],
    10: [makeFeature('Classe', 'Esconder-se à Vista', 'Prepara camuflagem para receber bônus em testes de Furtividade em um ambiente adequado.', 10)],
    14: [makeFeature('Classe', 'Desaparecer', 'Pode usar Esconder-se como ação bônus e não pode ser rastreado por meios não mágicos.', 14)],
    18: [makeFeature('Classe', 'Sentidos Ferozes', 'Percebe criaturas invisíveis próximas quando não estão escondidas de você.', 18)],
    20: [makeFeature('Classe', 'Matador de Inimigos', 'Soma seu modificador de Sabedoria a um ataque ou dano contra um inimigo favorito.', 20)],
  },
};

const subclassUnlocks: Record<string, Record<number, CharacterFeature[]>> = {
  'Alma Laminada': {
    9: [makeFeature('Subclasse', 'Teleporte Psíquico', 'Gasta um dado de energia psíquica para se teleportar a um espaço desocupado que possa ver.', 9)],
    13: [makeFeature('Subclasse', 'Véu Psíquico', 'Gasta energia psíquica para ficar invisível por um período curto, até atacar ou forçar um teste de resistência.', 13)],
    17: [makeFeature('Subclasse', 'Rasgar a Mente', 'Gasta dados de energia psíquica para tentar atordoar um alvo com dano psíquico.', 17)],
  },
  'Magia Selvagem': {
    6: [makeFeature('Subclasse', 'Curvar a Sorte', 'Gasta pontos de feitiçaria para somar ou subtrair 1d4 de um teste de outra criatura próximo a você.', 6)],
    14: [makeFeature('Subclasse', 'Caos Controlado', 'Quando rola na tabela de Surto de Magia Selvagem, pode rolar duas vezes e escolher o resultado.', 14)],
    18: [makeFeature('Subclasse', 'Bombardeio de Magia', 'Uma vez por turno, quando uma magia causa dano e algum dado mostra seu valor máximo, pode causar dano adicional.', 18)],
  },
  'Domínio do Crepúsculo': {
    6: [makeFeature('Subclasse', 'Passos da Noite', 'Enquanto estiver em penumbra ou escuridão, pode voar temporariamente como ação bônus.', 6)],
    8: [makeFeature('Subclasse', 'Golpe Divino', 'Uma vez por turno, um ataque com arma causa dano radiante adicional.', 8)],
    17: [makeFeature('Subclasse', 'Crepúsculo Protetor', 'A esfera do Santuário do Crepúsculo concede meia cobertura aos aliados dentro dela.', 17)],
  },
  'A Lâmina Maldita': {
    6: [makeFeature('Subclasse', 'Espectro Amaldiçoado', 'Quando derrota um humanoide, pode aprisionar seu espírito como espectro até o próximo descanso longo.', 6)],
    10: [makeFeature('Subclasse', 'Armadura de Hexes', 'Quando o alvo da sua Maldição da Lâmina Maldita acerta você, pode usar sua reação para tentar fazer o ataque errar.', 10)],
    14: [makeFeature('Subclasse', 'Mestre dos Hexes', 'Quando o alvo amaldiçoado morre, pode transferir a Maldição da Lâmina Maldita para outro alvo.', 14)],
  },
  'Caminho do Mestre Embriagado': {
    6: [makeFeature('Subclasse', 'Balanço Tonto', 'Ganha benefícios para escapar de agarrões e pode redirecionar ataques que errem você.', 6)],
    11: [makeFeature('Subclasse', 'Sorte do Bêbado', 'Gasta 2 pontos de Ki para cancelar a desvantagem de um teste de habilidade, ataque ou resistência.', 11)],
    17: [makeFeature('Subclasse', 'Frenesi do Bêbado', 'Gasta Ki para fazer até três ataques adicionais contra alvos diferentes após Rajada de Golpes.', 17)],
  },
  'Colégio da Criação': {
    6: [makeFeature('Subclasse', 'Atuação Animadora', 'Anima temporariamente um objeto não mágico para lutar ao seu lado.', 6)],
    14: [makeFeature('Subclasse', 'Crescendo Criativo', 'Aumenta os limites e a potência da sua Atuação da Criação.', 14)],
  },
};

const subclassFeatureLevels: Record<string, number[]> = {
  Bárbaro: [3, 6, 10, 14],
  Bardo: [3, 6, 14],
  Bruxo: [1, 6, 10, 14],
  Clérigo: [1, 2, 6, 8, 17],
  Druida: [2, 6, 10, 14],
  Guerreiro: [3, 7, 10, 15, 18],
  Ladino: [3, 9, 13, 17],
  Mago: [2, 6, 10, 14],
  Monge: [3, 6, 11, 17],
  Paladino: [3, 7, 15, 20],
  Patrulheiro: [3, 7, 11, 15],
  Feiticeiro: [1, 6, 14, 18],
};

export function featuresUnlockedAtLevel(className: string, subclass: string, level: number): CharacterFeature[] {
  const specific = subclassUnlocks[subclass]?.[level] ?? [];
  const generic = (subclassFeatureLevels[className] ?? []).includes(level) && !specific.length
    ? [makeFeature('Subclasse', `Característica: ${subclass}`, `No nível ${level}, ${subclass} concede uma nova característica de subclasse. Consulte os detalhes da opção selecionada na fonte da campanha.`, level)]
    : [];
  return [
    ...(classUnlocks[className]?.[level] ?? []),
    ...specific,
    ...generic,
  ];
}
