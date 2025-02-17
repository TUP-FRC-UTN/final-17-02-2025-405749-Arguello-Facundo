import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { ScoreService } from '../services/score.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  word: string = '';
  category: string = '';
  displayedWord: string[] = [];
  guessedLetters: string[] = [];
  correctLetters: string[] = [];
  incorrectLetters: string[] = [];
  remainingAttempts: number = 6;
  gameStatus: 'playing' | 'won' | 'lost' = 'playing';
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(
    private gameService: GameService,
    private scoreService: ScoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.startNewGame();
  }

  startNewGame(): void {
    this.gameService.getRandomWord().subscribe(({ word, category }) => {
      this.word = word.toUpperCase();
      this.category = category;
      this.displayedWord = Array(this.word.length).fill('_');
      this.guessedLetters = [];
      this.correctLetters = [];
      this.incorrectLetters = [];
      this.remainingAttempts = 6;
      this.gameStatus = 'playing';
    });
  }

  guessLetter(letter: string): void {
    if (this.gameStatus !== 'playing') return;

    this.guessedLetters.push(letter);

    if (this.word.includes(letter)) {
      this.correctLetters.push(letter);
      for (let i = 0; i < this.word.length; i++) {
        if (this.word[i] === letter) {
          this.displayedWord[i] = letter;
        }
      }
      if (!this.displayedWord.includes('_')) {
        this.gameStatus = 'won';
        this.saveScore();
      }
    } else {
      this.incorrectLetters.push(letter);
      this.remainingAttempts--;
      if (this.remainingAttempts === 0) {
        this.gameStatus = 'lost';
        this.displayedWord = this.word.split(''); 
        this.saveScore();
      }
    }
  }

  saveScore(): void {
    const username = localStorage.getItem('username') || 'Unknown';
    const score = {
      playerName: username,
      word: this.word,
      attemptsLeft: this.remainingAttempts,
      score: this.calculateScore(),
      date: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      idGame: this.generateGameId(),
      id: this.generateId()
    };

    this.scoreService.saveScore(score).subscribe(
      () => {
        console.log('Score saved successfully');
      },
      (error) => {
        console.error('Error saving score:', error);
      }
    );
  }

  calculateScore(): number {
    return this.remainingAttempts * 10; 
  }

  generateGameId(): string {
    return 'G' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}