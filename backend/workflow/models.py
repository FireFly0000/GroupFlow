from django.db import models
import datetime


# Create your models here.

class Group(models.Model):
    name = models.CharField(max_length=255)
    objects = models.Manager()


class Users(models.Model):
    objects = models.Manager()
    name = models.CharField(max_length=255)
    email = models.EmailField()


class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    objects = models.Manager()


class Todo(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    description = models.TextField()
    due_date = models.DateTimeField(auto_now_add=True, null=True)
    completed = models.BooleanField(default=False)
    objects = models.Manager()

    def _str_(self):
        return self.title
