from django.db import models


class Tweet(models.Model):
    id = models.CharField(max_length=140, primary_key=True)
    text = models.CharField(max_length=255)
    lang = models.CharField(max_length=5, default='')
    retweet_count = models.IntegerField(default=0)
    favorite_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(null=True)
    place = models.CharField(max_length=255, null=True)
    user = models.CharField(max_length=255, default='')

    def __str__(self):
        return '@{}: {}'.format(self.user, self.text)
