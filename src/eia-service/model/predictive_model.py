
#!/usr/bin/env python3.7  
# -*- coding: utf-8 -*- 
#----------------------------------------------------------------------------
# Created By  : name_of_the_creator Hugo Andres Dorado   
# Created Date: 17/02/2022
# version ='1.0'

import pandas as pd
import numpy as np
import random as rd
import sklearn
from sklearn.ensemble import RandomForestRegressor
from sklearn import preprocessing
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import make_column_selector
from sklearn.compose import ColumnTransformer
import matplotlib.pyplot as plt
from joblib import dump, load
import csv

# Read dataset

dataset = pd.read_csv("datasetcordoba.csv",index_col=0)

del dataset["year_sems"]

dataset.columns

X = dataset.copy()

del X["Yield"]

Y = dataset["Yield"]


# Pipe Line

ct = ColumnTransformer([
       ('scale', MinMaxScaler(),
       make_column_selector(dtype_include=np.number))
       ],remainder = OneHotEncoder(drop='if_binary'), verbose_feature_names_out=False)

new_x = ct.fit_transform(X)

X_minmax = pd.DataFrame(new_x,columns=ct.get_feature_names_out())

# 
# x_df.to_csv("datos_tranformados.csv")

# ct.transform(X) == new_x


# RandomForest model

rf = RandomForestRegressor(n_estimators=1000).fit(X_minmax,Y)

rf.predict(X_minmax)

# Persistence model

dump(ct, 'pipe_line.joblib')

dump(rf, 'rf_cordoba.joblib') 


f = open("nomr_datasetet.csv","w")

# Storage csv normal

X_minmax.to_csv("X_minmax.csv")

# Test with models

X_minmax.loc[6:7]

