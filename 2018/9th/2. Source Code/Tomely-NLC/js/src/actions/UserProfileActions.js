import { getDatabase, getAuth } from "../../firebase";
import { Actions } from "react-native-router-flux";
import {
  FETCH_ALL_USERS_SUCCESS,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  USER_PROFILE_FETCH_SUCCESS
} from "./types";

export const fetchAllUsers = () => {
  console.log("Inside fetchAllUsers");
  return dispatch => {
    var userRef = getDatabase().ref("/middletonhighschool/users/");

    userRef.on("value", snapshot => {
      var profiles = [];
      // console.log(snapshot.val());
      snapshot.forEach(child => {
        console.log(child.key);

        child.forEach(profile => {
          console.log(profile.key);
          if (profile.key === "profile") {
            profiles.push(profile.val());
          }
        });
      });

      console.log("Profiles: ");
      console.log(profiles);
      dispatch({
        type: FETCH_ALL_USERS_SUCCESS,
        payload: profiles
      });
    });
  };
};

export const userProfileFetch = () => {
  const { currentUser } = getAuth();
  console.log("currentUser: " + currentUser.uid);

  return dispatch => {
    getDatabase()
      .ref(`/middletonhighschool/users/${currentUser.uid}/profile`)
      .once("value", snapshot => {
        dispatch({ type: USER_PROFILE_FETCH_SUCCESS, payload: snapshot.val() });
        console.log("Snapshot.val: " + snapshot.val());
      });
  };
};

export const signupUser = ({ value }) => {
  const { currentUser } = getAuth();

  console.log("Inside createUser (first_name): " + value.first_name);
  console.log("Inside createUser (last_name): " + value.last_name);
  console.log("Inside createUser (email): " + value.email);

  const displayName = value.first_name + " " + value.last_name;

  return dispatch => {
    getAuth()
      .createUserWithEmailAndPassword(value.email, value.password)
      .then(user => {
        createUserProfile(user.uid);
        dispatch({ type: CREATE_USER_SUCCESS, payload: user.uid });
      })
      .catch(() => createUserFail(dispatch));
  };
};

function createUserProfile(userid) {
  console.log("Inside createUserProfile (userid): " + userid);
  return dispatch => {
    getAuth()
      .ref()
      .child("middletonhighschool")
      .child("users")
      .child(userid)
      .child("profile")
      .set(
        {
          email: value.email,
          phone: value.phone,
          id_number: value.id_number,
          first_name: value.first_name,
          last_name: value.last_name,
          gender: value.gender,
          birth_date: value.birth_date,
          member_type: value.member_type,
          grade_level: vaule.grade_level,
          image_url: value.image_url,
          created: value.created,
          created_by: value.created_by,
          updated: value.updated,
          updated_by: value.updated_by
        },
        function(error) {
          if (error) {
            alert("Data could not be saved." + error);
          } else {
            alert("Data saved successfully.");
          }
        }
      )
      .then(user => {
        dispatch({ type: CREATE_USER_PROFILE });
      })
      .catch(() => createUserProfileFail(dispatch));
  };
}

const createUserProfileFail = dispatch => {
  dispatch({ type: CREATE_USER_PROFILE_FAIL });
};

const createUserFail = dispatch => {
  dispatch({ type: CREATE_USER_FAIL });
};
