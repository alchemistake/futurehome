from django.db import models
from rest_framework import serializers


class TweetInteractionRequest(models.Model):
    id = serializers.CharField()


class TweetInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TweetInteractionRequest
        fields = '__all__'
