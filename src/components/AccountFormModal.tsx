import { Text, View, TextInput } from "react-native";
import { FAB, Modal, Button } from "react-native-paper";

interface AccountFormModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function AccountFormModal({ visible, onDismiss }: AccountFormModalProps) {
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
          />
        </View>

        <View className="bg-[#243647] rounded-lg p-3 flex flex-row items-center">
          <TextInput
            placeholder="Account Password"
            className="w-full bg-transparent text-white"
            placeholderTextColor="#94ADC7"
          />
        </View>
      </View>

      <Button
        mode="contained"
        color="#243647"
        style={{ marginTop: 24, backgroundColor: "#243647", borderRadius: 8 }}
        onPress={onDismiss}
      >
        Save
      </Button>
    </Modal>
  );
}
