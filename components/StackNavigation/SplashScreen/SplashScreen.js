import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

export default function SplashScreen(props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([
    {
      image: require("../../../assets/1.png"),
      title: "Better Education",
      color: "#0c6333",
      description:
        "With Advanced Growth Learning, you are presented with teachers who are masters of their fields, not only will you get the knowledge from textbooks but also from real-life experiences.",
    },
    {
      image: require("../../../assets/2.png"),
      title: "Visualize Concepts",
      color: "#de553a",
      description:
        "A concept learned through mapping of images is retained in our mind for a longer period. We believe at providing a clear understanding of the concepts through  visualising the topics so that students can get a better explanation on any topic.",
    },
    {
      image: require("../../../assets/3.png"),
      title: "Time Management",
      color: "#FF4e5a",
      description: `The key is not spending time, but investing it. With this belief we aim to provide you smooth and hassle free application experience. We care for your time and value it.`,
    },
    {
      image: require("../../../assets/4.png"),
      title: "24/7 Doubt Solving",
      color: "#A838D7",
      description:
        "We believe that the doubt should not thrive in any mind for so long, go ahead with the 24/7 doubt solving feature for an instant and hassle free doubt clearing experience.",
    },
  ]);

  const nextStep = () => {
    setCurrentStep(currentStep >= 3 ? 3 : currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep <= 0 ? 0 : currentStep - 1);
  };

  const gotoLoginPage = () => {
    props.navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated={true} backgroundColor={steps[currentStep].color} />
      <View style={styles.headerTxtContainer}>
        <Text style={{ ...styles.headerTxt, color: steps[currentStep].color }}>
          AGL LEARNING APP
        </Text>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("Login")}
          style={{
            ...styles.skipTxtContainer,
            borderColor: steps[currentStep].color,
          }}
        >
          <Text
            mode="outlined"
            style={{
              color: steps[currentStep].color,
            }}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>
      <Image
        source={steps[currentStep].image}
        style={styles.stepImage}
        resizeMode="cover"
      />
      <View style={styles.stepIndicatorView}>
        {steps.map((step, index) => {
          return (
            <View
              key={index}
              style={{
                ...styles.stepIndicator,
                width: currentStep === index ? 40 : 30,
                backgroundColor:
                  currentStep === index ? steps[currentStep].color : "gray",
              }}
            ></View>
          );
        })}
      </View>

      <Text style={styles.title}>{steps[currentStep].title}</Text>
      <Text style={styles.description}>{steps[currentStep].description}</Text>
      <View style={styles.navigationView}>
        {currentStep > 0 ? (
          <TouchableOpacity
            onPress={() => prevStep()}
            style={{
              ...styles.navigationBtn,
              backgroundColor: steps[currentStep].color,
              borderTopEndRadius: 20,
              borderBottomEndRadius: 20,
            }}
          >
            <Text style={styles.navigationBtnTxt}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}

        <TouchableOpacity
          onPress={() => (currentStep == 3 ? gotoLoginPage() : nextStep())}
          style={{
            ...styles.navigationBtn,
            backgroundColor: steps[currentStep].color,
            borderTopStartRadius: 20,
            borderBottomStartRadius: 20,
          }}
        >
          <Text style={styles.navigationBtnTxt}>
            {currentStep == 3 ? "Login" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTxtContainer: {
    flexDirection: "row",
    marginTop: -30,
    width: "90%",
  },
  headerTxt: {
    fontFamily: "WelcomeSummer-GOqXP",
    fontSize: 24,
  },
  skipTxtContainer: {
    position: "absolute",
    right: 0,
    borderWidth: 2,
    borderRadius: 8,
    padding: 5,
  },
  stepImage: {
    width: "100%",
    height: "50%",
    marginVertical: 30,
  },
  stepIndicatorView: {
    flexDirection: "row",
  },
  stepIndicator: {
    height: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  title: {
    fontFamily: "RanilleNormalRegular-EaZJj",
    fontSize: 25,
    fontWeight: "800",
    marginVertical: 15,
  },
  description: {
    textAlign: "center",
    paddingHorizontal: 10,
  },
  navigationView: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  navigationBtn: {
    height: 40,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationBtnTxt: {
    color: "white",
    fontWeight: "bold",
  },
});
