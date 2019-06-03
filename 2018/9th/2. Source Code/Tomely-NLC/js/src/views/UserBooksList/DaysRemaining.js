import React, { Component } from "react";
import { ListView, View } from "react-native";
import styles from "./styles";

import { Container, Text, Left, Body, Right } from "native-base";
import moment from "moment";
import ProgressCircle from "react-native-progress-circle";

const DaysRemaining = ({ activity_date, account_type }) => {
  console.log("Inside DaysRemaining !!! Received - " + activity_date);
  console.log("Inside DaysRemaining !!! AccountType - " + account_type);

  var today = moment();
  var formattedActivityDate = moment(activity_date).format("MM/DD/YYYY");

  console.log("Today: " + today);
  console.log("formattedActivityDate: " + formattedActivityDate);

  // Calculate days left from the 15 day checkout period
  var maxDays = 14;

  if (account_type !== "STUDENT" ) {
    maxDays = 28;
  }

  var daysRemaining = maxDays - today.diff(activity_date, "days");
  var displayText = daysRemaining + " days left";
  var color = "lightblue";
  var bgColor = "lightblue";
  if (daysRemaining < 0) {
    displayText =  -1 * daysRemaining + " days past due";
    color = "red";
    bgColor = "red";
    daysRemaining = 0;
  }

  var percent = 100 - daysRemaining * 100 / maxDays;

  console.log("percent: " + percent);
  console.log("daysRemaining: " + daysRemaining);

  return (
      <View>
        <ProgressCircle
          percent={percent}
          radius={30}
          borderWidth={10}
          color={color}
          // shadowColor="#999"
          shadowColor="green"
          // bgColor="#fff"
          bgColor={bgColor}
        />
        <Text style={{ fontSize: 12, margin: 10, width: 100, justifyContent: 'flex-end'}}>
          {displayText}
        </Text>
      </View>
  );
};

export default DaysRemaining;
