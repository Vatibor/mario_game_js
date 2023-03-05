const platform = './assets/platform.png'
const background = './assets/background.png'
const hills = './assets/hills.png'
const platformSmallTall ='./assets/platformSmallTall.png'

const spriteRunLeft = './assets/spriteRunLeft.png'
const spriteRunRight = './assets/spriteRunRight.png'
const spriteStandLeft = './assets/spriteStandLeft.png'
const spriteStandRight = './assets/spriteStandRight.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.5

class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {x:0, y:0}
        this.width = 66
        this.height = 150
        this.image = createImage(spriteStandRight)
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width: 127.875
            }
        }
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177

    }
    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height)

    }

    update() {
        this.frames++
        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left))
            this.frames = 0
        else if ( this.frames > 29 && (this.currentSprite === this.sprites.run.right
            || this.currentSprite === this.sprites.run.left))
            this.frames = 0

        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
    }
}

class Platform {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
        }
}

class GenericObject {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
        }
}

function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}

let platformImg = createImage(platform)
let platformSmallTallImg = createImage(platformSmallTall)

let player = new Player()
let platforms = []

let genericObjects = []
let lastKey
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0

function init() {
    platformImg = createImage(platform)

    player = new Player()
    platforms = [
        new Platform({x: platformImg.width * 4 + 300 - 3 + platformImg.width - platformSmallTallImg.width, y: 270, image: platformSmallTallImg}),
        new Platform({x: -1, y: 470, image: platformImg}),
        new Platform({x: platformImg.width - 3, y: 470, image: platformImg}),
        new Platform({x: platformImg.width * 2 + 100, y: 470, image: platformImg}),
        new Platform({x: platformImg.width * 3 + 300, y: 470, image: platformImg}),
        new Platform({x: platformImg.width * 4 + 300 - 3, y: 470, image: platformImg}),
        new Platform({x: platformImg.width * 5 + 600 - 3, y: 470, image: platformImg}),
    ]

    genericObjects = [
        new GenericObject({x: -1, y: -1, image: createImage(background)}),
        new GenericObject({x: -1, y: -1, image: createImage(hills)})
    ]

    scrollOffset = 0
}
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0,0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })

    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if (keys.left.pressed && player.position.x > 100
    || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * .66
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            // scrollOffset > 0 -> nem engedi a playernek elhagyni a pálya bal oldalát
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * .66
            })
        }
    }

    //    detect collision
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

    // sprite switching
    if (
        keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.run.right
    ) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (
        keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.run.left
    ) {
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (
        !keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.stand.left
    ) {
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    } else if (
        !keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.stand.right
    ) {
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }

    // win condition
    if(scrollOffset > platformImg.width * 5 + 600 - 3) {
        console.log('You win')
    }

    // lose condition
    if(player.position.y > canvas.height) {
        // console.log('You lose...')
        init()
    }
}

init()
animate()

addEventListener('keydown', ({ code})  => {
    switch (code){
        case 'KeyA':
            console.log('left')
            keys.left.pressed = true
            lastKey = 'left'
            break
        case 'KeyS':
            console.log('down')
            break
        case 'KeyD':
            console.log('right')
            keys.right.pressed = true
            lastKey = 'right'
            break
        case 'KeyW':
            console.log('up')
            player.velocity.y -= 15
            break
    }
})

addEventListener('keyup', ({ code})  => {
    switch (code){
        case 'KeyA':
            console.log('left')
            keys.left.pressed = false
            break
        case 'KeyS':
            console.log('down')
            break
        case 'KeyD':
            console.log('right')
            keys.right.pressed = false
            break
        case 'KeyW':
            console.log('up')
            break
    }
})