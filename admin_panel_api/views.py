from datetime import datetime

from django.db.models import Count, F
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import TweetInteractionSerializer
from .collector import TweetCollector
from .models import Tweet, User


class TweetAPIView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.tweet_collector = TweetCollector.get_instance()

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
                        place=getattr(tweet['place'], 'country', None),
                        user=user)
            row.save()

        return Response({'tweets': tweets})


class DashboardAPIView(APIView):
    def get(self, request):
        locations = Tweet.objects.values('place').order_by().annotate(Count('place'))
        languages = Tweet.objects.values('lang').order_by().annotate(Count('lang'))
        most_popular_tweets = Tweet.objects.values().annotate(
            popularity=F('retweet_count') + F('favorite_count')).order_by('popularity')[:5]

        return Response(
            {'locations': locations, 'languages': languages, 'mostPopularTweets': most_popular_tweets})


class RetweetAPIView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.tweet_collector = TweetCollector.get_instance()

    def post(self, request):
        serializer = TweetInteractionSerializer(data=request.data)

        if serializer.is_valid():
            self.tweet_collector.retweet(request.data['id'])
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FavoriteAPIView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.tweet_collector = TweetCollector.get_instance()

    def post(self, request):
        print(request)
        serializer = TweetInteractionSerializer(data=request.data)

        if serializer.is_valid():
            self.tweet_collector.favorite(request.data['id'])
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
