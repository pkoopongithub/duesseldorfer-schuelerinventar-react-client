import { NORM_SE_HS, NORM_FE_HS, NORM_SE_FS, NORM_FE_FS, KOMPETENZEN } from '../constants/norms';
import { NormType } from '../types';

export class Calculator {
  
  // Summen für Kompetenzen berechnen
  static calculateSums(items: number[]): number[] {
    const sums = [0, 0, 0, 0, 0, 0, 0];
    
    // Kompetenz 1: Arbeitsverhalten (Items 1-10)
    for (let i = 0; i < 10; i++) sums[1] += items[i];
    
    // Kompetenz 2: Lernverhalten (Items 11-20)
    for (let i = 10; i < 20; i++) sums[2] += items[i];
    
    // Kompetenz 3: Sozialverhalten (Items 21-28 + 9-10)
    for (let i = 20; i < 28; i++) sums[3] += items[i];
    sums[3] += items[8] + items[9];
    
    // Kompetenz 4: Fachkompetenz (Items 29-36)
    for (let i = 28; i < 36; i++) sums[4] += items[i];
    
    // Kompetenz 5: Personale Kompetenz
    sums[5] = items[0] + items[1] + items[5] + items[6] + items[7] +
              items[8] + items[9] + items[11] + items[12] + items[13] + items[14];
    
    // Kompetenz 6: Methodenkompetenz
    sums[6] = items[2] + items[3] + items[4] + items[8] + items[9] +
              items[10] + items[16] + items[17];
    
    return sums;
  }
  
  // Profilwerte berechnen (1-5 Skala)
  static calculateProfileValues(sums: number[], norm: number[][]): number[] {
    const values: number[] = [];
    for (let k = 1; k <= 6; k++) {
      let value = 5;
      for (let p = 0; p < 5; p++) {
        if (sums[k] < norm[k - 1][p]) {
          value = p + 1;
          break;
        }
      }
      values.push(value);
    }
    return values;
  }
  
  // Korrelation berechnen (Pearson)
  static calculateCorrelation(seValues: number[], feValues: number[]): number {
    const n = seValues.length;
    let sumSE = 0, sumFE = 0, sumSEFE = 0;
    let sumSE2 = 0, sumFE2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumSE += seValues[i];
      sumFE += feValues[i];
      sumSEFE += seValues[i] * feValues[i];
      sumSE2 += seValues[i] * seValues[i];
      sumFE2 += feValues[i] * feValues[i];
    }
    
    const numerator = n * sumSEFE - sumSE * sumFE;
    const denominator = Math.sqrt((n * sumSE2 - sumSE * sumSE) * (n * sumFE2 - sumFE * sumFE));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }
  
  // Prozentuale Übereinstimmung
  static calculateAgreement(seItems: number[], feItems: number[]): number {
    let matches = 0;
    for (let i = 0; i < 36; i++) {
      if (seItems[i] === feItems[i]) matches++;
    }
    return (matches * 100) / 36;
  }
  
  // Bewertungstext
  static getRating(value: number): string {
    switch (value) {
      case 1: return 'weit unterdurchschnittlich';
      case 2: return 'unterdurchschnittlich';
      case 3: return 'durchschnittlich';
      case 4: return 'überdurchschnittlich';
      case 5: return 'weit überdurchschnittlich';
      default: return 'unbekannt';
    }
  }
  
  // Interpretationstext
  static getInterpretation(correlation: number, agreement: number, seValues: number[], feValues: number[]): string {
    let text = '';
    
    if (correlation >= 0.8) {
      text += `Sehr gute Übereinstimmung zwischen Selbst- und Fremdeinschätzung (r = ${correlation.toFixed(2)}).\n\n`;
    } else if (correlation >= 0.6) {
      text += `Gute Übereinstimmung zwischen Selbst- und Fremdeinschätzung (r = ${correlation.toFixed(2)}).\n\n`;
    } else if (correlation >= 0.4) {
      text += `Mäßige Übereinstimmung zwischen Selbst- und Fremdeinschätzung (r = ${correlation.toFixed(2)}).\n\n`;
    } else if (correlation >= 0.2) {
      text += `Schwache Übereinstimmung zwischen Selbst- und Fremdeinschätzung (r = ${correlation.toFixed(2)}).\n\n`;
    } else {
      text += `Keine signifikante Übereinstimmung zwischen Selbst- und Fremdeinschätzung (r = ${correlation.toFixed(2)}).\n\n`;
    }
    
    text += `Die inhaltliche Übereinstimmung beträgt ${agreement.toFixed(1)}%.\n\n`;
    text += 'Auswertung der Kompetenzen:\n';
    text += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    text += 'Selbsteinschätzung:\n';
    for (let i = 0; i < 6; i++) {
      text += `  • ${KOMPETENZEN[i]}: ${this.getRating(seValues[i])} (${seValues[i]}/5)\n`;
    }
    text += '\nFremdeinschätzung:\n';
    for (let i = 0; i < 6; i++) {
      text += `  • ${KOMPETENZEN[i]}: ${this.getRating(feValues[i])} (${feValues[i]}/5)\n`;
    }
    
    return text;
  }
  
  // Hilfsfunktion: Items aus Profile extrahieren
  static extractItems(profile: any, isSE: boolean): number[] {
    const items: number[] = [];
    for (let i = 1; i <= 36; i++) {
      const key = isSE ? `item${i}` : `feitem${i}`;
      items.push(profile[key] || 2);
    }
    return items;
  }
  
  // Kompetenzwerte für ein Profil berechnen
  static calculateCompetenceValues(profile: any, normType: NormType = 'HS'): { se: number[], fe: number[] } {
    const seItems = this.extractItems(profile, true);
    const feItems = this.extractItems(profile, false);
    
    const seSums = this.calculateSums(seItems);
    const feSums = this.calculateSums(feItems);
    
    const normSE = normType === 'HS' ? NORM_SE_HS : NORM_SE_FS;
    const normFE = normType === 'HS' ? NORM_FE_HS : NORM_FE_FS;
    
    return {
      se: this.calculateProfileValues(seSums, normSE),
      fe: this.calculateProfileValues(feSums, normFE),
    };
  }
}