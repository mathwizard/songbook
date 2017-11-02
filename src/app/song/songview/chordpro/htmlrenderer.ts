

import {BlockElement, BlockElementType, ChElement, ChordProRoot, InlineElement, InlineElementType} from './model';

export interface ChordproRenderer {
  render(root: ChordProRoot): string;
}

export class ChordproHtmlRenderer implements ChordproRenderer {

  inChordLyric = false;

  public render(root: ChordProRoot): string {
    const html: string[] = [];
    root.elements.forEach(value => {
      html.push(this.renderElement(value))
    });
    return html.join('');
  }

  private renderElement(element: ChElement): string {

    if (element instanceof InlineElement) {
      switch (element.type) {
        case InlineElementType.CHORDPRO_CHORD: {
          const chord = `<span class="cpChordLyric"><span class="cpChord">${element.content}</span>`;
          const out = this.inChordLyric ? `</span>${chord}` : chord
          this.inChordLyric = true
          return out;
        }
        case InlineElementType.CHORDPRO_COMMENT: return `<span class="cpComment">${element.content}</span>`;
        case InlineElementType.CHORDPRO_DEFINE: break;
        case InlineElementType.CHORDPRO_SUBTITLE: return `<h2 class="cpSubtitle">${element.content}</h2>`;
        case InlineElementType.CHORDPRO_TITLE: return `<h1 class="cpTitle">${element.content}</h1>`;
        case InlineElementType.SONGBOOK_NEWLINE: {
          const newLine =  this.inChordLyric ? '</span><br/>' : '<br/>'
          this.inChordLyric = false;
          return newLine;
        }
        case InlineElementType.CHORDPRO_LYRIC: {
          return `<span class="cpLyric">${element.content}</span>`;
        }
      }
    } else if (element instanceof BlockElement) {
      switch (element.type) {
        case BlockElementType.CHORDPRO_CHORUS: return this.renderChorus(element);
        case BlockElementType.CHORDPRO_HIGHLIGHT: return this.renderHighlight(element);
        case BlockElementType.CHORDPRO_TAB: return this.renderTab(element);
      }
    } else {
      console.log('Unknown element type ' + element)
    }
  }

  private renderChorus(element: BlockElement): string {
    const html: string[] = [];
    this.inChordLyric = false;
    html.push('<span class="cpChorus">')
    element.children.forEach(value => html.push(this.renderElement(value)));
    html.push('</span>')
    return html.join('');
  };

  private renderHighlight(element: BlockElement): string {
    const html: string[] = [];
    html.push('<span class="cpHighligh">')
    element.children.forEach(value => html.push(this.renderElement(value)))
    html.push('</span>')
    return html.join('');
  };

  private renderTab(element: BlockElement): string {
    const html: string[] = [];
    html.push('<div class="cpTab">')
    // TODO
    html.push('</div>')
    return html.join('');
  };

}
