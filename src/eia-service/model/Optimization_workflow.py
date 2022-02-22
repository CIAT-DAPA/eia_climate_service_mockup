
from msilib import sequence
import pandas as pd
import numpy as np
import random as rd
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
import re
from Optimization_funs import *

# Read dataset

dataset = pd.read_csv("datasetcordoba.csv",index_col=0)

del dataset["year_sems"]

dataset.columns

X = dataset.copy()

del X["Yield"]

Y = dataset["Yield"]

# Extract ranges

clasVars = pd.read_csv("header_dataset.csv")

# Subset of variables

managment_vars = clasVars[clasVars.Type=="M"]["Variable"].reset_index()["Variable"]
scales_managment_vars = clasVars[clasVars.Type=="M"]["Scale"].reset_index()["Scale"]

other_variables = clasVars[clasVars.Type!="M" ]
other_variables = other_variables[other_variables.Type != "O"]["Variable"].reset_index()["Variable"]
other_variables


# Split dataset

mat_M = dataset[managment_vars]
mat_O = dataset[other_variables]

# Validation

ds_ranges = AllRangGen(mat_M,scales_managment_vars,managment_vars)

# Generate random vector

# NumbPobIni = 20

# namesds = np.delete(namesds,35)

# RandPop = RandomPopIni(20,namesds,ds_ranges,scales)

# Persistence

ct = load('pipe_line.joblib')

rf = load('rf_cordoba.joblib') 

## Transfor

# transfor = ct.transform(RandPop)

# transfor_pred = pd.DataFrame(transfor,columns=ct.get_feature_names_out())

#rf.predict(transfor_pred)

## Improvise function

# def improviseFun(hm,hmcr,bestHarmony,par,ranges,scales):



# 2. Pegar los datos partidos, para mas adelante utilizarlos

# mat = pd.concat([mat_O,mat_M],axis=1)

# 3. Realizar predicción


# 4. Crear la función de improvisación


#def improviseFun():



# 5. Desarrollar el proceso de optimizacion

gen = dataset.iloc[[0]]


# Out of funtion


def bestGlobHS(fv,hms,hmcr,par,maxNumInp,fitnessfun,namesds,fixedVars,model_train,ranges,scales,transf_fun):

     hm = RandomPopIni(hms,namesds,ds_ranges,scales)
     fullMat = pd.concat([fv,hm],axis=1)

     popfv = fv.append([fv]*(hms-1),ignore_index=True)

     hm["Performance"] = fitnessfun(model=rf,inputs=hm,fixedValues=popfv,transf_fun=ct)

     hm = hm.sort_values(by = "Performance")

     worsthm = hm.iloc[[0]]
     besthm  = hm.iloc[[hms-1]]

     best_sol = hm["Performance"]

     for j in range(hms,maxNumInp):
          newHM = ImproviseFun(hm,hmcr,besthm,par,ranges,scales)
       
          newHM["Performance"] = fitnessfun(model_train,newHM,fv,transf_fun)

          print(j,newHM["Performance"].iloc[0] ,"-",worsthm["Performance"].iloc[0])

          if newHM["Performance"].iloc[0] > worsthm["Performance"].iloc[0]:               
               hm = hm.append(newHM)
            
               hm = hm.sort_values(by = "Performance")

               hm = hm.iloc[[*range(1,(hms+1))]]

               besthm = hm.iloc[[hms-1]]
               worsthm = hm.iloc[[0]]
     
          print(besthm["Performance"])

          best_sol[j] = besthm["Performance"].iloc[0]

     return [best_sol,besthm]
     

hms = 5
hmcr = 0.85
par = 0.3
maxNumInp = 100
fitnessfun = fitnessfun
namesds = managment_vars
fixedVars = other_variables
model_train = rf
ranges = ds_ranges
scales = scales_managment_vars
transf_fun=ct
fv = gen[fixedVars]


bestGlobHS(fv=gen[fixedVars],hms=5,hmcr=0.85,par=0.3,maxNumInp=100,fitnessfun=fitnessfun,
namesds=managment_vars,fixedVars=other_variables,model_train=rf,ranges=ds_ranges,scales=scales_managment_vars,
transf_fun=ct)



# def GHS_MM(hms,hmcr,par,maxNumInp,fixedVars,fitnessfun,model_train,ranges,scales):


 
# hm = hm
# hmcr = hmcr
# bestHarmony = besthm
# par = 0.3
# ranges = ds_ranges
# scales = scales_managment_vars


# ImproviseFun(hm,hmcr,besthm,par,ranges,scales)