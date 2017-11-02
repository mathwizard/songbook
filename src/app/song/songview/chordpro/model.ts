export class ChElement {
  public kind: 'block' | 'inline'
  public forPerson: string;
}

export class ChordProRoot {
  title: string
  subtitle: string
  key: string
  capo = {};
  definitions: InlineElement[] = []
  elements: ChElement[] = []
}

export class InlineElement extends ChElement {
  content: string
  type: InlineElementType


  constructor(type: InlineElementType, content: string, forPerson: string) {
    super();
    this.content = content;
    this.type = type;
    this.kind = 'inline'
    this.forPerson = forPerson;
  }
}

export class CapoElement extends InlineElement {
  musician: string
  capo: number

  constructor(type: InlineElementType, musician: string, capo: number) {
    super(type, null, musician);
    this.musician = musician;
    this.capo = capo;
  }
}

export class ChordLyricElement extends InlineElement {
  chord: string
  lyric: string

  constructor(chord: string, lyric: string) {
    super(InlineElementType.SONGBOOK_CHORDLYRIC, null, null);
    this.chord = chord;
    this.lyric = lyric;
  }
}

export enum InlineElementType {
  CHORDPRO_LYRIC, // lyric
  CHORDPRO_CHORD, // chord
  CHORDPRO_TITLE, // title
  CHORDPRO_SUBTITLE, // subtitle
  CHORDPRO_DEFINE, // define
  CHORDPRO_COMMENT, // comment
  CHORDPRO_CAPO, // capo
  CHORDPRO_KEY, // key
  SONGBOOK_NEWLINE,
  SONGBOOK_CHORDLYRIC
}


export class BlockElement extends ChElement {
  attribute: string
  children: InlineElement[] = []
  type: BlockElementType


  constructor(type: BlockElementType, attribute: string, forPerson: string) {
    super()
    this.attribute = attribute;
    this.type = type;
    this.kind = 'block'
    this.forPerson = forPerson;
  }
}

export enum BlockElementType {
  CHORDPRO_CHORUS, // chorus
  CHORDPRO_HIGHLIGHT, // highlight
  CHORDPRO_TAB, // tab
  CHORDPRO_BRIDGE // BRIDGE
}

export class Token {
  position: number
  length: number
  type: TokenType


  constructor(position: number, length: number, type: TokenType) {
    this.position = position;
    this.length = length;
    this.type = type;
  }

  public getString(charArray: string): string {
    const str = charArray.substr(this.position, this.length);
    console.log(str)
    return str;
  }
}

export enum TokenType {
  CHORDPRO_NEWLINE_TOKEN, // \n
  CHORDPRO_SQUARE_BRACKET_LEFT, // [
  CHORDPRO_SQUARE_BRACKET_RIGHT, // ]
  CHORDPRO_CHORD_TOKEN , //
  CHORDPRO_CURLY_BRACKET_LEFT, // {
  CHORDPRO_CURLY_BRACKET_RIGHT, // }
  CHORDPRO_TAG_DELIMITER, // : or space
  CHORDPRO_TAG_KEY_TOKEN, // tag key
  CHORDPRO_TAG_VALUE_TOKEN, // tag attribute
  CHORDPRO_TEXT_TOKEN // text
}
