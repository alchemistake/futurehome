import {Tweet} from "./tweet";

export interface DashboardData {
  languages: { lang: string, 'lang__count': number }[];
  locations: { place: string, 'place__count': number }[];
  mostPopularTweets: Tweet[];
}
