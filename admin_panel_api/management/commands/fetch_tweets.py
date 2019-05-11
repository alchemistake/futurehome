from django.core.management.base import BaseCommand
from admin_panel_api.models import Tweet
from admin_panel_api.twitter_interface import TwitterInterface
from datetime import datetime


class Command(BaseCommand):
    help = 'Fetch tweets from Twitter API related to Futurehome AS'

    def handle(self, *args, **options):
        tweets = TwitterInterface().get_tweets()
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
