# Botkit issue

Repro steps:
1. Start the bot
1. Say 'hi' to trigger onboarding
1. Say anything for your name
1. Say 'yes' to confirm and trigger onboarding2
1. onboarding2 asks for your name, and immediately receives `{}` as a response without your input
