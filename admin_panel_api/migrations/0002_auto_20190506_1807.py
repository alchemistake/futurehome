# Generated by Django 2.2.1 on 2019-05-06 18:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('admin_panel_api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tweet',
            name='lang',
        ),
        migrations.RemoveField(
            model_name='tweet',
            name='user',
        ),
    ]
