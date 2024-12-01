export class UpdatePersonDto {
  name?: string;
  attendance_count?: number;
  meeting_ids?: number[];
  game_history?: { result: string }[];
  address?: string;
}
