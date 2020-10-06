import * as firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyAl1Mho13tGAx5AZpFtNVDMNCRPI7uPxz4",
    authDomain: "nithin-ecc45.firebaseapp.com",
    databaseURL: "https://nithin-ecc45.firebaseio.com",
    projectId: "nithin-ecc45",
    storageBucket: "nithin-ecc45.appspot.com",
    messagingSenderId: "1034458624852",
    appId: "1:1034458624852:web:96c9e5a5563769629bcec1",
    measurementId: "G-5WJ2XD1J2N"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();