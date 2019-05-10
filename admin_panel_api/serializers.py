from rest_framework import serializers


class TweetInteractionSerializer(serializers.Serializer):
    id = serializers.CharField()
