export const PT_DICT: Record<string, string> = {
  overgrow: 'Supercrescimento',
  blaze: 'Chama',
  torrent: 'Torrente',
  'shield-dust': 'Pó Escudo',
  'run-away': 'Fuga',
  'poison-point': 'Ponto Venenoso',
  'Poison Pin Pokémon': 'Pokémon Espinho Venenoso',
  'Seed Pokémon': 'Pokémon Semente',
  'Lizard Pokémon': 'Pokémon Lagarto',
  'Flame Pokémon': 'Pokémon Chama',
  'Tiny Turtle Pokémon': 'Pokémon Tartaruguinha',
  'Turtle Pokémon': 'Pokémon Tartaruga',
  'A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.': 'Uma semente estranha foi plantada em suas costas ao nascer. A planta brota e cresce com este Pokémon.',
  "There is a bud on this POKéMON's back. To support its weight, IVYSAUR's legs and trunk grow thick and strong.": 'Há um bulbo nas costas deste Pokémon. Para suportar seu peso, as pernas e o tronco de Ivysaur crescem grossos e fortes.',
  "There is a large flower on VENUSAUR's back. The flower is said to take on vivid colors if it gets plenty of nutrition and sunlight.": 'Há uma grande flor nas costas de Venusaur. Diz-se que a flor assume cores vivas se receber muita nutrição e luz solar.',
  'The flame that burns at the tip of its tail is an indication of its emotions. The flame wavers when CHARMANDER is enjoying itself.': 'A chama que arde na ponta de sua cauda é uma indicação de suas emoções. A chama oscila quando Charmander está se divertindo.',
  'CHARMELEON mercilessly destroys its foes using its sharp claws. If it encounters a strong foe, it turns aggressive. In this excited state, the flame at the tip of its tail flares with a bluish white color.': 'Charmeleon destrói impiedosamente seus inimigos usando suas garras afiadas. Se encontra um inimigo forte, torna-se agressivo. Neste estado, a chama na ponta de sua cauda brilha com uma cor branco-azulada.',
  'Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.': 'Cospe fogo que é quente o suficiente para derreter pedregulhos. Conhecido por causar incêndios florestais não intencionalmente.',
  "SQUIRTLE's shell is not merely used for protection. The shell's rounded shape and the grooves on its surface help minimize resistance in water, enabling this POKéMON to swim at high speeds.": 'A carapaça de Squirtle não serve apenas para proteção. A forma arredondada e as ranhuras ajudam a minimizar a resistência na água, permitindo nadar em altas velocidades.',
  'Its tail is large and covered with a rich, thick fur. The tail becomes increasingly deeper in color as WARTORTLE ages. The scratches on its shell are evidence of this POKéMON\'s toughness as a battler.': 'Sua cauda é grande e coberta por uma pelagem grossa e rica. A cauda escurece conforme Wartortle envelhece. Os arranhões na carapaça são evidência de sua resistência.',
  'BLASTOISE has water spouts that protrude from its shell. The water spouts are very accurate. They can shoot bullets of water with enough accuracy to strike empty cans from a distance of over 160 feet.': 'Blastoise tem canhões de água que saem de seu casco. Eles são muito precisos e podem disparar jatos de água para atingir latas vazias a mais de 50 metros de distância.',
  // Batch Translations: #10 - #20 & Pikachu
  'For protection, it releases a horrific stench from the antenna on its head to drive away enemies.': 'Para proteção, libera um fedor horrível da antena em sua cabeça para afastar os inimigos.',
  'A steel-hard shell protects its tender body. It quietly endures hardships while awaiting evolution.': 'Uma carapaça dura como aço protege seu corpo macio. Ele suporta silenciosamente as dificuldades enquanto aguarda a evolução.',
  'In battle, it flaps its wings at high speed to release highly toxic dust into the air.': 'Na batalha, bate as asas em alta velocidade para liberar poeira altamente tóxica no ar.',
  'Often found in forests, eating leaves. It has a sharp venomous stinger on its head.': 'Frequentemente encontrado em florestas, comendo folhas. Tem um ferrão venenoso afiado na cabeça.',
  'Almost incapable of moving, this POKéMON can only harden its shell to protect itself from predators.': 'Quase incapaz de se mover, este Pokémon só pode endurecer sua carapaça para se proteger de predadores.',
  'Flies at high speed and attacks using its large venomous stingers on its forelegs and tail.': 'Voa em alta velocidade e ataca usando seus grandes ferrões venenosos nas patas dianteiras e na cauda.',
  'A common sight in forests and woods. It flaps its wings at ground level to kick up blinding sand.': 'Uma visão comum em florestas e bosques. Bate as asas no nível do chão para levantar areia cegante.',
  'Very protective of its sprawling territorial area, this POKéMON will fiercely peck at any intruder.': 'Muito protetor de sua vasta área territorial, este Pokémon bica ferozmente qualquer intruso.',
  'When hunting, it skims the surface of water at high speed to pick off unwary prey such as MAGIKARP.': 'Ao caçar, roça a superfície da água em alta velocidade para capturar presas desavisadas como Magikarp.',
  'Bites anything when it attacks. Small and very quick, it is a common sight in many places.': 'Morde qualquer coisa quando ataca. Pequeno e muito rápido, é uma visão comum em muitos lugares.',
  'It uses its whiskers to maintain its balance. It apparently slows down if they are cut off.': 'Usa seus bigodes para manter o equilíbrio. Aparentemente, diminui a velocidade se forem cortados.',
  'When several of these POKéMON gather, their electricity could build and cause lightning storms.': 'Quando vários desses Pokémon se reúnem, sua eletricidade pode se acumular e causar tempestades de raios.',
  'Worm Pokémon': 'Pokémon Verme',
  'Cocoon Pokémon': 'Pokémon Casulo',
  'Butterfly Pokémon': 'Pokémon Borboleta',
  'Hairy Bug Pokémon': 'Pokémon Inseto Peludo',
  'Poison Bee Pokémon': 'Pokémon Abelha Venenosa',
  'Tiny Bird Pokémon': 'Pokémon Passarinho',
  'Bird Pokémon': 'Pokémon Pássaro',
  'Mouse Pokémon': 'Pokémon Rato',
}

export function translateText(text: string): string {
  if (!text) return ''
  const trimmed = text.trim().replace(/[\n\f\r]+/g, ' ')
  
  if (PT_DICT[trimmed]) return PT_DICT[trimmed]
  return trimmed
}
