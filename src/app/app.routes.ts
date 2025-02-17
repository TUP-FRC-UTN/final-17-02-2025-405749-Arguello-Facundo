import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
    { path: 'game', loadComponent: () => import('./game/game.component').then(m => m.GameComponent) },
    { path: 'scores', loadComponent: () => import('./scores/scores.component').then(m => m.ScoresComponent) }
];