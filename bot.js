//  __   __  ___        ___
// |__) /  \  |  |__/ |  |
// |__) \__/  |  |  \ |  |

// This is the main file for the botkit demooo bot.

// Import Botkit's core features
const { Botkit } = require('botkit');
const { BotkitCMSHelper } = require('botkit-plugin-cms');

// Import a platform-specific adapter for twilio-sms.
const { TwilioAdapter } = require('botbuilder-adapter-twilio-sms');

const { MongoDbStorage } = require('botbuilder-storage-mongodb');

// Load process.env values from .env file
require('dotenv').config();

let storage = null;
if (process.env.MONGO_URI) {
    storage = mongoStorage = new MongoDbStorage({
        url : process.env.MONGO_URI,
    });
}


const adapter = null; //new TwilioAdapter({

    // REMOVE THIS OPTION AFTER YOU HAVE CONFIGURED YOUR APP!
//     enable_incomplete: true,

//     twilio_number: process.env.TWILIO_NUMBER,
//     account_sid: process.env.TWILIO_ACCOUNT_SID,
//     auth_token: process.env.TWILIO_AUTH_TOKEN,
// });


const controller = new Botkit({
    webhook_uri: '/api/messages',

    adapter: adapter,

    storage
});

if (process.env.cms_uri) {
    controller.usePlugin(new BotkitCMSHelper({
        uri: process.env.cms_uri,
        token: process.env.cms_token,
    }));
}

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {

    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + '/features');

    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {
        controller.on('message,direct_message', async (bot, message) => {
            let results = false;
            results = await controller.plugins.cms.testTrigger(bot, message);

            if (results !== false) {
                // do not continue middleware!
                return false;
            }
        });
    }

});



controller.webserver.get('/', (req, res) => {

    res.send(`This app is running Botkit ${ controller.version }.`);

});


async function waitThenStartConvo() {
  if (!global.reference) {
    // Try again soon.
    console.log("Waiting for 'ref' ...")
    setTimeout(waitThenStartConvo, 1000);
    return;
  }

  console.log("Spawning!")
  const bot = await controller.spawn();
  try {
    await bot.startConversationWithUser(global.reference);
    await bot.say("Hi there");
  } catch (error) {
    console.error("Failed to startConversationWithUser:", error);
  }
}

waitThenStartConvo();
