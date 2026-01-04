#  Freizeit Media

>Freizeit Media is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more – on thousands of internet-connected devices.You can watch as much as you want, whenever you want, without a single ad – all for one low monthly price. There's always something new to discover, and new TV shows and movies are added every week!

## DEPENDENCIES

Freizeit Media uses a number of open source projects to work properly:

* React Native 
* Firebase
* AXIOS 0.19.2
* React Navigation 4.0
* Rn Fetch Blob
* React Native Video
* Async Storage 1.7.1
* Netinfo 5.9.1
* Push Notification IOS 1.2.0
* slider 2.0.9
* Firebase App 7.0.1
* Firebase Messaging 7.0.1 etc & you can find more in package.json inside root directory

## USAGE

### Clone
You can start by cloning this repository. In the current state of this project, it should give you no issues at all, just run the script, delete your node modules and reinstall them and you should be good to go.

Keep in mind that this library can cause trouble if you are renaming a project that uses Pods on the iOS side.

After that you should proceed as with any javascript project:

- Go to your project's root folder and run `npm install`.
- If you are using Xcode 12.5 or higher got to /ios and execute `pod install --`repo-update`
- Run `npx react-native run-ios` or `npx react-native run-android` to start your application!

## Folder structure

This template follows a very simple project structure:
- `assets`: Asset folder to store all images, vectors, etc.
- `src`: This folder is the main container of all the code inside your application.
  - `components`: Folder to store any common component that you use through your app (such as a generic button)
  - `config`: This folder contains all the routes.
  - `constants`: Folder to store any kind of constant that you have.
  - `navigation`: Folder to store the navigators.
    - `App.js`: Main component that starts your whole app.
  - `utils`: Folder to store all your network calls, Local Storage, Animations.
  - `localization`: Folder to store the languages files.
  - `Redux`: This folder should have all your reducers, actions and expose the combined result using its `index.js`
  - `screens`: Folder that contains all your application screens/features.
    - `Screen`: Each screen should be stored inside its folder and inside it a file for its code and a separate one for the styles and tests.
      - `index.js`
      - `styles.js`
  - `index.js`: Entry point of your application as per React-Native standards.

Go to your project's root folder and run npm install.

If you are using Xcode 12.5 or higher got to /ios and execute pod install --repo-update`
Run npm run ios or npm run android to start your application!

## Generate production version

These are the steps to generate `.apk`, `.aab` and `.ipa` files

### Android

1. Generate an upload key
2. Setting up gradle variables
3. Go to the android folder
4. Clean the gradle first: ./gradlew clean
4. Execute `./gradlew assembleRelease` or `./gradlew bundleRelease`

Note: You have three options to execute the project
`assemble:` Generates an apk that you can share with others.
`install:` When you want to test a release build on a connected device.
`bundle:` When you are uploading the app to the Play Store.

### iOS

1. Go to the Xcode
2. Select the schema
3. Select 'Any iOS device' as target
4. Product -> Archive


### Authors
- Shubham Tiwari 


License
----

MIT


**Cheers, Happy Coding!**
# fzlatest
# fzlatest
# fzlatest
# fzlatest
