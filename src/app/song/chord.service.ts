import { Injectable } from '@angular/core';

@Injectable()
export class ChordService {
  private baseChords = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  constructor() { }

  private getBaseChord(chord: string) {
    const firstLetter = chord[0]
    const secondLetter = chord.length > 1 ? chord[1] : null;

    if (this.baseChords.indexOf(firstLetter) === -1) { return chord; }

    if (!secondLetter) {
      return firstLetter.toUpperCase();
    } else {
      if (secondLetter === '#') {
        return `${firstLetter}${secondLetter}`
      } else if (secondLetter === 'b') {
        return this.halfToneShift(firstLetter, -1);
      } else {
        return firstLetter.toUpperCase();
      }
    }
  }


  private halfToneShift(baseChord: string, numOfHalfTones: number) {
    const idx = this.baseChords.indexOf(baseChord);
    if (idx + numOfHalfTones < 0) {
      return this.baseChords[this.baseChords.length - Math.abs(idx + numOfHalfTones)]
    } else if (idx + numOfHalfTones >= this.baseChords.length) {
      return this.baseChords[idx + numOfHalfTones - this.baseChords.length]
    } else {
      return this.baseChords[idx + numOfHalfTones]
    }
  }

  public capoChord(chord: string, capo: number): string {
    return this.transpose(chord, (-1) * capo);
  }

  public transpose(chord: string, transposition: number): string {
    if (transposition === 0) return chord;
    const splitChords: string[] = chord.split('/') // Split to splt chords and capo them separately
    splitChords.forEach((value, index, array) => {
      const baseChord = this.getBaseChord(value)
      const shiftedBaseChord = this.halfToneShift(baseChord, transposition);
      const shiftedChord = `${shiftedBaseChord}${value.substr(baseChord.length)}`;
      array[index] = shiftedChord;
    });

    return splitChords.join('/')
  }

}
