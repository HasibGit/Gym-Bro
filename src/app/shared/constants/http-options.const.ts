import { HttpHeaders } from '@angular/common/http';

export const HTTP_COMMON_HEADER = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': 'd9dc78d5b7msha471073adc858d5p10e8b6jsn7222865100de',
    'X-RapidAPI-Host': 'exerciseapi3.p.rapidapi.com',
  }),
  withCredentials: true,
};
