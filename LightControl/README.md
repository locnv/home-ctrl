# Mobile application

adb is not in your PATH. This is where the shell looks for executables. You can check your current PATH with echo $PATH.

Bash will first try to look for a binary called adb in your Path, and not in the current directory. Therefore, if you are currently in the platform-tools directory, just call

./adb --help
The dot is your current directory, and this tells Bash to use adb from there.

Otherwise, you should add platform-tools to your PATH, by adding the path in your shell profile, depending on which file is used:

Linux: typically ~/.bashrc
OS X / macOS: typically ~/.profile or ~/.bash_profile
Add the following line there and replace the path with the one where you installed platform-tools:

export PATH=/Users/espireinfolabs/Desktop/soft/android-sdk-mac_x86/platform-tools:$PATH
Save the profile file, then, re-start the Terminal or run source ~/.bashrc (or whatever you just modified).

If you've installed the platform tools somewhere else, change the path accordingly. For Android Studio on OS X, for example, you'd use the following—note the double-quotes that prevent a possible space from breaking the path syntax:

export PATH="/Users/myuser/Library/Android/sdk/platform-tools":$PATH

adb logcat MainActivity:V *:S

## plugins
https://github.com/pbakondy/cordova-plugin-speechrecognition

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

