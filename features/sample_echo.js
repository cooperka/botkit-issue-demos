/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

module.exports = function(controller) {

    controller.hears('ref','message,direct_message', async(bot, message) => {
        global.reference = message.reference;
        await bot.reply(message, 'Reference set.');
    });

}
