# Generated by Django 2.2.1 on 2019-05-08 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_panel_api', '0018_tweet_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='tweet',
            name='place',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='text',
            field=models.CharField(max_length=255),
        ),
    ]