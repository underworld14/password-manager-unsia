import { useState } from "react";
import { View, TextInput, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { decryptPassword } from "@/lib/crypto";
import { Link, router } from "expo-router";
import { useSession } from "@/context/authContext";

export default function SignInScreen() {
  const db = useSQLiteContext();
  const { signIn } = useSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username || !password) {
      alert("Please fill all the fields");
      return;
    }

    const user = await db.getFirstAsync<Record<string, string>>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (!user) {
      return alert("User not found");
    }
    const decryptedPassword = decryptPassword(user.password, username);
    if (decryptedPassword !== password) {
      return alert("Invalid password");
    }

    signIn(user);

    return router.replace("/");
  };

  return (
    <SafeAreaView className="relative flex-1 bg-background justify-center">
      <View className="px-4">
        <Text className="text-white text-2xl font-bold text-center">Password Manager</Text>
        <View className="mt-12">
          <TextInput
            placeholder="Email"
            className="w-full bg-[#243647] text-white p-4 rounded-lg mt-4"
            placeholderTextColor="#94ADC7"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            className="w-full bg-[#243647] text-white p-4 rounded-lg mt-4"
            placeholderTextColor="#94ADC7"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View className="mt-12 gap-3">
          <Button mode="contained" onPress={login}>
            Sign In
          </Button>

          <Link href="/sign-up" asChild>
            <Button mode="text">Dont have an account? Sign Up</Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
