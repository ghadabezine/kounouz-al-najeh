import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Login from "./components/SignInScreen";
import Register from "./components/RegisterScreen";
import HomeScreen from "./components/HomeScreen";
import MyCoursesScreen from "./components/MyCoursesScreen";
import ProfileScreen from "./components/ProfileScreen";
import CourseDetailScreen from "./components/CourseDetailScreen";
import QuizScreen from "./components/QuizScreen";
import ExamScreen from "./components/ExamScreen";
import CourseListScreen from "./components/CourseListScreen"; // Explore Courses

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Courses") {
            iconName = "book";
          } else if (route.name === "Profile") {
            iconName = "person";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff", paddingBottom: 5, height: 60 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={MyCoursesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
       {/* <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />*/}

        <Stack.Screen name="Main" component={BottomTabs} />
        <Stack.Screen name="CourseList" component={CourseListScreen} />
        <Stack.Screen
          name="CourseDetailScreen"
          component={CourseDetailScreen}
        />
        <Stack.Screen name="QuizScreen" component={QuizScreen} />
        <Stack.Screen name="ExamScreen" component={ExamScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
