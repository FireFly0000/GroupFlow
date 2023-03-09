# todo_app/tests.py
from django.test import TestCase
from .models import Group, Users, GroupMember, Todo
from .serializers import UserSerializer, GroupMemberSerializer, GroupSerializer, TodoSerializer


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
