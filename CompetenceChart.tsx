import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { KOMPETENZEN } from '../constants/norms';

interface CompetenceChartProps {
  values: number[];
  title: string;
  color: string;
}

const screenWidth = Dimensions.get('window').width;

export const CompetenceChart: React.FC<CompetenceChartProps> = ({ values, title, color }) => {
  const chartData = {
    labels: KOMPETENZEN.map(k => k.substring(0, 8)),
    datasets: [{
      data: values,
      color: () => color,
      strokeWidth: 2,
    }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: () => color,
          labelColor: () => '#666',
          style: { borderRadius: 16 },
          propsForDots: { r: '6', strokeWidth: '2', stroke: color },
        }}
        bezier
        style={styles.chart}
        formatYLabel={(value) => value}
        fromZero
        yAxisInterval={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
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
    alignSelf: 'flex-start',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});