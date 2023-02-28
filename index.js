// import { platform } from './assets/platform.png'


const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.5

const image = new Image()
image.src = './assets/platform.png'

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {x:0, y:0}
        this.width = 30
        this.height = 30

    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y


        if(this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        else this.velocity.y = 0
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
        c.drawImage(image, this.position.x, this.position.y)
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}



const player = new Player()
const platforms = [new Platform({x:-1, y:470, image}), new Platform({x: image.width-3, y: 470, image})]


const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}


function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0,0, canvas.width, canvas.height)
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            platforms.forEach(platform => {
                platform.position.x -= 5
            })
        } else if (keys.left.pressed) {
            platforms.forEach(platform => {
                platform.position.x += 5
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
}

animate()

addEventListener('keydown', ({ code})  => {
    switch (code){
        case 'KeyA':
            console.log('left')
            keys.left.pressed = true
            break
        case 'KeyS':
            console.log('down')
            break
        case 'KeyD':
            console.log('right')
            keys.right.pressed = true
            break
        case 'KeyW':
            console.log('up')
            player.velocity.y -= 10
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
            player.velocity.y -= 20
            break
    }
})