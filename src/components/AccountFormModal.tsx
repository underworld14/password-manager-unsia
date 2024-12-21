import { useSession } from "@/context/authContext";
import { encryptPassword } from "@/lib/crypto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Text, View, TextInput } from "react-native";
import { FAB, Modal, Button } from "react-native-paper";

interface AccountFormModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function AccountFormModal({ visible, onDismiss }: AccountFormModalProps) {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  const { session } = useSession();

  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountUsername, setAccountUsername] = useState("");
  const [accountPassword, setAccountPassword] = useState("");

  const addNewAccount = async () => {
    if (!accountName || !accountUsername || !accountPassword || !session) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const encryptedPassword = encryptPassword(accountPassword, accountUsername);

      await db.runAsync(
        "INSERT INTO passwords (title, username, password, user_id) VALUES (?, ?, ?, ?)",
        [accountName, accountUsername, encryptedPassword, session.id]
      );

      queryClient.invalidateQueries({ queryKey: ["passwords", session.id] });

      alert("Account added successfully");

      setAccountName("");
      setAccountUsername("");
      setAccountPassword("");

      onDismiss();
    } catch (error) {
      alert("An error occurred while adding the account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={{
        backgroundColor: "#121A21",
        padding: 16,
        margin: 20,
        borderRadius: 8,
      }}
    >
      <Text className="text-white text-lg font-bold">Add Account</Text>

      <View className="mt-5 gap-3">
        <View className="bg-[#243647] rounded-lg p-3 flex flex-row items-center">
          <TextInput
            placeholder="Account name"
            className="w-full bg-transparent text-white"
            placeholderTextColor="#94ADC7"
            value={accountName}
            onChangeText={setAccountName}
          />
        </View>

        <View className="bg-[#243647] rounded-lg p-3 flex flex-row items-center">
          <TextInput
            placeholder="Account username"
            className="w-full bg-transparent text-white"
            placeholderTextColor="#94ADC7"
            value={accountUsername}
            onChangeText={setAccountUsername}
            autoCapitalize="none"
          />
        </View>

        <View className="bg-[#243647] rounded-lg p-3 flex flex-row items-center">
          <TextInput
            placeholder="Account Password"
            className="w-full bg-transparent text-white"
            placeholderTextColor="#94ADC7"
            value={accountPassword}
            onChangeText={setAccountPassword}
            autoCapitalize="none"
            secureTextEntry
          />
        </View>
      </View>

      <Button
        mode="contained"
        style={{ marginTop: 24, backgroundColor: "#243647", borderRadius: 8 }}
        onPress={addNewAccount}
        loading={loading}
      >
        Save
      </Button>
    </Modal>
  );
}
