from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Todo, GroupMember, Group, Users


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):  # noqa
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        # ...
        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'password2', 'email')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'name', 'email')


class GroupMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = GroupMember
        fields = ('id', 'user')


class GroupSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ('id', 'name', 'members')

    def get_members(self, obj):
        members = GroupMember.objects.filter(group=obj)
        return GroupMemberSerializer(members, many=True).data


class TodoSerializer(serializers.ModelSerializer):
    group = GroupSerializer()

    class Meta:
        model = Todo
        fields = ('id', 'group', 'title', 'description', 'due_date', 'completed')
