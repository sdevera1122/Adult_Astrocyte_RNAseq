from django.db import models

class RefGenemm9(models.Model):
    chrom = models.CharField(max_length=50)
    start = models.IntegerField()
    stop = models.IntegerField()
    name = models.CharField(max_length=255)
    class Meta:
		db_table = u'refGene'