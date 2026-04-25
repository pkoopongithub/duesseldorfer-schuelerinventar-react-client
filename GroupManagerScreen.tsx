import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiService } from '../services/ApiService';
import { Group } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const GroupManagerScreen = ({ navigation }: any) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editName, setEditName] = useState('');

  const loadGroups = async () => {
    try {
      const groupsData = await apiService.getGroups();
      setGroups(groupsData);
    } catch (error) {
      Alert.alert('Fehler', 'Gruppen konnten nicht geladen werden');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Gruppennamen ein');
      return;
    }

    try {
      const success = await apiService.createGroup(newGroupName.trim());
      if (success) {
        await loadGroups();
        setShowAddModal(false);
        setNewGroupName('');
      } else {
        Alert.alert('Fehler', 'Gruppe konnte nicht erstellt werden');
      }
    } catch (error) {
      Alert.alert('Fehler', 'Verbindungsfehler');
    }
  };

  const handleDeleteGroup = (group: Group) => {
    Alert.alert(
      'Gruppe löschen',
      `Möchten Sie "${group.name}" wirklich löschen? Profile in dieser Gruppe bleiben erhalten.`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await apiService.deleteGroup(group.gruppeID);
              if (success) {
                await loadGroups();
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

  const handleRenameGroup = async () => {
    if (!editName.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Namen ein');
      return;
    }

    try {
      const success = await apiService.createGroup(editName.trim());
      if (success) {
        const deleteSuccess = await apiService.deleteGroup(editingGroup!.gruppeID);
        if (deleteSuccess) {
          await loadGroups();
          setEditingGroup(null);
          setEditName('');
        }
      }
    } catch (error) {
      Alert.alert('Fehler', 'Umbenennung fehlgeschlagen');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.gruppeID.toString()}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <Text style={styles.groupName}>{item.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => {
                  setEditingGroup(item);
                  setEditName(item.name);
                }}
                style={styles.actionButton}
              >
                <Icon name="edit" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteGroup(item)}
                style={styles.actionButton}
              >
                <Icon name="delete" size={20} color="#FF5722" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Keine Gruppen vorhanden</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Neue Gruppe</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Gruppenname"
              value={newGroupName}
              onChangeText={setNewGroupName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewGroupName('');
                }}
              >
                <Text style={styles.modalButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirm]}
                onPress={handleAddGroup}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Erstellen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rename Modal */}
      <Modal visible={!!editingGroup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Gruppe umbenennen</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Neuer Name"
              value={editName}
              onChangeText={setEditName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => {
                  setEditingGroup(null);
                  setEditName('');
                }}
              >
                <Text style={styles.modalButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirm]}
                onPress={handleRenameGroup}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Speichern</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  groupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  groupName: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancel: {
    backgroundColor: '#f0f0f0',
  },
  modalConfirm: {
    backgroundColor: '#2196F3',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#666',
  },
});