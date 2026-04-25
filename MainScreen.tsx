import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiService } from '../services/ApiService';
import { Profile, Group } from '../types';
import { ProfileCard } from '../components/ProfileCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const MainScreen = ({ navigation }: any) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupFilter, setShowGroupFilter] = useState(false);

  const loadData = async () => {
    try {
      const [profilesData, groupsData] = await Promise.all([
        apiService.getProfiles(),
        apiService.getGroups(),
      ]);
      setProfiles(profilesData);
      setGroups(groupsData);
      applyFilters(profilesData, searchText, selectedGroup);
    } catch (error) {
      Alert.alert('Fehler', 'Daten konnten nicht geladen werden');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = (data: Profile[], search: string, group: Group | null) => {
    let filtered = [...data];
    
    if (search.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.gruppename?.toLowerCase().includes(search.toLowerCase()) ?? false)
      );
    }
    
    if (group) {
      filtered = filtered.filter(p => p.gruppename === group.name);
    }
    
    setFilteredProfiles(filtered);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    applyFilters(profiles, text, selectedGroup);
  };

  const handleGroupFilter = (group: Group | null) => {
    setSelectedGroup(group);
    applyFilters(profiles, searchText, group);
    setShowGroupFilter(false);
  };

  const handleDeleteProfile = (profile: Profile) => {
    Alert.alert(
      'Profil löschen',
      `Möchten Sie "${profile.name}" wirklich löschen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await apiService.deleteProfile(profile.profilID);
              if (success) {
                await loadData();
              } else {
                Alert.alert('Fehler', 'Löschen fehlgeschlagen');
              }
            } catch (error) {
              Alert.alert('Fehler', 'Verbindungsfehler');
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Suchen..."
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText !== '' && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterButton, !selectedGroup && styles.activeFilter]}
          onPress={() => handleGroupFilter(null)}
        >
          <Text style={styles.filterText}>Alle</Text>
        </TouchableOpacity>
        
        {groups.slice(0, 3).map(group => (
          <TouchableOpacity
            key={group.gruppeID}
            style={[styles.filterButton, selectedGroup?.gruppeID === group.gruppeID && styles.activeFilter]}
            onPress={() => handleGroupFilter(group)}
          >
            <Text style={styles.filterText} numberOfLines={1}>
              {group.name}
            </Text>
          </TouchableOpacity>
        ))}
        
        {groups.length > 3 && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowGroupFilter(true)}
          >
            <Text style={styles.filterText}>...</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Profile List */}
      <FlatList
        data={filteredProfiles}
        keyExtractor={(item) => item.profilID}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            onPress={() => navigation.navigate('ProfileDetail', { profile: item })}
            onLongPress={() => {
              Alert.alert(
                'Optionen',
                `Was möchten Sie mit "${item.name}" tun?`,
                [
                  { text: 'Abbrechen', style: 'cancel' },
                  { text: 'Bearbeiten', onPress: () => navigation.navigate('ProfileEdit', { profile: item }) },
                  { text: 'Löschen', style: 'destructive', onPress: () => handleDeleteProfile(item) },
                ]
              );
            }}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Keine Profile gefunden</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ProfileEdit')}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeFilter: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});