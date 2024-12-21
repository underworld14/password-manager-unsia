import { useState } from "react";
import { View, TextInput, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { encryptPassword } from "@/lib/crypto";
import { Link, router } from "expo-router";

export default function SignInScreen() {
  const db = useSQLiteContext();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const registerUser = async () => {
    try {
      if (!username || !password || !fullName) {
        alert("Please fill all the fields");
        return;
      }
      setLoading(true);
      const encryptedPassword = encryptPassword(password, username);

      await db.runAsync("INSERT INTO users (username, full_name, password) VALUES (?, ?, ?)", [
        username,
        fullName,
        encryptedPassword,
      ]);

      return router.push("/sign-in");
    } catch (error) {
      console.log(error);
      alert("An error occurred while registering the user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="relative flex-1 bg-background justify-center">
      <View className="px-4">
        <Text className="text-white text-2xl font-bold text-center">Password Manager</Text>
        <View className="mt-12 gap-4">
          <TextInput
            placeholder="Full Name"
            className="w-full bg-[#243647] text-white p-4 rounded-lg"
            placeholderTextColor="#94ADC7"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Usernameus"
            className="w-full bg-[#243647] text-white p-4 rounded-lg"
            placeholderTextColor="#94ADC7"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            className="w-full bg-[#243647] text-white p-4 rounded-lg"
            placeholderTextColor="#94ADC7"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View className="mt-12 gap-3">
          <Button mode="contained" onPress={registerUser} loading={loading}>
            Sign Up
          </Button>

          <Link href="/sign-in" asChild>
            <Button mode="text">Already have an account? Sign In</Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
