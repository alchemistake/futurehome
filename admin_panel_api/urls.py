from django.urls import path

from .views import TweetAPIView

urlpatterns = [
    path('tweet/', TweetAPIView.as_view())
]
