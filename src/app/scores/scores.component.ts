import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Score {
  playerName: string;
  word: string;
  attemptsLeft: number;
  score: number;
  date: string;
  idGame: string;
}

@Component({
  selector: 'app-scores',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent implements OnInit {
  scores: Score[] = [];
  isAdmin: boolean = false;
  username: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.isAdmin = localStorage.getItem('role') === 'admin';
    this.loadScores();
  }

  loadScores(): void {
    this.http.get<Score[]>('https://671fe287e7a5792f052fdf93.mockapi.io/scores')
      .pipe(
        map(scores => {
          if (!this.isAdmin) {
            return scores.filter(score => score.playerName === this.username);
          }
          return scores;
        })
      )
      .subscribe(scores => {
        this.scores = scores.sort((a, b) => b.score - a.score);
      });
  }
}