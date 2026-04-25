import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiService } from '../services/ApiService';
import { Profile, Group, ProfileCreate } from '../types';
import { ITEMS, RATING_DESCRIPTIONS } from '../constants/norms';

interface ProfileEditScreenProps {
  route: any;
  navigation: any;
}

export const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({ route, navigation }) => {
  const profile = route.params?.profile as Profile | undefined;
  const [name, setName] = useState(profile?.name || '');
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [seItems, setSeItems] = useState<number[]>(Array(36).fill(2));
  const [feItems, setFeItems] = useState<number[]>(Array(36).fill(2));
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);

  useEffect(() => {
    loadGroups();
    if (profile) {
      loadProfileData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadGroups = async () => {
    try {
      const groupsData = await apiService.getGroups();
      setGroups(groupsData);
      if (profile?.gruppeID) {
        setSelectedGroupId(parseInt(profile.gruppeID));
      }
    } catch (error) {
      Alert.alert('Fehler', 'Gruppen konnten nicht geladen werden');
    }
  };

  const loadProfileData = () => {
    if (profile) {
      const se = [];
      const fe = [];
      for (let i = 1; i <= 36; i++) {
        se.push(profile[`item${i}` as keyof Profile] as number || 2);
        fe.push(profile[`feitem${i}` as keyof Profile] as number || 2);
      }
      setSeItems(se);
      setFeItems(fe);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Namen ein');
      return;
    }

    setIsSaving(true);

    let finalGroupId = selectedGroupId;
    if (showNewGroupInput && newGroupName.trim()) {
      try {
        const success = await apiService.createGroup(newGroupName.trim());
        if (success) {
          const updatedGroups = await apiService.getGroups();
          setGroups(updatedGroups);
          const newGroup = updatedGroups.find(g => g.name === newGroupName.trim());
          if (newGroup) {
            finalGroupId = newGroup.gruppeID;
          }
        }
      } catch (error) {
        Alert.alert('Fehler', 'Gruppe konnte nicht erstellt werden');
        setIsSaving(false);
        return;
      }
    }

    const profileData: ProfileCreate = {
      name: name.trim(),
      gruppeID: finalGroupId || undefined,
      ...buildItemsObject(seItems, feItems),
    };

    try {
      let success;
      if (profile) {
        success = await apiService.updateProfile(profileData, profile.profilID);
      } else {
        success = await apiService.createProfile(profileData);
      }

      if (success) {
        navigation.goBack();
      } else {
        Alert.alert('Fehler', 'Profil konnte nicht gespeichert werden');
      }
    } catch (error) {
      Alert.alert('Fehler', 'Verbindungsfehler');
    } finally {
      setIsSaving(false);
    }
  };

  const buildItemsObject = (se: number[], fe: number[]) => {
    const items: any = {};
    for (let i = 1; i <= 36; i++) {
      items[`item${i}`] = se[i - 1];
      items[`feitem${i}`] = fe[i - 1];
    }
    return items;
  };

  const updateItem = (type: 'se' | 'fe', index: number, value: number) => {
    if (type === 'se') {
      const newItems = [...seItems];
      newItems[index] = value;
      setSeItems(newItems);
    } else {
      const newItems = [...feItems];
      newItems[index] = value;
      setFeItems(newItems);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profilinformationen</Text>
          <TextInput
            style={styles.input}
            placeholder="Name *"
            value={name}
            onChangeText={setName}
          />
          
          <Text style={styles.label}>Gruppe</Text>
          {!showNewGroupInput ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedGroupId}
                onValueChange={(value) => setSelectedGroupId(value)}
                style={styles.picker}
              >
                <Picker.Item label="Keine Gruppe" value={null} />
                {groups.map(group => (
                  <Picker.Item key={group.gruppeID} label={group.name} value={group.gruppeID} />
                ))}
                <Picker.Item label="+ Neue Gruppe..." value="new" />
              </Picker>
              {selectedGroupId === 'new' && (
                <TouchableOpacity onPress={() => setShowNewGroupInput(true)}>
                  <Text style={styles.newGroupLink}>Neue Gruppe erstellen</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Neuer Gruppenname"
                value={newGroupName}
                onChangeText={setNewGroupName}
              />
              <TouchableOpacity onPress={() => setShowNewGroupInput(false)}>
                <Text style={styles.cancelLink}>Abbrechen</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 0 && styles.activeTab]}
            onPress={() => setActiveTab(0)}
          >
            <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
              Selbsteinschätzung
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 1 && styles.activeTab]}
            onPress={() => setActiveTab(1)}
          >
            <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
              Fremdeinschätzung
            </Text>
          </TouchableOpacity>
        </View>

        {/* Items */}
        {(activeTab === 0 ? seItems : feItems).map((value, idx) => (
          <View key={idx} style={styles.itemCard}>
            <Text style={styles.itemName}>
              {idx + 1}. {ITEMS[idx]}
            </Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4].map(rating => (
                <TouchableOpacity
                  key={rating}
                  style={[styles.ratingButton, value === rating && styles.ratingSelected]}
                  onPress={() => updateItem(activeTab === 0 ? 'se' : 'fe', idx, rating)}
                >
                  <Text style={[styles.ratingText, value === rating && styles.ratingTextSelected]}>
                    {rating}
                  </Text>
                  <Text style={styles.ratingLabel}>{RATING_DESCRIPTIONS[rating]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Abbrechen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.disabledButton]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Speichern</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  newGroupLink: {
    color: '#2196F3',
    padding: 12,
    textAlign: 'center',
  },
  cancelLink: {
    color: '#999',
    padding: 12,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  itemCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  ratingSelected: {
    backgroundColor: '#2196F3',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  ratingTextSelected: {
    color: '#fff',
  },
  ratingLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
});