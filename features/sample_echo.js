/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

module.exports = function(controller) {

    controller.hears('ref','message,direct_message', async(bot, message) => {
        console.log("Heard it.")
        global.reference = message.reference;
        await bot.reply(message, 'Reference set, you should get a message soon.');
    });

}
