// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-30
// Shared types used across API routes and components

export interface LeaderboardEntry {
  rank: number;
  nickname: string;
  totalEarned: number;
  offersCompleted: number;
}
