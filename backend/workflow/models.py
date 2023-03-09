from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Group(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    owner = models.ForeignKey(User, null=True, on_delete=models.CASCADE)

    def _str_(self):
        return self.name

class Todo(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    group = models.ForeignKey(Group, null=True, on_delete=models.CASCADE)

    def _str_(self):
        return self.title   