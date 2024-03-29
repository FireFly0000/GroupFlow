from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import viewsets
from .serializers import TaskSerializer, MyTokenObtainPairSerializer, RegisterSerializer, GroupSerializer, GroupMemberSerializer
from .models import Task, Group, GroupMember
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status

# Create your views here.

class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

class GroupView(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    queryset = Group.objects.all()

class GroupMemberView(viewsets.ModelViewSet):
    serializer_class = GroupMemberSerializer
    queryset = GroupMember.objects.all()

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class UserView(viewsets.ModelViewSet):
    serializer_class = RegisterSerializer
    queryset = User.objects.all()



@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/',
    ]
    return Response(routes)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = request.POST.get('text')
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserId(request):
    if request.method == 'GET':
        data = request.user.id
        return Response({'response': data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserName(request):
    if request.method == 'GET':
        data = f'{request.user}'
        return Response({'response': data}, status=status.HTTP_200_OK)
