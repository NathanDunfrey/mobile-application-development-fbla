import firebase from "firebase";

let IS_DB_INITIALIZED = false;

const initFirebase = () => {
  if (!IS_DB_INITIALIZED) {
    console.log("Inside initFirebase()");
    var config = {
      apiKey: "AIzaSyD4nzC0SGvI1ENyFyWCqhRdM8uSchDOe8M",
      authDomain: "digi-library.firebaseapp.com",
      databaseURL: "https://digi-library.firebaseio.com",
      projectId: "digi-library",
      storageBucket: "digi-library.appspot.com",
      messagingSenderId: "181731239308"
    };

    var configNLC = {
      apiKey: "AIzaSyCrxVB151w_vvfeMGtxHozrugnWIgRJJm0",
      authDomain: "digi-library2.firebaseapp.com",
      databaseURL: "https://digi-library2.firebaseio.com",
      projectId: "digi-library2",
      storageBucket: "digi-library2.appspot.com",
      messagingSenderId: "173161143614"
    };

    firebase.database.enableLogging(false);
    firebase.initializeApp(config);
    IS_DB_INITIALIZED = true;
  }
};

export const getDatabase = () => {
  console.log("Inside getDatabase()");

  initFirebase();

  console.log(firebase.database());
  return firebase.database();
};

export const getAuth = () => {
  console.log("Inside getAuth()");

  initFirebase();

  console.log(firebase.auth());

  return firebase.auth();
};

export const getStorage = () => {
  console.log("Inside getStorage()");

  initFirebase();

  console.log(firebase.storage());

  return firebase.storage();
};
