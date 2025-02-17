import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Score {
  playerName: string;
  word: string;
  attemptsLeft: number;
  score: number;
  date: string;
  idGame: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiUrl = 'https://671fe287e7a5792f052fdf93.mockapi.io/scores';

  constructor(private http: HttpClient) {}

  saveScore(score: Score): Observable<Score> {
    return this.http.post<Score>(this.apiUrl, score);
  }
}
