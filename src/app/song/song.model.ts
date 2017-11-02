export class SongItem {
  title: string;
  subtitle: string;
  apiName: string;
  text: string;


  constructor(title: string, subtitle: string, apiName: string, text: string) {
    this.title = title;
    this.subtitle = subtitle;
    this.apiName = apiName;
    this.text = text;
  }
}
