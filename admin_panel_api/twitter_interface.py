from twython import Twython, TwythonError
from twython.endpoints import TWITTER_HTTP_STATUS_CODE

from futurehome_twitter_crawler.helpers import print_error

import os


class TwitterInterface:
    __instance = None

    def __init__(self):
        if TwitterInterface.__instance is not None:
            raise RuntimeError('You can create only one instance of TweetCollector')
        else:
            self.twitter = Twython(os.environ["CONSUMER_KEY"], os.environ["CONSUMER_SECRET"],
                                   os.environ["ACCESS_TOKEN"], os.environ["ACCESS_TOKEN_SECRET"])
            TwitterInterface.__instance = self

    @staticmethod
    def get_instance():
        if TwitterInterface.__instance is None:
            TwitterInterface()
        return TwitterInterface.__instance

    def get_tweets(self):
        try:
            collection = self.twitter.search(q='futurehome')
        except TwythonError as err:
            print_error('Twitter API search failed. {}'.format(err))
            return {"status_code": err.error_code, "message": TWITTER_HTTP_STATUS_CODE[err.error_code]}
        else:
            tweets = collection['statuses']
            return tweets

    def retweet(self, tweet_id):
        try:
            self.twitter.retweet(id=tweet_id)
        except TwythonError as err:
            print_error('Twitter API retweet failed. {}'.format(err))
            return {"status_code": err.error_code, "message": TWITTER_HTTP_STATUS_CODE[err.error_code]}

    def favorite(self, tweet_id):
        try:
            self.twitter.create_favorite(id=tweet_id)
        except TwythonError as err:
            print_error('Twitter API favorite failed. {}'.format(err))
            return {"status_code": err.error_code, "message": TWITTER_HTTP_STATUS_CODE[err.error_code]}
