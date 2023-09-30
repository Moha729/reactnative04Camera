import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { app, database } from './firebase';

export default function App() {
  alert(JSON.stringify(app, null, 4))
  return (
    <View style={styles.container}>
      <Text>Hello Camera!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
