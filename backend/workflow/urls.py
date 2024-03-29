from django.urls import path, include
from . import views

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'tasks', views.TaskView, 'task')
router.register(r'users', views.UserView, 'user')
router.register(r'groups', views.GroupView, 'group')
router.register(r'group_member', views.GroupMemberView, 'group_member')

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('test/', views.testEndPoint, name='test'),
    path('userID/', views.getUserId, name='userID'),
    path('username/', views.getUserName, name='username'),
    path('', views.getRoutes),
    path('', include(router.urls))
]