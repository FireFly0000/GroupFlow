# Generated by Django 4.1.6 on 2023-03-10 05:05

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0006_task_due_date_alter_task_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='due_date',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]
