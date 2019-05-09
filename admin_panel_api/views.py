from datetime import datetime

from django.db.models import Count, F
from rest_framework import status
from rest_framework.authentication import BasicAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_panel_api.auth import CsrfExemptSessionAuthentication
from futurehome_twitter_crawler.collector import TweetCollector
from .models import Tweet
from .serializers import TweetInteractionSerializer


class TweetAPIView(APIView):
    def get(self, request):
        return Response({'tweets': Tweet.objects.values()})


class FetchAPIView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.tweet_collector = TweetCollector.get_instance()

    def get(self, request):
        try:
            tweets = self.tweet_collector.get_tweets()
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            for tweet in tweets:
                row = Tweet(id=tweet['id_str'],
                            text=tweet['text'],
                            lang=tweet['lang'],
                            retweet_count=tweet['retweet_count'],
                            favorite_count=tweet['favorite_count'],
                            created_at=datetime.strptime(tweet['created_at'], '%a %b %d %H:%M:%S +0000 %Y'),
                            place=getattr(tweet['place'], 'country', None),
                            user=tweet['user']['screen_name'])
                row.save()

            return Response({'tweets': Tweet.objects.values()})


class DashboardAPIView(APIView):
    def get(self, request):
        locations = Tweet.objects.values('place').order_by().annotate(Count('place'))
        languages = Tweet.objects.values('lang').order_by().annotate(Count('lang'))
        most_popular_tweets = Tweet.objects.values().annotate(
            popularity=F('retweet_count') + F('favorite_count')).order_by('popularity')[:6]

        return Response(
            {'locations': locations, 'languages': languages, 'mostPopularTweets': most_popular_tweets})


class RetweetAPIView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.tweet_collector = TweetCollector.get_instance()

    def post(self, request):
        serializer = TweetInteractionSerializer(data=request.data)

        if serializer.is_valid():
            try:
                self.tweet_collector.retweet(request.data['id'])
            except Exception as e:
                return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FavoriteAPIView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.tweet_collector = TweetCollector.get_instance()

    def post(self, request):
        serializer = TweetInteractionSerializer(data=request.data)

        if serializer.is_valid():
            try:
                self.tweet_collector.favorite(request.data['id'])
            except Exception as e:
                return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
