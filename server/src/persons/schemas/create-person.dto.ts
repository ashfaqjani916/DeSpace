// create-person.dto.ts
export class CreatePersonDto {
  person_id: number;
  name: string;
  attendance_count?: number;
  meeting_ids: number[];
  game_history: { result: string }[];
  address: string;
}
