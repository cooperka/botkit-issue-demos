const { BotkitConversation } = require('botkit');

const ONBOARDING_DIALOG = 'ONBOARDING_DIALOG';

module.exports = function(controller) {

  initDialog(controller);

  controller.hears(['hi', 'hello', 'hey'], 'message', async (bot) => {
    await bot.beginDialog(ONBOARDING_DIALOG);
  });

}

function initDialog(controller) {
  const GET_DETAILS_THREAD = 'GET_DETAILS_THREAD';
  const REPEAT_DETAILS_THREAD = 'REPEAT_DETAILS_THREAD';
  const CONCLUSION = 'CONCLUSION';

  const dialog = new BotkitConversation(
    ONBOARDING_DIALOG,
    controller,
  );

  dialog.say('onboarding.welcome');

  dialog.addAction(GET_DETAILS_THREAD);

  dialog.addMessage('onboarding.startOver', REPEAT_DETAILS_THREAD);
  dialog.addAction(GET_DETAILS_THREAD, REPEAT_DETAILS_THREAD);

  dialog.addQuestion(
    'onboarding.askName',
    [
      {
        default: true,
        handler: async (response, convo, bot) => {
          console.log('@@@ Got:', response);
        },
      },
    ],
    'name',
    GET_DETAILS_THREAD,
  );

  dialog.addQuestion(
    'onboarding.confirmation',
    [
      {
        pattern: /yes|yeah|ya|yep|y|right|correct/,
        handler: async (response, convo, bot) => {
          await convo.gotoThread(CONCLUSION);
        },
      },
      {
        default: true,
        handler: async (response, convo) => {
          await convo.gotoThread(REPEAT_DETAILS_THREAD);
        },
      },
    ],
    'confirm',
    GET_DETAILS_THREAD,
  );

  dialog.addMessage('onboarding.success', CONCLUSION);
  dialog.addGotoDialog('ONBOARDING_DIALOG_2', CONCLUSION);

  controller.addDialog(dialog);
}
