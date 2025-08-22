export namespace Model {
  export class Category {
    public Text: string
    public Questions: Question[]
  }

  export class Question {
    public Text: string
    public Answers: Answer[]
  }

  export class Answer {
    public Text: string
    public IsCorrect: boolean
  }
}
