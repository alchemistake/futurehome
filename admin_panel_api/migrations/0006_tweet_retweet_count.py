# Generated by Django 2.2.1 on 2019-05-06 18:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_panel_api', '0005_tweet_retweeted'),
    ]

    operations = [
        migrations.AddField(
            model_name='tweet',
            name='retweet_count',
            field=models.IntegerField(default=0),
        ),
    ]
