export interface Person {
  id: string,
  email: string,
  phone_number: string,
  first_name: string,
  last_name: string,
  street: string,
  house_number: string,
  responsibilities: string,
  education_occupation: string,
  hobbies: string,
  fav_color: string,
  fav_activity: string,
  fav_song: string,
  fav_camp: string,
  fav_music_genre: string,
  fav_film_book: string,
  prev_groups: string,
  years_active: number,
  birth_date: string,
  last_updated?: string,
  city: string,
  postal_code: string,
}

export interface GroupMembers {
  [key: string]: Person[]
}