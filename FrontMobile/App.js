import React, { useState, useEffect } from "react";
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

import GenerateQuizScreen from "./components/GenerateQuizScreen";

import EditProfileScreen from "./components/EditProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/** ✅ Bottom Tabs Navigation */
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";

          else if (route.name === "Courses") iconName = "book";
          else if (route.name === "Profile") iconName = "person";
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

/** ✅ Main App with Authentication Handling */
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    /** ✅ Check for authentication token */
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsAuthenticated(!!token); // ✅ Set true if token exists
    };
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* ✅ Show Login/Register if NOT authenticated */}
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login">
              {(props) => <Login {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : (
          <>
            {/* ✅ Show Bottom Tabs if Authenticated */}
            <Stack.Screen name="Main" component={BottomTabs} />
            <Stack.Screen name="CourseList" component={CourseListScreen} />
            <Stack.Screen name="CourseDetailScreen" component={CourseDetailScreen} />
            <Stack.Screen name="QuizScreen" component={QuizScreen} />
            <Stack.Screen name="ExamScreen" component={ExamScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="MyCoursesScreen" component={MyCoursesScreen} />
            <Stack.Screen name="GenerateQuizScreen" component={GenerateQuizScreen} />



          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
