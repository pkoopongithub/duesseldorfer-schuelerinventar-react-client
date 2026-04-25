import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';
import { Profile, NormType } from '../types';
import { Calculator } from '../services/Calculator';
import { KOMPETENZEN, ITEMS } from '../constants/norms';
import { CompetenceTable } from '../components/CompetenceTable';
import { LoadingSpinner } from '../components/LoadingSpinner';

const screenWidth = Dimensions.get('window').width;

interface ProfileDetailScreenProps {
  route: any;
  navigation: any;
}

export const ProfileDetailScreen: React.FC<ProfileDetailScreenProps> = ({ route, navigation }) => {
  const { profile } = route.params;
  const [normType, setNormType] = useState<NormType>('HS');
  const [activeTab, setActiveTab] = useState(0);
  const [seValues, setSeValues] = useState<number[]>([]);
  const [feValues, setFeValues] = useState<number[]>([]);
  const [seItems, setSeItems] = useState<number[]>([]);
  const [feItems, setFeItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    calculateValues();
  }, [normType]);

  const calculateValues = () => {
    const se = Calculator.extractItems(profile, true);
    const fe = Calculator.extractItems(profile, false);
    setSeItems(se);
    setFeItems(fe);
    
    const { se: seComp, fe: feComp } = Calculator.calculateCompetenceValues(profile, normType);
    setSeValues(seComp);
    setFeValues(feComp);
    setIsLoading(false);
  };

  const correlation = Calculator.calculateCorrelation(seValues, feValues);
  const agreement = Calculator.calculateAgreement(seItems, feItems);
  const interpretation = Calculator.getInterpretation(correlation, agreement, seValues, feValues);

  const handleExport = async () => {
    const exportText = `
DÜSK - Profilauswertung
=======================

Name: ${profile.name}
Gruppe: ${profile.gruppename || 'Keine Gruppe'}
Profil-ID: ${profile.profilID}
Normtabelle: ${normType}

Kompetenzwerte:
${KOMPETENZEN.map((k, i) => `  ${k}: SE=${seValues[i]}/5, FE=${feValues[i]}/5`).join('\n')}

Korrelation: ${correlation.toFixed(2)}
Übereinstimmung: ${agreement.toFixed(1)}%

${interpretation}
    `.trim();

    try {
      await Share.share({
        message: exportText,
        title: `Profil ${profile.name}`,
      });
    } catch (error) {
      Alert.alert('Fehler', 'Export fehlgeschlagen');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const chartData = {
    labels: KOMPETENZEN.map(k => k.substring(0, 8)),
    datasets: [
      { data: seValues, color: () => '#2196F3', strokeWidth: 2 },
      { data: feValues, color: () => '#FF5722', strokeWidth: 2 },
    ],
    legend: ['SE', 'FE'],
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.group}>{profile.gruppename || 'Keine Gruppe'}</Text>
      </View>

      {/* Norm Selector */}
      <View style={styles.normSelector}>
        <SegmentedControl
          values={['HS (Hauptschule)', 'FS (Förderschule)']}
          selectedIndex={normType === 'HS' ? 0 : 1}
          onChange={(event) => {
            setNormType(event.nativeEvent.selectedSegmentIndex === 0 ? 'HS' : 'FS');
          }}
        />
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Icon name="share" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <SegmentedControl
        values={['Selbsteinschätzung', 'Fremdeinschätzung', 'Statistik', 'Alle Items']}
        selectedIndex={activeTab}
        onChange={(event) => setActiveTab(event.nativeEvent.selectedSegmentIndex)}
        style={styles.tabs}
      />

      <ScrollView style={styles.content}>
        {activeTab === 0 && (
          <View>
            <CompetenceTable values={seValues} title="Selbsteinschätzung (SE)" />
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>SE - Profilverlauf</Text>
              <LineChart
                data={{
                  labels: KOMPETENZEN.map(k => k.substring(0, 8)),
                  datasets: [{ data: seValues }],
                }}
                width={screenWidth - 40}
                height={220}
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
          </View>
        )}

        {activeTab === 1 && (
          <View>
            <CompetenceTable values={feValues} title="Fremdeinschätzung (FE)" />
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>FE - Profilverlauf</Text>
              <LineChart
                data={{
                  labels: KOMPETENZEN.map(k => k.substring(0, 8)),
                  datasets: [{ data: feValues }],
                }}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: () => '#FF5722',
                  labelColor: () => '#666',
                  propsForDots: { r: '6', strokeWidth: '2', stroke: '#FF5722' },
                }}
                bezier
                style={styles.chart}
                formatYLabel={(v) => v}
                fromZero
              />
            </View>
          </View>
        )}

        {activeTab === 2 && (
          <View>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Vergleich SE vs FE</Text>
              <LineChart
                data={chartData}
                width={screenWidth - 40}
                height={240}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity, index) => index === 0 ? '#2196F3' : '#FF5722',
                  labelColor: () => '#666',
                }}
                bezier
                style={styles.chart}
                formatYLabel={(v) => v}
                fromZero
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Korrelation (r)</Text>
                <Text style={styles.statValue}>{correlation.toFixed(2)}</Text>
                <Text style={styles.statDesc}>
                  {correlation >= 0.8 ? 'sehr gut' :
                   correlation >= 0.6 ? 'gut' :
                   correlation >= 0.4 ? 'mäßig' :
                   correlation >= 0.2 ? 'schwach' : 'keine'} Übereinstimmung
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Übereinstimmung</Text>
                <Text style={styles.statValue}>{agreement.toFixed(1)}%</Text>
                <Text style={styles.statDesc}>
                  {agreement >= 80 ? 'hohe' :
                   agreement >= 60 ? 'mittlere' :
                   agreement >= 40 ? 'geringe' : 'sehr geringe'} inhaltliche Übereinstimmung
                </Text>
              </View>
            </View>

            <View style={styles.interpretationContainer}>
              <Text style={styles.interpretationTitle}>Interpretation</Text>
              <Text style={styles.interpretationText}>{interpretation}</Text>
            </View>
          </View>
        )}

        {activeTab === 3 && (
          <View style={styles.itemsContainer}>
            <View style={styles.itemsHeader}>
              <Text style={[styles.itemCell, { flex: 3 }]}>Item</Text>
              <Text style={[styles.itemCell, { width: 50 }]}>SE</Text>
              <Text style={[styles.itemCell, { width: 50 }]}>FE</Text>
            </View>
            {ITEMS.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text style={[styles.itemCell, { flex: 3 }]}>{idx + 1}. {item}</Text>
                <Text style={[styles.itemCell, { width: 50, color: '#2196F3' }]}>{seItems[idx]}</Text>
                <Text style={[styles.itemCell, { width: 50, color: '#FF5722' }]}>{feItems[idx]}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  group: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  normSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exportButton: {
    marginLeft: 16,
    padding: 8,
  },
  tabs: {
    margin: 16,
    marginBottom: 0,
  },
  content: {
    flex: 1,
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
  statsContainer: {
    flexDirection: 'row',
    margin: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statDesc: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  interpretationContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  interpretationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  interpretationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  itemsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemsHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemCell: {
    fontSize: 13,
  },
});