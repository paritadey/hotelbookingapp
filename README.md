# Getting Started

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

## About the Application:

1. We have used Splash screen, SignUp/SignIn. We have used **AsyncStorage** to store login credentials in the device.
2. We have fetched **current location** with the address.
3. The address/city helps to find **Nearby hotels**. In Nearby hotels we are only showing hotel details in **Web-view** 
4. We have used **Redux-Sagas** for fetching data from API.
5. We have a search bar and it will open a new search screen where on landing, the screen will showcase city location. 
6. There is a filter option and user can also change the city location 
7. Here we have used API data to showcase a list of hotel data depending upon the city location and filter created.
8. On click of any item from the hotel list it will redirect to a Hotel Details Screen.
9. As per availability of hotel the list will display from the API.
10. The Hotel Details screen will have price data, hotel address, hotel name, amenities details and much more. 
11. There is a functionality where on click of hotel name, a Map view screen will be redirected with the Address details of the hotel as marker in the Google map.
11. User can reserve the hotel for a selected time period and on confirming, the hotel will get booked and the data will be stored in **Firebase Realtime database**
12. On successful booking, a popup notification will get displayed.
13. We have a Booking List screen where user can see the booked hotel list with check-in and check-out details. The data is fetched from **Firebase Realtime database**.
14. The past booked hotel details will be featured with **Red bar** to indicate that the check-in date has passed. The Past booked hotel cannot be canceled.
15. The upcoming booked hotel details will be shown with **Green bar** and also has a feature to cancel the reservation. A confirmation pop-up will be showcased to user before canceling the hotel reservation.
16. On successful cancellation, a popup notification will be shown to user for broadcast the changes.
17. User can see a list of **Recent Search** hotels and also can book/reserve hotel from there.
18. User has an option to **Reset Password** from profile section and if user forgets the password in the login screen then, there is an option to change the password by clicking on **Forget Password**.

