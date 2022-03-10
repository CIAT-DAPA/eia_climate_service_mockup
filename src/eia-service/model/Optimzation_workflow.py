#!/usr/bin/env python
# coding: utf-8

# In[1]:


#!/usr/bin/env python3.7  
# -*- coding: utf-8 -*- 
#----------------------------------------------------------------------------
# Created By  : name_of_the_creator Hugo Andres Dorado   
# Created Date: 17/02/2022
# version ='1.0'

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
from model.Optimization_funs import *


# In[2]:
class Model:

    def run_model(self, crop_id):


        # Read dataset

        dataset = pd.read_csv(".//data//Cordoba-id-recover.csv",index_col=0)
        #print(dataset)

        del dataset["year_sems"]

        #dataset.columns

        X = dataset.copy()

        del X["Yield"]

        Y = dataset["Yield"]


        # In[4]:


        # Extract ranges

        clasVars = pd.read_csv(".//data//header_dataset.csv")


        # In[5]:


        # Subset of variables
        #print(clasVars)
        managment_vars = clasVars[clasVars.Type=="M"]["Variable"].reset_index()["Variable"]
        scales_managment_vars = clasVars[clasVars.Type=="M"]["Scale"].reset_index()["Scale"]

        other_variables = clasVars[clasVars.Type!="M" ]
        other_variables = other_variables[other_variables.Type != "O"]["Variable"].reset_index()["Variable"]


        # In[6]:


        # Split dataset

        mat_M = dataset[managment_vars]
        mat_O = dataset[other_variables]


        # In[8]:


        # Validation

        ds_ranges = AllRangGen(mat_M,scales_managment_vars,managment_vars)


        # In[9]:


        # Persistence

        ct = load('.//data//pipe_line.joblib')

        rf = load('.//data//rf_cordoba.joblib') 


        # In[10]:


        crop_id = crop_id
        row_by_id = dataset.iloc[:, 0] = crop_id
        #df_male = df.loc[is_male]
        gen = dataset.loc[[row_by_id]]

        #gen


        # In[11]:


        solution = bestGlobHS(fv=gen[other_variables],hms=5,hmcr=0.85,par=0.3,maxNumInp=100,fitnessfun=fitnessfun,
        namesds=managment_vars,fixedVars=other_variables,model_train=rf,ranges=ds_ranges,scales=scales_managment_vars,
        transf_fun=ct)

        sol_gen = solution[1]
        sol_gen.index = gen.index
        
        actual = gen.drop(columns=['DR_Avg_VEG', 'Efective_Depth', 'Field_Drainage', 'Former_Crop', 
        'Organic_Matter_Content', 'P_10_Freq_MAT', 'P_10_Freq_VEG', 'P_Accu_CF', 'RH_Avg_CF', 
        'RH_Avg_MAT', 'Runoff', 'SR_Accu_CF', 'SR_Accu_MAT', 'SR_Accu_VEG', 'Soil_Structure',
        'Soil_Texture', 'TA_Avg_CF', 'TA_Avg_VEG', 'TM_Avg_VEG', 'pH'])
        
        return {"actual": actual.to_dict('records'), "optimo":sol_gen.to_dict('records')}
        #pd.set_option('display.max_columns', None)


        # In[12]:

        #print(type(solution))
        #print(solution[1])


        # In[13]:


        #print(solution[2])


    # %%
