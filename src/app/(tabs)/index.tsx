import dayjs from "dayjs";
import { useState } from "react";
import { View, FlatList, StyleSheet, TextInput, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcons from "@expo/vector-icons/Feather";
import { FAB, Portal } from "react-native-paper";
import AccountFormModal from "@/components/AccountFormModal";
import { useSQLiteContext } from "expo-sqlite";
import { useSession } from "@/context/authContext";
import { useQuery } from "@tanstack/react-query";

const PasswordListScreen = () => {
  const db = useSQLiteContext();
  const { session } = useSession();

  const [view, setView] = useState<Record<string, string> | null>();

  const { data } = useQuery({
    queryKey: ["passwords", session?.id],
    queryFn: async () => {
      const result = await db.getAllAsync<Record<string, string>>(
        "SELECT * FROM passwords WHERE user_id = ?",
        [session?.id || ""]
      );
      return result;
    },
  });

  const [modalAdd, setModalAdd] = useState(false);

  const showModalAdd = () => setModalAdd(true);

  const hideModalAdd = () => setModalAdd(false);

  return (
    <SafeAreaView className="relative flex-1 bg-background">
      <View className="h-[72px] flex items-center justify-center">
        <Text className="text-white text-lg font-bold">Home</Text>
      </View>
      <View className="px-4">
        <View className="bg-[#243647] rounded-lg p-3 flex flex-row items-center">
          <FeatherIcons name="search" size={20} color="#94ADC7" />
          <TextInput
            placeholder="Search password..."
            className="w-full bg-transparent text-white pl-4"
            placeholderTextColor="#94ADC7"
          />
        </View>

        <View className="mt-4">
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="py-4 flex flex-row items-center justify-between">
                <View className="flex flex-row items-center">
                  <View className="bg-[#243647] rounded-lg size-12 flex justify-center items-center">
                    <FeatherIcons name="globe" size={20} color="#fff" />
                  </View>
                  <View className="ml-4">
                    <Text className="text-white font-medium">{item.title}</Text>
                    <Text className="text-sm text-[#94ADC7]">
                      Last modified: {dayjs(item.updated_at).format("DD MMM YYYY")}
                    </Text>
                  </View>
                </View>

                <Pressable
                  className="px-4 py-2 bg-[#243647] rounded-lg"
                  onPress={() => {
                    setView(item);
                  }}
                >
                  <Text className="text-white text-sm font-medium">View</Text>
                </Pressable>
              </View>
            )}
          />
        </View>
      </View>

      <FAB icon="plus" style={styles.fab} color="#fff" onPress={showModalAdd} />

      <Portal>
        <AccountFormModal
          visible={modalAdd || !!view}
          initialValues={
            view && view.id
              ? {
                  id: view?.id?.toString(),
                  accountName: view?.title || "",
                  accountUsername: view?.username || "",
                  accountPassword: view?.password || "",
                }
              : null
          }
          onDismiss={() => {
            hideModalAdd();
            setView(null);
          }}
        />
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 100,
    backgroundColor: "#243647",
  },
});

export default PasswordListScreen;
