import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { KOMPETENZEN } from '../constants/norms';

interface CompetenceTableProps {
  values: number[];
  title: string;
}

export const CompetenceTable: React.FC<CompetenceTableProps> = ({ values, title }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <ScrollView horizontal>
      <View>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.cell, styles.headerCell, { width: 120 }]}>Kompetenz</Text>
          {[1, 2, 3, 4, 5].map(i => (
            <Text key={i} style={[styles.cell, styles.headerCell, { width: 40 }]}>{i}</Text>
          ))}
          <Text style={[styles.cell, styles.headerCell, { width: 130 }]}>Bewertung</Text>
        </View>
        
        {/* Rows */}
        {KOMPETENZEN.map((kompetenz, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={[styles.cell, { width: 120 }]}>{kompetenz}</Text>
            {[1, 2, 3, 4, 5].map(i => (
              <Text key={i} style={[styles.cell, { width: 40, textAlign: 'center' }]}>
                {values[idx] === i ? '✓' : ''}
              </Text>
            ))}
            <Text style={[styles.cell, { width: 130 }]}>{this.getRating?.(values[idx]) || ''}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    fontSize: 14,
    paddingHorizontal: 4,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#666',
  },
});