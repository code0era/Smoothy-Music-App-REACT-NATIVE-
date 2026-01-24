import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { useSettingsStore } from "./src/store/settingsStore";
import { useTheme } from "./src/theme/useTheme";
import { audioService } from "./src/services/audioService";
import { hydrateStores } from "./src/services/storage";

export default function App() {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const navTheme = useTheme(themeMode);

  useEffect(() => {
    hydrateStores();
    audioService.init(); // configure audio once
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <SafeAreaView style={{ flex: 1 }}>
          <RootNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
