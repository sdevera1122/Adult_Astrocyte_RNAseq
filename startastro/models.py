from __future__ import unicode_literals

from django.db import models

# Create your models here.
class justgenes(models.Model):
	genename = models.CharField(max_length=255)
	class Meta:
		db_table = 'justgenes'

class cortex(models.Model):
    id = models.AutoField(primary_key=True)
    genename = models.CharField(max_length=255)
    ip_avg = models.CharField(max_length=255)
    ip_sem = models.CharField(max_length=255)
    input_avg = models.CharField(max_length=255)
    input_sem = models.CharField(max_length=255)
    class Meta:
		  db_table = 'cortex'

class striatum_hippocampus(models.Model):
	id = models.AutoField(primary_key=True)
	genename = models.CharField(max_length=255)
	str_ip_avg = models.CharField(max_length=255)
	str_ip_sem = models.CharField(max_length=255)
	str_input_avg = models.CharField(max_length=255)
	str_input_sem = models.CharField(max_length=255)
	hip_ip_avg = models.CharField(max_length=255)
	hip_ip_sem = models.CharField(max_length=255)
	hip_input_avg = models.CharField(max_length=255)
	hip_input_sem = models.CharField(max_length=255)
	ratio_strip_hipip_de = models.CharField(max_length=255)
	class Meta:
		db_table = 'striatum_hippocampus'

class protein_list(models.Model):
    id = models.AutoField(primary_key=True)
    protein_accession = models.CharField(max_length=255)
    genename = models.CharField(max_length=255)
    proteinname = models.CharField(max_length=255)
    average_ratio_str_hip = models.CharField(max_length=255)
    class Meta:
        db_table = 'protein_list'

class adultastro_logtable(models.Model):
	id = models.AutoField(primary_key=True)
	genelist = models.TextField()
	date_added = models.DateField()
	class Meta:
		db_table = 'adultastro_logtable'

  