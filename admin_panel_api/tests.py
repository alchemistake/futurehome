from unittest.mock import patch

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from twython import TwythonError

from admin_panel_api.twitter_interface import TwitterInterface
from admin_panel_api.models import Tweet


class ModelTests(TestCase):
    def test_str(self):
        test_tweet = Tweet(id='1234', text='Some text...', user='begozcan')
        self.assertEqual(str(test_tweet), '@begozcan: Some text...')


class ViewTests(TestCase):
    mock_get_tweets_response = [
        {'id_str': '2', 'text': 'New tweet!', 'lang': 'en', 'retweet_count': 0, 'favorite_count': 0,
         'created_at': 'Wed Aug 27 13:08:45 +0000 2008', 'place': {'country': 'Turkey'},
         'user': {'screen_name': 'begozcan'}}]

    def setUp(self):
        self.client = APIClient()
        Tweet.objects.create(id='1', text='Tweet 1', user='begozcan', lang='en', place='Norway', retweet_count=1,
                             favorite_count=1)

    def test_tweets(self):
        response = self.client.get('/api/tweets/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(str(response.data), str({'tweets': Tweet.objects.values()}))

    @patch('admin_panel_api.twitter_interface.TwitterInterface.get_tweets', return_value=mock_get_tweets_response)
    def test_fetch_success(self, mock_get_tweets):
        response = self.client.get('/api/fetch/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Should have deleted the tweet with id 1 and saved tweet with 2 instead
        self.assertEqual(response.data['tweets'][0]['id'], '2')
        self.assertEqual(Tweet.objects.values()[0]['id'], '2')

    @patch('admin_panel_api.twitter_interface.TwitterInterface.get_tweets',
           return_value={"status_code": 500, "message": "Internal Server Error"})
    def test_fetch_error(self, mock_get_tweets):
        response = self.client.get('/api/fetch/')
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Tweet.objects.values()[0]['id'], '1')  # Database should be unchanged

    def test_dashboard(self):
        response = self.client.get('/api/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data['locations'][0]['place'], 'Norway')
        self.assertEqual(response.data['locations'][0]['place__count'], 1)
        self.assertEqual(response.data['languages'][0]['lang'], 'en')
        self.assertEqual(response.data['languages'][0]['lang__count'], 1)
        self.assertEqual(response.data['mostPopularTweets'][0]['popularity'], 2)
        self.assertEqual(response.data['mostPopularTweets'][0]['id'], '1')

    @patch('admin_panel_api.twitter_interface.TwitterInterface.retweet', return_value={})
    def test_retweet_correct_request(self, mock_retweet):
        response = self.client.post('/api/retweet/', {'id': '1'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('admin_panel_api.twitter_interface.TwitterInterface.retweet', return_value={})
    def test_retweet_incorrect_request(self, mock_retweet):
        response = self.client.post('/api/retweet/', {'idx': '1'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('admin_panel_api.twitter_interface.TwitterInterface.retweet',
           return_value={"status_code": 500, "message": "Internal Server Error"})
    def test_retweet_twython_error(self, mock_retweet):
        response = self.client.post('/api/retweet/', {'id': '1'})
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

    @patch('admin_panel_api.twitter_interface.TwitterInterface.favorite', return_value={})
    def test_favorite_correct_request(self, mock_favorite):
        response = self.client.post('/api/favorite/', {'id': '1'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('admin_panel_api.twitter_interface.TwitterInterface.favorite', return_value={})
    def test_favorite_incorrect_request(self, mock_favorite):
        response = self.client.post('/api/favorite/', {'idx': '1'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('admin_panel_api.twitter_interface.TwitterInterface.favorite',
           return_value={"status_code": 500, "message": "Internal Server Error"})
    def test_favorite_twython_error(self, mock_favorite):
        response = self.client.post('/api/favorite/', {'id': '1'})
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)


class TwitterInterfaceTests(TestCase):
    @patch('admin_panel_api.twitter_interface.Twython', return_value={})
    def test_singleton(self, mock_twython_init):
        instance1 = TwitterInterface.get_instance()
        instance2 = TwitterInterface.get_instance()
        self.assertIsNotNone(instance1)
        self.assertEqual(instance1, instance2)  # Singleton

    def test_get_tweets_success(self):
        with patch('admin_panel_api.twitter_interface.Twython.search') as mock_search:
            test_result = {'statuses': []}
            mock_search.return_value = test_result

            tweets = TwitterInterface.get_instance().get_tweets()
            self.assertEqual(tweets, test_result['statuses'])

    @patch('admin_panel_api.twitter_interface.Twython.search', side_effect=TwythonError('Some error'))
    def test_get_tweets_error(self, mock_search):
        try:
            TwitterInterface.get_instance().get_tweets()
        except Exception as e:
            self.assertIsNotNone(e)

    @patch('admin_panel_api.twitter_interface.Twython.retweet', return_value=True)
    def test_retweet_success(self, mock_retweet):
        TwitterInterface.get_instance().retweet('1234')
        self.assertEqual(mock_retweet.call_count, 1)

    @patch('admin_panel_api.twitter_interface.Twython.retweet', side_effect=TwythonError('Some error'))
    def test_retweet_error(self, mock_retweet):
        try:
            TwitterInterface.get_instance().retweet('1234')
        except Exception as e:
            self.assertIsNotNone(e)

    @patch('admin_panel_api.twitter_interface.Twython.create_favorite', return_value=True)
    def test_favorite_success(self, mock_favorite):
        TwitterInterface.get_instance().favorite('1234')
        self.assertEqual(mock_favorite.call_count, 1)

    @patch('admin_panel_api.twitter_interface.Twython.create_favorite', side_effect=TwythonError('Some error'))
    def test_favorite_error(self, mock_favorite):
        try:
            TwitterInterface.get_instance().favorite('1234')
        except Exception as e:
            self.assertIsNotNone(e)
