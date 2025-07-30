/**
 * COMMUNICATION       MBIT <> RPI
 * -------------       -----------
 * GATE1 CLOSED        P1   <  6
 * GATE2 CLOSED        P2   <  5
 * DATA VALID          P0   >  7
 * DATA RECEIVED       P3   <  8
 * MEDIA SELECT A      P20  >  18
 * MEDIA SELECT B      P19  >  23
 * LED SELECT A        P13  >  24
 * LED SELECT B        P12  >  25
 * LED COLOR RED       P14  >  11
 * LED COLOR GREEN     P15  >  9
 * LED COLOR BLUE      P16  >  10
 */

let LOW = 0
let PIN_GATE1 = DigitalPin.P1
let PIN_GATE2 = DigitalPin.P2
let PIN_DVALID = DigitalPin.P0
let PIN_DRECEIVED = DigitalPin.P3
let PIN_MEDSELA = DigitalPin.P20
let PIN_MEDSELB = DigitalPin.P19
let PIN_LEDSELA = DigitalPin.P13
let PIN_LEDSELB = DigitalPin.P12
let PIN_LEDRED = DigitalPin.P14
let PIN_LEDGREEN = DigitalPin.P15
let PIN_LEDBLUE = DigitalPin.P16
let HIGH = 1

pins.setPull(PIN_DRECEIVED, PinPullMode.PullUp)

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

    export enum LedId {
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

    export enum ColorId {
        //% block="dark"
        //% block.loc.nl="donker"
        Off,
        //% block="red"
        //% block.loc.nl="rood"
        Red,
        //% block="yellow"
        //% block.loc.nl="geel"
        Yellow,
        //% block="green"
        //% block.loc.nl="groen"
        Green,
        //% block="light blue"
        //% block.loc.nl="lichtblauw"
        Cyan,
        //% block="blue"
        //% block.loc.nl="blauw"
        Blue,
        //% block="purple"
        //% block.loc.nl="paars"
        Magenta,
        //% block="white"
        //% block.loc.nl="wit"
        White
    }

    export enum MediaId {
        //% block="video 1"
        //% block.loc.nl="video 1"
        Video1,
        //% block="video 2"
        //% block.loc.nl="video 2"
        Video2
    }

    //% block="thru gate 2"
    //% block.loc.nl="door poortje 2"
    export function thruGate2(): boolean {
        return (pins.digitalReadPin(PIN_GATE2) == HIGH)
    }

    //% block="thru gate 1"
    //% block.loc.nl="door poortje 1"
    export function thruGate1(): boolean {
        return (pins.digitalReadPin(PIN_GATE1) == HIGH)
    }

    //% block="wait %time sec"
    //% block.loc.nl="wacht %time sec"
    export function wait(time: number) {
        basic.pause(time * 1000);
    }

    //% block="color %ledid %state"
    //% block.loc.nl="kleur %ledid %state"
    export function switchled(ledid: LedId, colorid: ColorId) {
        // do not change media
        pins.digitalWritePin(PIN_MEDSELA, LOW)
        pins.digitalWritePin(PIN_MEDSELB, LOW)
        // choose the led
        if (ledid == LedId.Led1) {
            pins.digitalWritePin(PIN_LEDSELA, LOW);
            pins.digitalWritePin(PIN_LEDSELB, HIGH);
        }
        if (ledid == LedId.Led2) {
            pins.digitalWritePin(PIN_LEDSELA, HIGH);
            pins.digitalWritePin(PIN_LEDSELB, LOW);
        }
        if (ledid == LedId.Led3) {
            pins.digitalWritePin(PIN_LEDSELA, HIGH);
            pins.digitalWritePin(PIN_LEDSELB, HIGH);
        }
        // set the color
        if (colorid == ColorId.Off) {
            pins.digitalWritePin(PIN_LEDRED, LOW);
            pins.digitalWritePin(PIN_LEDGREEN, LOW);
            pins.digitalWritePin(PIN_LEDBLUE, LOW);
        }
        if (colorid == ColorId.Red) {
            pins.digitalWritePin(PIN_LEDRED, HIGH);
            pins.digitalWritePin(PIN_LEDGREEN, LOW);
            pins.digitalWritePin(PIN_LEDBLUE, LOW);
        }
        if (colorid == ColorId.Yellow) {
            pins.digitalWritePin(PIN_LEDRED, HIGH);
            pins.digitalWritePin(PIN_LEDGREEN, HIGH);
            pins.digitalWritePin(PIN_LEDBLUE, LOW);
        }
        if (colorid == ColorId.Green) {
            pins.digitalWritePin(PIN_LEDRED, LOW);
            pins.digitalWritePin(PIN_LEDGREEN, HIGH);
            pins.digitalWritePin(PIN_LEDBLUE, LOW);
        }
        if (colorid == ColorId.Cyan) {
            pins.digitalWritePin(PIN_LEDRED, LOW);
            pins.digitalWritePin(PIN_LEDGREEN, HIGH);
            pins.digitalWritePin(PIN_LEDBLUE, HIGH);
        }
        if (colorid == ColorId.Blue) {
            pins.digitalWritePin(PIN_LEDRED, LOW);
            pins.digitalWritePin(PIN_LEDGREEN, LOW);
            pins.digitalWritePin(PIN_LEDBLUE, HIGH);
        }
        if (colorid == ColorId.Magenta) {
            pins.digitalWritePin(PIN_LEDRED, HIGH);
            pins.digitalWritePin(PIN_LEDGREEN, LOW);
            pins.digitalWritePin(PIN_LEDBLUE, HIGH);
        }
        if (colorid == ColorId.White) {
            pins.digitalWritePin(PIN_LEDRED, HIGH);
            pins.digitalWritePin(PIN_LEDGREEN, HIGH);
            pins.digitalWritePin(PIN_LEDBLUE, HIGH);
        }
        // communicate to raspberry
        pins.digitalWritePin(PIN_DVALID, HIGH);
        while (!pins.digitalReadPin(PIN_DRECEIVED));
        pins.digitalWritePin(PIN_DVALID, LOW);
        basic.pause(10)
    }

    //% block="start %mediaid"
    //% block.loc.nl="start %mediaid"
    export function startVideo(mediaid: MediaId) {
        // do not change leds
        pins.digitalWritePin(PIN_LEDSELA, LOW)
        pins.digitalWritePin(PIN_LEDSELB, LOW)
        // choose the medium
        if (mediaid == MediaId.Video1) {
            pins.digitalWritePin(PIN_MEDSELA, LOW);
            pins.digitalWritePin(PIN_MEDSELB, HIGH);
        }
        else
            if (mediaid == MediaId.Video2) {
                pins.digitalWritePin(PIN_MEDSELA, HIGH);
                pins.digitalWritePin(PIN_MEDSELB, LOW);
            }
        // communicate to raspberry
        pins.digitalWritePin(PIN_DVALID, HIGH);
        while (!pins.digitalReadPin(PIN_DRECEIVED));
        pins.digitalWritePin(PIN_DVALID, LOW);
        basic.pause(10)
    }

    //% block="show background"
    //% block.loc.nl="toon achtergrond"
    export function showBackground() {
        // do not change leds
        pins.digitalWritePin(PIN_LEDSELA, LOW)
        pins.digitalWritePin(PIN_LEDSELB, LOW)
        // choose background medium
        pins.digitalWritePin(PIN_MEDSELA, HIGH);
        pins.digitalWritePin(PIN_MEDSELB, HIGH);
        // communicate to raspberry
        pins.digitalWritePin(PIN_DVALID, HIGH);
        while (!pins.digitalReadPin(PIN_DRECEIVED));
        pins.digitalWritePin(PIN_DVALID, LOW);
        basic.pause(10)
    }
}
