const INIT = "has initialized"
let BEGIN = false

let GATE1 = false
let GATE2 = false

enum COMMAND {
    SetVideo1,  // + file name
    SetVideo2,  // + file name
    PlayVideo1,
    PlayVideo2,
    SetBackgr,  // + file name
    ShowBackgr,
    ColorLed1,  // + color
    ColorLed2,  // + color
    ColorLed3,  // + color
    ThruGate1,
    ThruGate2
}

const CMDSTR = [
    "V1=",  // SetVideo1 file name
    "V2=",  // SetVideo2 file name
    "V1P",  // PlayVideo1
    "V2P",  // PlayVideo2
    "BG=",  // SetBackgr file name
    "BGS",  // ShowBackgr,
    "L1=",  // ColorLed1
    "L2=",  // ColorLed2
    "L3=",  // ColorLed3
    "G1C",  // ThruGate1
    "G2C"   // ThruGate2
]

serial.redirect(
    SerialPin.P14,
    SerialPin.P13,
    BaudRate.BaudRate9600
)

basic.showLeds(`
        # # # # #
        # . . . #
        . # . # .
        # . . . #
        # # # # #
        `)
/*
basic.forever(function() {
    // RPi starts by reading the serial until it
    // receives the string INIT. Then it will
    // echoe the INIT string which means that
    // at both sides the serial communication has
    // started.
    if (!BEGIN) {
        serial.writeLine(INIT + "\n")
        return
    }
})
*/
serial.writeLine(INIT + "\n")

serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let line = serial.readLine()

    // RPi starts by reading the serial until it
    // receives the string INIT. Then it will
    // echoe the INIT string which means that
    // at both sides the serial communication has
    // started.
    if (line == INIT) {
        BEGIN = true
        basic.showIcon(IconNames.Yes)
    }
    if (!BEGIN) return

    let cmd = line.substr( 0, 3)
    let val = line.substr( 3)

    if (cmd == CMDSTR[COMMAND.ThruGate1]) {
        GATE1 = true
        // echoe the COMMAND
        serial.writeLine(cmd + "\n")
    }
    if (cmd == CMDSTR[COMMAND.ThruGate2]) {
        GATE2 = true
        // echo the COMMAND
        serial.writeLine(cmd + "\n")
    }
})

//% color="#00CC00" icon="\uf1f9"
//% block="Pinball"
//% block.loc.nl="Flipperkast"
namespace CBurgPinball {

    export enum Gate {
        //% block="gate 1"
        //% block.loc.nl="poortje 1"
        Gate1,
        //% block="gate 2"
        //% block.loc.nl="poortje 2"
        Gate2
    }

    export enum Led {
        //% block="led 1"
        //% block.loc.nl="led 1"
        Led1,
        //% block="led 2"
        //% block.loc.nl="led 2"
        Led2,
        //% block="led 3"
        //% block.loc.nl="led 3"
        Led3
    }

    export enum Media {
        //% block="video 1"
        //% block.loc.nl="video 1"
        Video1,
        //% block="video 2"
        //% block.loc.nl="video 2"
        Video2
    }

    //% block="wait %time sec"
    //% block.loc.nl="wacht %time sec"
    export function wait(time: number) {
        basic.pause(time * 1000);
    }

    //% block="wait for the initialization"
    //% block.loc.nl="wacht op de initialisatie"
    export function waitInit() {
        basic.forever(function() {
            if (BEGIN) return
        })
    }

    //% block="assign file %name to the background"
    //% block.loc.nl="wijs bestand %name toe aan de achtergrond"
    export function setBackgrFile(name: string) {
        let cmd = CMDSTR[COMMAND.SetBackgr]
        serial.writeString(cmd + name + "\n")
    }

    //% block="assign file %name to %video"
    //% block.loc.nl="wijs bestand %name toe aan %video"
    export function setVideoFile( name: string, video: Media) {
        let cmd: string
        switch (video) {
            case Media.Video1: cmd = CMDSTR[COMMAND.SetVideo1]; break;
            case Media.Video2: cmd = CMDSTR[COMMAND.SetVideo2]; break;
        }
        serial.writeString( cmd + name + "\n")
    }

    //% block="let %led shine %color"
    //% block.loc.nl="laat %led %color schijnen"
    export function setLedColor(led: Led, color: Color) {
        let clr = rgb(color)
        let cmd: string
        switch (led) {
            case Led.Led1: cmd = CMDSTR[COMMAND.ColorLed1]; break;
            case Led.Led2: cmd = CMDSTR[COMMAND.ColorLed2]; break;
            case Led.Led3: cmd = CMDSTR[COMMAND.ColorLed3]; break;
        }
        serial.writeString(cmd + clr.toString() + "\n")
    }

    //% block="play %video"
    //% block.loc.nl="speel %video af"
    export function playVideo(video: Media) {
        let cmd: string
        switch (video) {
            case Media.Video1: cmd = CMDSTR[COMMAND.PlayVideo1]; break;
            case Media.Video2: cmd = CMDSTR[COMMAND.PlayVideo2]; break;
        }
        serial.writeString(cmd + "\n")
    }

    //% block="show background"
    //% block.loc.nl="toon achtergrond"
    export function showBackground() {
        serial.writeString("BGS\n")
    }

    //% block="thru gate 2"
    //% block.loc.nl="door poortje 2"
    export function thruGate2(): boolean {
        let state = GATE2
        GATE2 = false
        return state
    }

    //% block="thru gate 1"
    //% block.loc.nl="door poortje 1"
    export function thruGate1(): boolean {
        let state = GATE1
        GATE1 = false
        return state
    }
}
