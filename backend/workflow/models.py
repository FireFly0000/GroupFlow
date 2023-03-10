from django.db import models
from django.contrib.auth.models import User
import datetime

# Create your models here.

class Group(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    owner = models.ForeignKey(User, null=True, on_delete=models.CASCADE, to_field='username')

    def _str_(self):
        return self.name

class GroupMember(models.Model):
    members = models.ForeignKey(User, null=True, on_delete=models.CASCADE, to_field='username')
    groups = models.ForeignKey(Group, null=True, on_delete=models.CASCADE)

    def _str_(self):
        return self.key    

class Task(models.Model):

    STATUS_DEFAULT = "IN PROGRESS" 
    STATUS_CHOICES =[
        (STATUS_DEFAULT , "I"),
        ("STUCK", "S"),
        ("COMPLETED", "C")
    ]

    title = models.CharField(max_length=120)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DEFAULT )
    due_date = models.DateField(null=False, default=datetime.date.today)
    group = models.ForeignKey(Group, null=True, on_delete=models.CASCADE)

    def _str_(self):
        return self.title   