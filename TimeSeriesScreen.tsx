import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { apiService } from '../services/ApiService';
import { Profile } from '../types';
import { Calculator } from '../services/Calculator';
import { KOMPETENZEN } from '../constants/norms';

const screenWidth = Dimensions.get('window').width;

interface TimeSeriesScreenProps {
  route: any;
}

export const TimeSeriesScreen: React.FC<TimeSeriesScreenProps> = ({ route }) => {
  const { groupName, groupId } = route.params;
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [competenceValues, setCompetenceValues] = useState<number[][]>([]);
  const [profileNames, setProfileNames] = useState<string[]>([]);
  const [selectedCompetence, setSelectedCompetence] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTimeSeriesData();
  }, []);

  const loadTimeSeriesData = async () => {
    try {
      const allProfiles = await apiService.getProfiles();
      let filteredProfiles = allProfiles;
      
      if (groupId) {
        filteredProfiles = allProfiles.filter(p => p.gruppeID === groupId);
      } else if (groupName) {
        filteredProfiles = allProfiles.filter(p => p.gruppename === groupName);
      }
      
      // Sort by date (assuming createdAt exists)
      filteredProfiles.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
      
      const names: string[] = [];
      const values: number[][] = [];
      
      for (const profile of filteredProfiles) {
        const { se } = Calculator.calculateCompetenceValues(profile);
        names.push(profile.name);
        values.push(se);
      }
      
      setProfileNames(names);
      setCompetenceValues(values);
      setProfiles(filteredProfiles);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (profiles.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Keine Profile in dieser Gruppe</Text>
      </View>
    );
  }

  const chartData = {
    labels: profileNames.map((name, i) => i % 2 === 0 ? name.substring(0, 8) : ''),
    datasets: [
      {
        data: competenceValues.map(v => v[selectedCompetence]),
        color: () => '#2196F3',
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zeitreihe - {groupName || 'Gruppe'}</Text>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Kompetenz auswählen:</Text>
        <Picker
          selectedValue={selectedCompetence}
          onValueChange={(value) => setSelectedCompetence(value)}
          style={styles.picker}
        >
          {KOMPETENZEN.map((comp, idx) => (
            <Picker.Item key={idx} label={comp} value={idx} />
          ))}
        </Picker>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          Entwicklung: {KOMPETENZEN[selectedCompetence]}
        </Text>
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={280}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: () => '#2196F3',
            labelColor: () => '#666',
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#2196F3' },
          }}
          bezier
          style={styles.chart}
          formatYLabel={(v) => v}
          fromZero
        />
      </View>

      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Detaillierte Werte</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.profileNameCell]}>Profil</Text>
          {KOMPETENZEN.map((comp, idx) => (
            <Text key={idx} style={styles.tableCell} numberOfLines={1}>
              {comp.substring(0, 12)}
            </Text>
          ))}
        </View>
        {profiles.map((profile, idx) => (
          <View key={profile.profilID} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.profileNameCell]} numberOfLines={1}>
              {profile.name}
            </Text>
            {competenceValues[idx].map((value, vIdx) => (
              <Text key={vIdx} style={styles.tableCell}>
                {value}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  picker: {
    height: 50,
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tableContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
  },
  profileNameCell: {
    flex: 2,
    textAlign: 'left',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});