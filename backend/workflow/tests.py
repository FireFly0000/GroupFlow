# todo_app/tests.py
from django.test import TestCase
from .models import Group, Users, GroupMember, Todo
from .serializers import UserSerializer, GroupMemberSerializer, GroupSerializer, TodoSerializer
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

class ModelTestCase(TestCase):
    def setUp(self):
        user1 = Users.objects.create(name='John', email='john@example.com')
        user2 = Users.objects.create(name='Jane', email='jane@example.com')
        self.group = Group.objects.create(name='Group 1')
        GroupMember.objects.create(group=self.group, user=user1)
        GroupMember.objects.create(group=self.group, user=user2)
        Todo.objects.create(group=self.group, title='Task 1', description='Do something', due_date='2023-03-10')

    def test_group_has_members(self):
        group = Group.objects.get(name='Group 1')
        self.assertEqual(group.members.count(), 2)

    def test_todo_item_belongs_to_group(self):
        todo_item = Todo.objects.get(title='Task 1')
        self.assertEqual(todo_item.group.name, 'Group 1')


class SerializerTestCase(TestCase):
    def setUp(self):
        user1 = Users.objects.create(name='John', email='john@example.com')
        user2 = Users.objects.create(name='Jane', email='jane@example.com')
        group = Group.objects.create(name='Group 1')
        GroupMember.objects.create(group=group, user=user1)
        GroupMember.objects.create(group=group, user=user2)
        Todo.objects.create(group=group, title='Task 1', description='Do something', due_date='2023-03-10')

    def test_user_serializer(self):
        user = Users.objects.get(name='John')
        serializer = UserSerializer(user)
        expected_data = {'id': user.id, 'name': 'John', 'email': 'john@example.com'}
        self.assertEqual(serializer.data, expected_data)

    def test_group_member_serializer(self):
        group_member = GroupMember.objects.first()
        serializer = GroupMemberSerializer(group_member)
        expected_data = {'id': group_member.id,
                         'user': {'id': group_member.user.id, 'name': 'John', 'email': 'john@example.com'}}
        self.assertEqual(serializer.data, expected_data)

    def test_group_serializer(self):
        group = Group.objects.get(name='Group 1')
        serializer = GroupSerializer(group)
        expected_data = {'id': group.id, 'name': 'Group 1',
                         'members': [{'id': 1, 'user': {'id': 1, 'name': 'John', 'email': 'john@example.com'}},
                                     {'id': 2, 'user': {'id': 2, 'name': 'Jane', 'email': 'jane@example.com'}}]}
        self.assertEqual(serializer.data, expected_data)

    '''
    def test_todo_item_serializer(self):
        todo_item = Todo.objects.first()
        serializer = TodoSerializer(todo_item)
        print(serializer.data)
        expected_data = {
            'id': todo_item.id,
            'group': {
                'id': todo_item.group.id, 'name': 'Group 1', 'members': [
                    {
                        'id': 1, 'user': {
                        'id': 1, 'name': 'John', 'email': 'john@example.com'
                    }
                    },
                    {
                        'id': 2, 'user':
                        {
                            'id': 2, 'name': 'Jane', 'email': 'jane@example.com'
                        }
                    }
                ]
            }, 'title': 'Task 1',
            'description': 'Do something', 'due_date': '2023-03-10', 'completed': False
        }
        self.assertEqual(serializer.data, expected_data)
        '''
class TodoViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.valid_token = RefreshToken.for_user(self.user).access_token

    def test_get_todos_list(self):
        response = self.client.get(reverse('todo-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_new_todo(self):
        data = {'title': 'Test Todo', 'description': 'This is a test todo'}
        response = self.client.post(reverse('todo-list'), data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_existing_todo(self):
        todo = Todo.objects.create(title='Test Todo', description='This is a test todo', user=self.user)
        data = {'title': 'Updated Todo', 'description': 'This is an updated test todo'}
        response = self.client.patch(reverse('todo-detail', args=[todo.id]), data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_existing_todo(self):
        todo = Todo.objects.create(title='Test Todo', description='This is a test todo', user=self.user)
        response = self.client.delete(reverse('todo-detail', args=[todo.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class UserViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_superuser(username='admin', password='adminpassword')
        self.client.force_authenticate(user=self.user)
        self.valid_token = RefreshToken.for_user(self.user).access_token

    def test_get_users_list(self):
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_users_list_without_permission(self):
        user2 = User.objects.create_user(username='testuser2', password='testpassword2')
        self.client.force_authenticate(user=user2)
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class AuthenticationTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_register_user(self):
        data = {'username': 'newuser', 'password': 'newpassword'}
        response = self.client.post(reverse('auth_register'), data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_user(self):
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(reverse('token_obtain_pair'), data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_refresh_token(self):
        refresh = RefreshToken.for_user(self.user)
        data = {'refresh': str(refresh)}
        response = self.client.post(reverse('token_refresh'), data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)