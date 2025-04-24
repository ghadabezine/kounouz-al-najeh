import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StreakIcon = ({ streakCount }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Streak')}>
      <Image source={require('../assets/flameBox.png')} style={styles.icon} />
      <Text style={styles.count}>{streakCount}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 24, height: 24, marginRight: 4 },
  count: { fontWeight: 'bold', fontSize: 16, color: '#F67280' },
});

export default StreakIcon;
