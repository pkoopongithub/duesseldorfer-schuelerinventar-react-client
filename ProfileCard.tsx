import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
  onPress: () => void;
  onLongPress?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onPress, onLongPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={onPress}
    onLongPress={onLongPress}
    delayLongPress={500}
  >
    <View style={styles.content}>
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.group}>{profile.gruppename || 'Keine Gruppe'}</Text>
    </View>
    <Text style={styles.id}>{profile.profilID}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  group: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  id: {
    fontSize: 12,
    color: '#999',
  },
});