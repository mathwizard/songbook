import {Token, TokenType} from './model';

export class ChordproTokenizer {
  tokenList: Token[] = [];
  dataBuffer: string
  index = 0
  lastTokenType: TokenType


  constructor(dataBuffer: string) {
    this.dataBuffer = dataBuffer;
  }

  public reinit() {
    this.tokenList = [];
    this.index = 0;
  }

  public getTokenList(): Token[] {
    return this.tokenList;
  }

  public getDataBuffer(): string {
    return this.dataBuffer;
  }

  public parseToken(): Token {
    const i = this.index;
    const last = this.tokenList.length - 1;
    const nextChar = this.dataBuffer[i];
    switch (nextChar) {
      case '\n':
        if (last >= 0) {
          this.parseNewLine(i);
        } else {
          this.lastTokenType = null;
          this.index++;
          return null;
        }
        this.index++;
        break;
      case '{' :
        this.parseLeftCurlyBracket(i);
        this.index++;
        break;
      case '}' :
        this.parseRightCurlyBracket(i);
        this.index++;
        break;
      case '[' :
        this.parseLeftSquareBracket(i);
        this.index++;
        break;
      case ']' :
        if (last >= 0 && this.lastTokenType === TokenType.CHORDPRO_CHORD_TOKEN) {
          this.parseRightSquareBracket(i);
          this.index++;
          break;
        }
      default:
        // Handle chord
        if (last >= 0 && this.lastTokenType === TokenType.CHORDPRO_SQUARE_BRACKET_LEFT) {
          this.index += this.parseChord(i);
        }
        // Handle tag key
        else if (last >= 0 && this.lastTokenType === TokenType.CHORDPRO_CURLY_BRACKET_LEFT) {
          this.index += this.parseTagKey(i);
        }
        // Handle delimiter
        else if (last >= 0 && this.lastTokenType === TokenType.CHORDPRO_TAG_KEY_TOKEN && this.isValidDelimiter(this.dataBuffer[i])) {
          this.parseDelimiter(i);
          this.index++;
        }
        // Handle tag value
        else if (last >= 0 && this.lastTokenType === TokenType.CHORDPRO_TAG_DELIMITER) {
          this.index += this.parseTagValue(i);
        }
        // Handle text
        else {
          this.index += this.parseText(i);
        }
    }
    this.lastTokenType = this.tokenList[this.tokenList.length - 1].type;
    return this.tokenList[this.tokenList.length - 1];
  }

  private parseNewLine(position: number) {
    this.tokenList.push(new Token(position, null, TokenType.CHORDPRO_NEWLINE_TOKEN));
  }

  private isValidDelimiter(c: string): boolean {
    return (c === ':' || c === ' ');
  }

  private parseLeftCurlyBracket(position: number) {
    this.tokenList.push(new Token(position, null, TokenType.CHORDPRO_CURLY_BRACKET_LEFT));
  }

  private parseRightCurlyBracket(position: number) {
    this.tokenList.push(new Token(position, null, TokenType.CHORDPRO_CURLY_BRACKET_RIGHT));
  }

  private parseLeftSquareBracket(position: number) {
    this.tokenList.push(new Token(position, null, TokenType.CHORDPRO_SQUARE_BRACKET_LEFT));
  }

  private parseRightSquareBracket(position: number) {
    this.tokenList.push(new Token(position, null, TokenType.CHORDPRO_SQUARE_BRACKET_RIGHT));
  }

  private parseDelimiter(position: number) {
    this.tokenList.push(new Token(position, null, TokenType.CHORDPRO_TAG_DELIMITER));
  }

  private parse(position: number, tokenType: TokenType, epe: Function): number {
    const start = position
    let length: number;
    let current: string;

    do {
      current = this.dataBuffer[position];
      position++;
    } while (position < this.dataBuffer.length && epe(current));
    if (!epe(current)) {
      length = position - start - 1;
    } else {
      length = position - start;
    }
    this.tokenList.push(new Token(start, length, tokenType));
    console.log(this.tokenList)
    return length;
  }

  private parseChord(position: number): number {
    const epe = (c: string) => c !== ']' && !/\s/.test(c);
    return this.parse(position, TokenType.CHORDPRO_CHORD_TOKEN, epe);
  }

  private parseTagKey(position: number): number {
    const epe = (c: string) => c !== ':' && c !== '}' && !/\s/.test(c);
    return this.parse(position, TokenType.CHORDPRO_TAG_KEY_TOKEN, epe);
  }

  private parseTagValue(position: number): number {
    const epe = (c: string) => c !== '\n' && c !== '}';
    return this.parse(position, TokenType.CHORDPRO_TAG_VALUE_TOKEN, epe);
  }

  private parseText(position: number): number {
    const epe = (c: string) => c !== '[' && c !== '{' && c !== '\n';
    return this.parse(position, TokenType.CHORDPRO_TEXT_TOKEN, epe);
  }

  public hasNextToken(): boolean {
    return this.index < this.dataBuffer.length;
  }

  public tokenize(): Token[] {
    if (this.dataBuffer.length === 0) {
      return this.tokenList;
    }
    do {
      this.parseToken();
    } while (this.hasNextToken());
    return this.tokenList;
  }

}
