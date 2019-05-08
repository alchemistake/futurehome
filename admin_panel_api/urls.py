from django.urls import path

from .views import TweetAPIView, DashboardAPIView, RetweetAPIView, FavoriteAPIView

urlpatterns = [
    path('tweet/', TweetAPIView.as_view(), name='tweet'),
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard'),
    path('retweet/', RetweetAPIView.as_view(), name='retweet'),
    path('favorite/', FavoriteAPIView.as_view(), name='favorite')
]
