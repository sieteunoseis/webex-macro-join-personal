const xapi = require('xapi');

const KEYBOARD_TYPES = {
      NUMERIC     :   'Numeric'
    , SINGLELINE  :   'SingleLine'
    , PASSWORD    :   'Password'
    , PIN         :   'PIN'
}
const CALL_TYPES = {
      AUDIO     :   'Audio'
    , VIDEO     :   'Video'
}

const DIALPAD_ID = 'dialpad';
const INROOMCONTROL_AUDIOCONTROL_PANELID = 'personal_room'; // This needs to match the id of the button you create in the UI Extensions Editor
const DOMAIN = 'lookingpoint.webex.com' // Edit this to your personal domain

/* Use these to check that its a valid number (depending on what you want to allow users to call */
const REGEXP_URLDIALER = /([a-zA-Z0-9@_\-\.]+)/; /*  . Use this one if you want to allow URL dialling */
const REGEXP_NUMERICDIALER =  /^([0-9]{3,10})$/; /* Use this one if you want to limit calls to numeric only. In this example, require number to be between 3 and 10 digits. */

const DIALPREFIX_AUDIO_GATEWAY = '+';

function showDialPad(text){

         xapi.command("UserInterface Message TextInput Display", {
               InputType: KEYBOARD_TYPES.NUMERIC
             , Placeholder: "Use keyboard to enter name of user. i.e. sean" 
             , Title: "Personal Room"
             , Text: text
             , SubmitText: "Join" 
             , FeedbackId: DIALPAD_ID
         }).catch((error) => { console.error(error); });
}

/* This is the listener for the in-room control panel button that will trigger the dial panel to appear */
xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    if(event.PanelId === INROOMCONTROL_AUDIOCONTROL_PANELID){
         showDialPad("Enter the name of the personal room you want to join:" );
    }
});


/* Event listener for the dial pad been posted */

xapi.event.on('UserInterface Message TextInput Response', (event) => {
    switch(event.FeedbackId){
        case DIALPAD_ID:
            
            var regex = REGEXP_URLDIALER; //change this to whatever filter you want to check for validity
            var match = regex.exec(event.Text);    
            if (match !== null) {
                var personalroom = match[1] + "@" + DOMAIN;
                xapi.Command.Dial({ Number: personalroom }).catch((error) => { console.error(error); });

            }
            else{
                showDialPad("You typed in an invalid name. Please try again." );
            }
            break;
    }
});

