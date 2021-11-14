// Linted with standardJS - https://standardjs.com/

// Inciar o game
const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
})

// Declarar e compartilhar variáveis
let score = 0
let scoreText
let platforms
let diamonds
let cursors
let player

function preload () {
  // Carregar e definir imagens
  game.load.image('sky', './assets/sky.png')
  game.load.image('ground', './assets/platform.png')
  game.load.image('diamond', './assets/diamond.png')
  game.load.spritesheet('woof', './assets/woof.png', 32, 32)
}

function create () {
  //  Ativar a física
  game.physics.startSystem(Phaser.Physics.ARCADE)

  //  Um fundo simples para o jogo
  game.add.sprite(0, 0, 'sky')

  //  O grupo de plataformas vai ter 2 degraus para pular
  platforms = game.add.group()

  //  Podemos habilitar a física para qualquer objeto criado no grupo
  platforms.enableBody = true

  // Criar a plataforma de pulo
  const ground = platforms.create(0, game.world.height - 64, 'ground')

  //  Escalar no jogo
  ground.scale.setTo(2, 2)

  //  Isso para o personagem quando ele pula
  ground.body.immovable = true

  //  Criando as duas plataformas
  let ledge = platforms.create(400, 450, 'ground')
  ledge.body.immovable = true

  ledge = platforms.create(-75, 350, 'ground')
  ledge.body.immovable = true

  // O jogador e as configurações
  player = game.add.sprite(32, game.world.height - 150, 'woof')

  //  Ativando a física do jogador
  game.physics.arcade.enable(player)

  //  Propriedades físicas do jogador. Saltos leves.
  player.body.bounce.y = 0.2
  player.body.gravity.y = 800
  player.body.collideWorldBounds = true

  //  Nossas duas animações, andando para a esquerda e para a direita.
  player.animations.add('left', [0, 1], 10, true)
  player.animations.add('right', [2, 3], 10, true)

  //  Finalmente alguns diamantes para coletar
  diamonds = game.add.group()

  //  Habilita física para qualquer objeto criado neste grupo
  diamonds.enableBody = true

  //  Criando 12 diamantes uniformemente espaçados
  for (var i = 0; i < 12; i++) {
    const diamond = diamonds.create(i * 70, 0, 'diamond')

    // Solte-os do céu e salte um pouco
    diamond.body.gravity.y = 1000
    diamond.body.bounce.y = 0.3 + Math.random() * 0.2
  }

  //  Crie o texto da pontuação
  scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' })

  //  E inicializa nossos controles
  cursors = game.input.keyboard.createCursorKeys()
}

function update () {
  //  Parar o personagem quando não estiver se movendo
  player.body.velocity.x = 0

  //  Configura colisões para o jogador, diamantes e nossas plataformas
  game.physics.arcade.collide(player, platforms)
  game.physics.arcade.collide(diamonds, platforms)

  //  Call callectionDiamond() O jogador se sobrepõe aos diamantes
  game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)

  // Configurar os controles!
  if (cursors.left.isDown) {
    player.body.velocity.x = -150
    player.animations.play('left')
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150
    player.animations.play('right')
  } else {
    // se nenhuma tecla for pressionada, o jogador para
    player.animations.stop()
  }

  //  Isso mantem o jogador pulando
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -400
  }
  // Mostrar o alerta de vitória se bater 120 pontos
  if (score === 120) {
    alert('Obrigado, SIR1! Obrigado Stone!')
    score = 0
  }
}

function collectDiamond (player, diamond) {
  // Remover os diamantes da tela
  diamond.kill()

  //  Atualizar o placar
  score += 10
  scoreText.text = 'Pontos: ' + score
}