import "react-native-reanimated"; // Important for Reanimated
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import QuizResultScreen from "./components/QuizResultScreen";

// Screens
import Login from "./components/SignInScreen";
import Register from "./components/RegisterScreen";
import HomeScreen from "./components/HomeScreen";
import MyCoursesScreen from "./components/MyCoursesScreen";
import ProfileScreen from "./components/ProfileScreen";
import CourseDetailScreen from "./components/CourseDetailScreen";
import QuizScreen from "./components/QuizScreen";
import ExamScreen from "./components/ExamScreen";
import CourseListScreen from "./components/CourseListScreen";
import EditProfileScreen from "./components/EditProfileScreen";
import QuickBrainQuiz from "./components/QuickBrainQuiz";
import QuizResult from "./components/QuizResult";
import GPACalculatorScreen from "./components/GPACalculator";
import NotesListScreen from "./components/NotesListScreen";
import NoteEditorScreen from "./components/NoteEditorScreen";
import StreakScreen from "./components/StreakScreen";
// Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// ✅ Bottom Tab Navigator
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
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={MyCoursesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ✅ Drawer Navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home" component={BottomTabs} />
      <Drawer.Screen name="All Courses" component={CourseListScreen} />
      <Drawer.Screen name="Note" component={NotesListScreen} />
    </Drawer.Navigator>
  );
}

// ✅ Main App Component
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <Login {...props} setIsAuthenticated={setIsAuthenticated} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : (
          <>
            {/* Main Authenticated App with Drawer and Tabs */}
            <Stack.Screen name="Home" component={DrawerNavigator} />

            {/* Screens outside of tabs/drawers */}
            <Stack.Screen
              name="CourseDetailScreen"
              component={CourseDetailScreen}
            />
            <Stack.Screen name="QuizScreen" component={QuizScreen} />
            <Stack.Screen name="ExamScreen" component={ExamScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="QuickBrainQuiz" component={QuickBrainQuiz} />
            <Stack.Screen name="QuizResult" component={QuizResult} />
            <Stack.Screen
              name="QuizResultScreen"
              component={QuizResultScreen}
            />

            <Stack.Screen
              name="GPACalculator"
              component={GPACalculatorScreen}
            />
            <Stack.Screen name="Notes" component={NotesListScreen} />
            <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
            <Stack.Screen name="Streak" component={StreakScreen} />


          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
