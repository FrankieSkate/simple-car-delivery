To starting my application:
npm install

<!-- set up .env file for google api, refer .env.example file

How to get your REACT_APP_GOOGLE_MAPS_API_KEY ?

Create a Google Cloud Project:

Go to the Google Cloud Console.
Click on the project drop-down and select "New Project."
Enter your project name and create the project.
Enable Google Maps API:

In the Google Cloud Console, go to the "APIs & Services" > "Library."
Search for "Maps JavaScript API" and click on it.
Enable the API.
Generate API Key:

Go to "APIs & Services" > "Credentials."
Click on "Create Credentials" and select "API Key."
Copy the generated API key.
Set Up Environment Variable: -->

npm start

<!-- After starting the web application,
 you can use locateMe button to location your current location as starting point. Then input the ending point. Click the submit button and waiting for the server responding. There are 3 cases after click submitting button:
 1. Internal server error -> then fail to get route
 2. Failure on route token -> Location not accessible by car
 3. Success -> the map the shows the route(should be 5 points including 3 waypoints)

 In case 1 and 2, the dialog will show the error, what you need to do is
 to resubmit the addressForm only. Until case 3 appear.

 When you click reset button on the addressForm, the routes on map will be reset.
  -->
