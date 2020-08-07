function 提示动画 () {
    basic.showLeds(`
        . . . . .
        . . . . .
        # . . . #
        . . . . .
        . . . . .
        `)
    basic.pause(200)
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
    basic.clearScreen()
}
function 显示图标 (图标类型: number) {
    if (图标类型 == 0) {
        basic.showLeds(`
            . . . . .
            . . . . .
            # # . . .
            . . . . .
            . . . . .
            `)
    } else if (图标类型 == 1) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . # #
            . . . . .
            . . . . .
            `)
    } else {
        basic.showLeds(`
            . . . . .
            . . # . .
            . # . # .
            . . # . .
            . . . . .
            `)
    }
}
function 开场动画 () {
    basic.showNumber(3)
    basic.pause(200)
    basic.showNumber(2)
    basic.pause(200)
    basic.showNumber(1)
    basic.pause(200)
}
function 结束动画 () {
    for (let index = 0; index <= 24; index++) {
        led.plot(index % 5, Math.idiv(index, 5))
        basic.pause(100)
    }
}
let 本轮按钮按下时间 = 0
let 本轮目标 = 0
let 当前时间 = 0
let 本轮按钮计时开始 = 0
let 按钮编号 = 0
let 本轮开始时间 = 0
let 锁定按钮 = 0
radio.setGroup(15)
let 轮次 = 0
let 切换等待时间 = 500
let 显示停留时间 = 500
let 游戏结束 = 0
basic.forever(function () {
    while (!(input.buttonIsPressed(Button.AB))) {
        提示动画()
    }
    开场动画()
    radio.sendNumber(100)
    while (轮次 < 25) {
        锁定按钮 = 0
        本轮开始时间 = input.runningTime()
        按钮编号 = 4
        本轮按钮计时开始 = 本轮开始时间
        当前时间 = 本轮开始时间
        本轮目标 = randint(0, 1)
        while (当前时间 - 本轮开始时间 < 显示停留时间) {
            显示图标(本轮目标)
            if (input.buttonIsPressed(Button.A) && 锁定按钮 == 0) {
                本轮按钮按下时间 = input.runningTime()
                按钮编号 = 0
                锁定按钮 = 1
                serial.writeLine("A")
            }
            if (input.buttonIsPressed(Button.B) && 锁定按钮 == 0) {
                按钮编号 = 1
                本轮按钮按下时间 = input.runningTime()
                锁定按钮 = 1
                serial.writeLine("B")
            }
            if (本轮按钮按下时间 - 本轮按钮计时开始 < 显示停留时间 && 本轮目标 == 按钮编号) {
                radio.sendNumber(轮次)
                break;
            }
            当前时间 = input.runningTime()
        }
        轮次 += 1
        本轮按钮按下时间 = 0
        basic.clearScreen()
        basic.pause(切换等待时间)
    }
    basic.showIcon(IconNames.Heart)
    basic.clearScreen()
    结束动画()
    radio.sendNumber(200)
    游戏结束 = 1
    while (!(input.buttonIsPressed(Button.AB))) {
        提示动画()
    }
    radio.sendNumber(1000)
    control.reset()
})
