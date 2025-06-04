# Five Crowns Scorecard
This project is a Vite + React + TailwindCSS + Capacitor project which purpose is to keep track of your Five Crowns (Cinco Coronas) board game matches score.  
This app is available to run as a Webapp or as a Mobile app (though capacitor).  
You can run this project either with npm or pnpm (recommended).

## Installation and running
### Requirements
- Nodejs
- pnpm packace manager
- Java (if you want to try the mobile app)
- Android Studio (and a virtual device created)

### Installation
Clone the repository and then cd into the project's folder and make a:  
```bash
pnpm install
```
---
### Running the project WEB
Once the dependencies are installed it is a good idea to build the code to make sure anything is broken:
```bash
pnpm run build
```

After the code built successfully, run the web project with:
```bash
pnpm run dev
```

## Running the project in ANDROID
To run the project, whether, running the web version first, or running android version directly, you will always need to make a ```pnpm run build``` first, so the static files are generated and the capacitor syncronization process has resources to create the mobile app version from.  
  
### Running in Android virtual device
Once the project is built, you will need to execute this command to sync your changes in the react project to the Android app version:
first build the static files:
```bash
pnpm run build
```
then sync the static files to the android project:
```bash
npx cap sync android
```
After the static files are synced, you are ready to run the actual android app in your virtual device with:
```bash
npx cap run android
```

### Running in a real Android device
To run this project in a real device, you first need to have the device handy (obviously), with the debugging mode activated and connected to the computer you are running this app on and activate the "File transfer" mode.

#### Check the device connection
To check the device is actually recognized, you can run:
```bash
adb devices
```
This should return a list of devices similar to this:
| Device ID       | Type     |
|-----------------|----------|
| bec4e722        | device   |
| emulator-5554   | device   |

If you see somethin like this, your device is ready.

#### Running the app
Now you can build your app, sync your changes and then install the app in your mobile device using:
```bash
pnpm run build  
npx cap sync android  
cd android  
./gradlew installDebug
```

## Generating Icons and Splash Screen
- First you will need to have your icon and splash screen created in large image files (png).
- Then move those images a folder in the root of the project callde `assets`
- After that, you will need to run the command:
    ```bash
    npx capacitor-assets generate
    ```
- If everything goes good, you should see the assets generated in the `./android/app/src/main/res/` folder.