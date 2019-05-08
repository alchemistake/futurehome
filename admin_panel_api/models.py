from django.db import models


class User(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    screen_name = models.CharField(max_length=64)
    name = models.CharField(max_length=128)
    url = models.URLField(null=True, blank=True)

    def __str__(self):
        return '{} @{}'.format(self.name, self.screen_name)


class Tweet(models.Model):
    id = models.CharField(max_length=140, primary_key=True)
    text = models.CharField(max_length=255)
    lang = models.CharField(max_length=5, default='')
    favorited = models.BooleanField(default=False)
    retweeted = models.BooleanField(default=False)
    retweet_count = models.IntegerField(default=0)
    favorite_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(null=True)
    place = models.CharField(max_length=255, null=True)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.text
