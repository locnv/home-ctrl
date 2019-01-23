# Mobile application

## Plugman

Ref: https://stackoverflow.com/questions/36923980/how-to-add-a-plugin-on-only-one-ionic-platform

Maybe use plugman to add plugin for specific platform:
First,install plugman:

$ npm install -g plugman
And then, add plugin:

$ plugman install --platform <ios|android|blackberry10|wp8> --project <directory> --plugin <name|url|path>
for your situation, <directory> should be platforms/android, so the finally installation command is:

$ plugman install --platform android --project platforms/android --plugin https://github.com/mauron85/cordova-plugin-background-geolocation.git
More about plugman, refer to cordova plugman docs.Hope this will help, regards.

