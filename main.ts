function CLSetup () {
    basic.showString("Set Time")
    basic.showString("Hr:")
    while (!(input.buttonIsPressed(Button.AB))) {
        if (input.buttonIsPressed(Button.B)) {
            Hour += 1
            basic.showString("" + (Hour))
        }
        if (input.buttonIsPressed(Button.A)) {
            Hour += -1
            basic.showString("" + (Hour))
        }
        if (Hour < 0) {
            Hour = 0
            basic.showString("" + (Hour))
        }
        if (Hour > 24) {
            Hour = 24
            basic.showString("" + (Hour))
        }
    }
    basic.showString("Min:")
    while (!(input.buttonIsPressed(Button.AB))) {
        if (input.buttonIsPressed(Button.B)) {
            Minute += 1
            basic.showString("" + (Minute))
        }
        if (input.buttonIsPressed(Button.A)) {
            Minute += -1
            basic.showString("" + (Minute))
        }
        if (Hour < 0) {
            Minute = 0
            basic.showString("" + (Minute))
        }
        if (Hour > 59) {
            Minute = 59
            basic.showString("" + (Minute))
        }
    }
    basic.showString("Starting Clock")
    Start_Clock = 1
    basic.showString("" + convertToText(Hour) + ":" + convertToText(Minute) + ":" + convertToText(Second))
}
bluetooth.onBluetoothDisconnected(function () {
    basic.showString("BT Disconnected")
    BT = 0
    pins.setAudioPinEnabled(false)
})
function OSW () {
    music.play(music.stringPlayable("C D G E E E E E ", 164), music.PlaybackMode.UntilDone)
    basic.showString("Started")
    Power_Saving = 0
    while (StartOS == 1) {
        if (input.buttonIsPressed(Button.A)) {
            FaceChange()
        }
        if (input.buttonIsPressed(Button.B)) {
            basic.showString("Power Saving:")
            if (Power_Saving == 1) {
                Power_Saving = 0
                basic.showString("Off")
                PowerSave()
            }
            if (Power_Saving == 0) {
                Power_Saving = 1
                basic.showString("On")
                PowerSave()
            }
        }
        if (input.logoIsPressed()) {
            Selected = 0
            basic.showString("A for Power off B for BT connect Logo for WSPS (watch sound player service)")
            while (Selected == 0) {
                if (input.buttonIsPressed(Button.A)) {
                    power.lowPowerEnable(LowPowerEnable.Allow)
                    power.lowPowerRequest(LowPowerMode.Wait)
                    bluetooth.setTransmitPower(0)
                    Selected = 1
                }
                if (input.buttonIsPressed(Button.B)) {
                    power.lowPowerEnable(LowPowerEnable.Prevent)
                    bluetooth.startIOPinService()
                    bluetooth.setTransmitPower(7)
                    BT = 1
                    Selected = 1
                }
                if (input.logoIsPressed()) {
                    WSPS()
                }
            }
        }
    }
}
function Setup () {
    wID = "" + control.deviceName() + control.deviceSerialNumber()
    basic.pause(1000)
    basic.showString("Hold logo to skip startup")
    if (!(input.logoIsPressed())) {
        basic.showString("Face North")
        input.calibrateCompass()
        basic.showString("Calibrated")
        if (TimeString == "" || TimeString == "0") {
            CLSetup()
        }
        basic.showString("Starting OS-W")
    }
    basic.showString("WARNING! SKIPPING INFORMATION MAY CAUSE ISSUES!")
    StartOS = 1
    OSW()
    basic.showString("Started OS-W")
}
function PowerSave () {
    if (Power_Saving == 1) {
        power.lowPowerEnable(LowPowerEnable.Allow)
        bluetooth.setTransmitPower(0)
        power.lowPowerRequest(LowPowerMode.Continue)
    }
    if (Power_Saving == 0) {
        power.lowPowerEnable(LowPowerEnable.Prevent)
        bluetooth.setTransmitPower(7)
        power.fullPowerOn(FullPowerSource.A)
        power.fullPowerOn(FullPowerSource.B)
    }
}
function FaceChange () {
    CurFace = "A for Time B for Compass"
    if (input.buttonIsPressed(Button.A)) {
        CurFace = "Time"
    }
    if (input.buttonIsPressed(Button.B)) {
        CurFace = "Comp"
    }
}
function WSPS () {
    record.setSampleRate(11000)
    record.setMicGain(record.AudioLevels.Low)
    if (BT == 1) {
        music.setBuiltInSpeakerEnabled(false)
        pins.setAudioPinEnabled(true)
        record.setSampleRate(22000, record.AudioSampleRateScope.Playback)
    }
    if (BT == 0) {
        music.setBuiltInSpeakerEnabled(true)
        pins.setAudioPinEnabled(false)
        record.setSampleRate(11000, record.AudioSampleRateScope.Playback)
    }
    basic.showString("A for Record B to Play and Logo to leave")
    if (input.buttonIsPressed(Button.A)) {
        record.startRecording(record.BlockingState.Blocking)
    }
    if (input.buttonIsPressed(Button.B)) {
        record.playAudio(record.BlockingState.Blocking)
    }
    if (input.logoIsPressed()) {
        Selected = 1
    }
}
let CurFace = ""
let TimeString = ""
let wID = ""
let Selected = 0
let StartOS = 0
let Power_Saving = 0
let BT = 0
let Second = 0
let Start_Clock = 0
let Minute = 0
let Hour = 0
Setup()
control.inBackground(function () {
    while (CurFace == "Time") {
        basic.showString(TimeString)
    }
    while (CurFace == "Comp") {
        basic.showArrow(input.compassHeading())
    }
})
control.inBackground(function () {
    while (!(Start_Clock == 0)) {
        basic.pause(1000)
        Second += 1
        if ((0 as any) == (60 as any)) {
            Minute += 1
            Second = 0
        }
        if (Minute == 60) {
            Hour += 1
            Minute = 0
        }
        if (Hour == 24) {
            Minute = 0
            Second = 0
            Hour = 0
        }
        TimeString = "" + convertToText(Hour) + ":" + convertToText(Minute) + ":" + convertToText(Second)
    }
})
