import {Tweet} from "./tweet";

export interface Language {
  lang: string
  'lang__count': number;
}

export interface Location {
  place: string;
  'place__count': number;
}

export interface DashboardData {
  languages: Language[];
  locations: Location[];
  mostPopularTweets: Tweet[];
}
