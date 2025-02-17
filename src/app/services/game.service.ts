import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface WordResponse {
  id: string;
  word: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'https://671fe287e7a5792f052fdf93.mockapi.io/words';

  constructor(private http: HttpClient) {}

  getRandomWord(): Observable<{ word: string, category: string }> {
    return this.http.get<WordResponse[]>(this.apiUrl).pipe(
      map(words => {
        const randomIndex = Math.floor(Math.random() * words.length);
        const selectedWord = words[randomIndex];
        return { word: selectedWord.word, category: selectedWord.category };
      }),
      catchError(() => {
        return of({ word: 'DEFAULT', category: 'General' });
      })
    );
  }
}