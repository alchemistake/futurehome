from datetime import datetime

from django.db.models import Count, F
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt

from admin_panel_api.twitter_interface import TwitterInterface
from .models import Tweet
from .serializers import TweetInteractionSerializer


class TweetAPIView(APIView):
    def get(self, request):
        return Response({'tweets': Tweet.objects.values()})


class FetchAPIView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.tweet_collector = TwitterInterface.get_instance()

    def get(self, request):
        tweets = self.tweet_collector.get_tweets()

        if type(tweets) is not list:
            return Response(str(tweets["message"]), status=tweets["status_code"])

        # Tweet.objects.all().delete()

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
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.tweet_collector = TwitterInterface.get_instance()

    @csrf_exempt
    def post(self, request):
        serializer = TweetInteractionSerializer(data=request.data)

        if serializer.is_valid():
            error = self.tweet_collector.retweet(request.data['id'])
            if error:
                return Response(str(error["message"]), status=error["status_code"])
            else:
                return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FavoriteAPIView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.tweet_collector = TwitterInterface.get_instance()

    @csrf_exempt
    def post(self, request):
        serializer = TweetInteractionSerializer(data=request.data)

        if serializer.is_valid():
            error = self.tweet_collector.favorite(request.data['id'])
            if error:
                return Response(str(error["message"]), status=error["status_code"])
            else:
                return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
