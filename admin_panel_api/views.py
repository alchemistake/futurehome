from datetime import datetime

from rest_framework.response import Response
from rest_framework.views import APIView

from .collector import TweetCollector
from .models import Tweet, User


class TweetAPIView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.tweet_collector = TweetCollector()

    def get(self, request):
        tweets = self.tweet_collector.get_tweets()

        for tweet in tweets:
            user = User(id=tweet['user']['id_str'],
                        screen_name=tweet['user']['screen_name'],
                        name=tweet['user']['name'],
                        url=tweet['user']['url'])
            user.save()

            row = Tweet(id=tweet['id_str'],
                        text=tweet['text'],
                        lang=tweet['lang'],
                        favorited=tweet['favorited'],
                        retweeted=tweet['retweeted'],
                        retweet_count=tweet['retweet_count'],
                        favorite_count=tweet['favorite_count'],
                        created_at=datetime.strptime(tweet['created_at'], '%a %b %d %H:%M:%S +0000 %Y'),
                        user=user)
            row.save()

        return Response({'tweets': tweets})
