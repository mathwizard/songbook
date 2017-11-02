import {ChordproTokenizer} from './tokenizer';
import {
  BlockElement, BlockElementType, CapoElement, ChElement, ChordLyricElement, ChordProRoot, InlineElement,
  InlineElementType, Token,
  TokenType
} from './model';
import {containsTree} from '@angular/router/src/url_tree';

export class ChordproParser {
  tokenizer: ChordproTokenizer;
  chordproRoot: ChordProRoot;

  constructor(tokenizer: ChordproTokenizer) {
    this.tokenizer = tokenizer;
    this.chordproRoot = new ChordProRoot();
  }

  public  parseTokenizer(convertToChordLyrics = false): ChordProRoot {
    let currentBlock: BlockElement = null;
    while (this.tokenizer.hasNextToken()) {
      const token = this.tokenizer.parseToken();
      if (token != null) {
        if (token.type === TokenType.CHORDPRO_CURLY_BRACKET_LEFT) { // left curly bracket
          const currentElement: ChElement = this.parseTag();
          if (currentElement instanceof InlineElement && (currentElement as InlineElement).type === InlineElementType.CHORDPRO_DEFINE) {
            this.chordproRoot.definitions.push(currentElement as InlineElement);
          } else if (currentBlock == null && currentElement != null) {
            if (currentElement instanceof BlockElement) {
              currentBlock = currentElement as BlockElement;
            }
            this.chordproRoot.elements.push(currentElement);
          } else {
            if (currentElement != null) {
              currentBlock.children.push(currentElement as InlineElement);
            } else {
              currentBlock = null;
            }
          }
          this.tokenizer.parseToken(); // right curly bracket
        } else if (token.type === TokenType.CHORDPRO_SQUARE_BRACKET_LEFT) { // left square bracket
          const element: ChElement = this.parseChord();
          if (currentBlock != null) {
            currentBlock.children.push(element as InlineElement);
          } else {
            this.chordproRoot.elements.push(element);
          }
          this.tokenizer.parseToken(); // right square bracket
        } else if (token.type === TokenType.CHORDPRO_NEWLINE_TOKEN) {
          const element: InlineElement = this.parseNewline(token);
          if (currentBlock != null) {
            currentBlock.children.push(element as InlineElement);
          } else {
            this.chordproRoot.elements.push(element);
          }
        } else {
          const element: ChElement = this.parseLyric(token);
          if (currentBlock != null) {
            currentBlock.children.push(element as InlineElement);
          } else {
            this.chordproRoot.elements.push(element);
          }
        }
      }
    }

    if (convertToChordLyrics) {
      const elements = this.convertChordLyrics(this.chordproRoot.elements);

      // Remove all empty strings and newlines from the start of the song
      let inRealSong = false;
      for (let i = 0; i < elements.length; i++) {
        const value = elements[i];
        if (inRealSong) { continue }
        if (value instanceof InlineElement && value.type === InlineElementType.SONGBOOK_NEWLINE) { elements[i] = null; continue; }
        if (value instanceof InlineElement && value.type === InlineElementType.CHORDPRO_LYRIC && value.content.trim().length === 0) { elements[i] = null; continue; }
        inRealSong = true;
      }

      this.chordproRoot.elements = elements.filter(value => value != null)
    }

    return this.chordproRoot;
  }

  private convertChordLyrics(elements: ChElement[]) {
    const convertedElements: ChElement[] = []
    let chord = null;
    let lyric = '';
    elements.forEach(value => {
      if (value instanceof InlineElement && value.type === InlineElementType.CHORDPRO_CHORD) {
        if (chord !== null || lyric.length > 0) { convertedElements.push(new ChordLyricElement(chord, lyric)) }
        chord = value.content
        lyric = ''
      } else if (value instanceof InlineElement && value.type === InlineElementType.CHORDPRO_LYRIC) {
        if (chord) {
          lyric += value.content
        } else {
          convertedElements.push(value);
        }
      } else if (value instanceof InlineElement && value.type === InlineElementType.SONGBOOK_NEWLINE) {
        if (chord) {
          convertedElements.push(new ChordLyricElement(chord, lyric));
          convertedElements.push(value);
          chord = null;
          lyric = '';
        } else {
          convertedElements.push(value);
          chord = null;
          lyric = '';
        }

      } else if (value instanceof BlockElement) {
        value.children = this.convertChordLyrics(value.children) as InlineElement[];
        convertedElements.push(value);
      } else {
        convertedElements.push(value);
      }
    });

    return convertedElements;
  }

  private parseTag(): ChElement {
    const token: Token = this.tokenizer.parseToken(); // key
    const rawTagKey: string = token.getString(this.tokenizer.getDataBuffer());
    const tagKey = rawTagKey.split('-')[0].toLowerCase();
    const tagKeyFor = rawTagKey.split('-').length > 1 ? rawTagKey.split('-')[1] : null;

    if (tagKey === 't' || tagKey === 'title') { // parse title
      this.chordproRoot.title = this.parseInlineElement(InlineElementType.CHORDPRO_TITLE, tagKeyFor, this.tokenizer).content;
      return null;
    } else if (tagKey === 'st' || tagKey === 'subtitle') { // parse subtitle
      this.chordproRoot.subtitle = this.parseInlineElement(InlineElementType.CHORDPRO_SUBTITLE, tagKeyFor, this.tokenizer).content;
      return null;
    } else {
      switch (tagKey) {
        case 'capo':
          const capo: CapoElement = this.parseCapo(tagKey, InlineElementType.CHORDPRO_CAPO, tagKeyFor, this.tokenizer)
          this.chordproRoot.capo[capo.musician] = capo.capo;
          return null;
        case 'c':
        case 'comment':
          return this.parseInlineElement(InlineElementType.CHORDPRO_COMMENT, tagKeyFor, this.tokenizer);
        case 'd':
        case 'define':
          return this.parseInlineElement(InlineElementType.CHORDPRO_DEFINE, tagKeyFor, this.tokenizer);
        case 'soc':
        case 'start_of_chorus':
          return this.parseBlockElement(BlockElementType.CHORDPRO_CHORUS, tagKeyFor, this.tokenizer);
        case 'eoc':
        case 'end_of_chorus':
          return null;
        case 'sob':
          return this.parseBlockElement(BlockElementType.CHORDPRO_BRIDGE, tagKeyFor, this.tokenizer);
        case 'eob':
          return null;
        case 'soh':
        case 'start_of_highlight':
          return this.parseBlockElement(BlockElementType.CHORDPRO_HIGHLIGHT, tagKeyFor, this.tokenizer);
        case 'eoh':
        case 'end_of_highlight':
          return null;
        case 'sot':
        case 'start_of_tab':
          return this.parseBlockElement(BlockElementType.CHORDPRO_TAB, tagKeyFor, this.tokenizer);
        case 'eot':
        case 'end_of_tab':
          return null;
        default:
          console.log(`Unknown tag ${tagKey}`);
          this.parseInlineElement(InlineElementType.CHORDPRO_COMMENT, tagKeyFor, this.tokenizer); // Parse unknown element so that it does not go into lyrics
          return null;
      }
    }
  }

  private parseChord(): ChElement {
    const token = this.tokenizer.parseToken(); // chord
    return new InlineElement(InlineElementType.CHORDPRO_CHORD, token.getString(this.tokenizer.getDataBuffer()), null);
  }

  private  parseLyric(token: Token): ChElement {
    return new InlineElement(InlineElementType.CHORDPRO_LYRIC, token.getString(this.tokenizer.getDataBuffer()), null);
  }

  private parseNewline(token: Token): InlineElement {
    return new InlineElement(InlineElementType.SONGBOOK_NEWLINE, '', null);
  }

  private parseInlineElement(elementType: InlineElementType, elementFor: string, tokenizer: ChordproTokenizer):  InlineElement {
    tokenizer.parseToken(); // delimiter
    const value = tokenizer.parseToken().getString(this.tokenizer.getDataBuffer()); // tag value
    return new InlineElement(elementType, value, elementFor);
  }

  private parseCapo(capoTagName: string, elementType: InlineElementType, elementFor: string, tokenizer: ChordproTokenizer):  CapoElement {
    tokenizer.parseToken(); // delimiter
    const value = tokenizer.parseToken().getString(this.tokenizer.getDataBuffer()); // tag value
    return new CapoElement(elementType, elementFor ? elementFor : 'default', parseInt(value, 10));
  }

  private parseBlockElement(elementType: BlockElementType, elementFor: string, tokenizer: ChordproTokenizer): BlockElement {
    let element: BlockElement ;
    const token = this.tokenizer.parseToken(); // delimiter?
    if (token.type === TokenType.CHORDPRO_TAG_DELIMITER) {
      tokenizer.parseToken();
      const value = tokenizer.parseToken().getString(tokenizer.getDataBuffer()); // tag value
      element = new BlockElement(elementType, value, elementFor);
    } else {
      element = new BlockElement(elementType, null, elementFor);
    }
    return element;
  }

}
