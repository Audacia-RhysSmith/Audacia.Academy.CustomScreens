export default class Module {
  id: number;
  text: string;
  link: string;
  teacher: string;
    
  /**
       * creates a new id text pair
       */
  constructor(id: number, text: string, link: string, teacher: string) {
    this.id = id
    this.text = text
    this.link = link;
    this.teacher = teacher;
  }
}
    