export default class IdTextPairWithLink {
  id: number;
  text: string;
  link: string;
  
  /**
     * creates a new id text pair
     */
  constructor(id: number, text: string, link: string) {
    this.id = id
    this.text = text
    this.link = link;
  }
}
  