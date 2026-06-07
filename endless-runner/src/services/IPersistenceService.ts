export interface IPersistenceService {
  saveHighScore(score: number): void;
  loadHighScore(): number;
}

export class InMemoryPersistenceService implements IPersistenceService {
  private score = 0;
  saveHighScore(score: number): void { this.score = score; }
  loadHighScore(): number { return this.score; }
}
