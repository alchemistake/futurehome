# Generated by Django 2.2.1 on 2019-05-06 18:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_panel_api', '0008_tweet_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tweet',
            name='created_at',
            field=models.DateTimeField(default=None),
        ),
    ]
