__author__ = "Rob Knight, Gavin Huttley, and Peter Maxwell"
__copyright__ = "Copyright 2007, The Cogent Project"
__credits__ = ["Rob Knight", "Peter Maxwell", "Gavin Huttley",
                    "Matthew Wakefield"]
__license__ = "GPL"
__version__ = "1.0.1"
__maintainer__ = "Rob Knight"
__email__ = "rob@spot.colorado.edu"
__status__ = "Production"

import pandas as pd
import numpy as np
import sklearn
from sklearn.ensemble import RandomForestRegressor
from sklearn import preprocessing
from sklearn.preprocessing import OneHotEncoder
import matplotlib.pyplot as plt
from joblib import dump, load
import csv
import re
import random as random
from random import sample
import random as rd



# Extract ranges

# Human sort

def atoi(text):
    return int(text) if text.isdigit() else text

def natural_keys(text):
    '''
    alist.sort(key=natural_keys) sorts in human order
    http://nedbatchelder.com/blog/200712/human_sorting.html
    (See Toothy's implementation in the comments)
    '''
    return [ atoi(c) for c in re.split(r'(\d+)', text) ]


def extrac_ranges(var,val):
       if val == "Continuous" or val == "Discrete":
              max = var.apply(np.max)[0]
              min = var.apply(np.min)[0]
              ranges = [max,min]
       elif bool(re.search("Cat",val)):
              ranges = list(np.unique(var))
              ranges.sort(key=natural_keys)
              #print(ranges)
       else:
              print("Error, unrecognized category")

       return(ranges)

# clasVars = pd.read_csv("header_norm_espf.csv",index_col=0)

# clasVars.shape[2] == dataset.shape[1]

# clasVars = pd.read_csv("header_norm_espf.csv")

# Validation

def valDatasets(ds,reference):
    if ds.shape[1] == reference.shape[0]:
        if sum(reference["Variable"] == ds.columns) == ds.shape[1]:
            message = "All values match"
        else:
            message ="Datasets and variables have different variables"
    else:
        message = "Datasets and variables have different lengths"
    return message


def AllRangGen(dataset,scales,names):
    allRanges = []
    names = names.reset_index()["Variable"]
    scales = scales.reset_index()["Scale"]
    for i in range(0,dataset.shape[1]):
         variable = dataset.filter([names[i]])
         allRanges.append(extrac_ranges(variable,scales[i]))
         #print(i)
    return allRanges



def RandomIni(rang,scale):
    if scale == "Discrete":
        value = sample(range(round(rang[1]),(round(rang[0])+1)),1)
    elif scale == "Continuous":
        value = np.random.uniform(rang[1],rang[0],(1,))
    elif scale == "Category":
        value = sample(rang,1)
    else:    
        print("Unrecognized scale")
    return value[0]



def RandomIniVec(RangosCompletos, escalasCompletas):
    long_rang = len(RangosCompletos)   
    gen = []
    for i in range(0,long_rang):
        gen.append(RandomIni(RangosCompletos[i], escalasCompletas[i]))
    return gen


def RandomPopIni(NumbPobIni,namesds,ds_ranges,scales):    
    df = pd.DataFrame( columns = namesds)
    for j in range(0,NumbPobIni):
        df.loc[j] = RandomIniVec(ds_ranges, scales)
    return df

def predicModel(model,dataset_transf):
       return model.predict(dataset_transf)[0]

def fitnessfun(model,inputs,fixedValues,transf_fun):
    inputs.reset_index(drop=True, inplace=True)
    fixedValues.reset_index(drop=True, inplace=True)
    mat = pd.concat([inputs,fixedValues],axis=1)
    transfor = transf_fun.transform(mat)
    transfor_pred = pd.DataFrame(transfor,columns=transf_fun.get_feature_names_out())
    return model.predict(transfor_pred)

def ImproviseFun(hm,hmcr,bestHarmony,par,ranges,scales):

    hmss = hm.copy()
    del hmss["Performance"]
    harmony = pd.DataFrame( columns = hmss.columns)
    temp = []
    for i in range(0,hmss.shape[1]):
        if rd.random() < hmcr:
            randRow = hm.iloc[[np.random.choice(range(0,hmss.shape[0]), 1)[0]]]
            xi = randRow[randRow.columns[i]]
            xi = xi.iloc[0]
            if rd.random() < par:
                xi = bestHarmony[bestHarmony.columns[i]]
                xi = xi.iloc[0]
        else:
            xi = RandomIni(ranges[i],scales[i])   
        #print(xi)
        #print(harmony)
        temp.append(xi)
    harmony.loc[0]= temp
    return harmony

def bestGlobHS(fv,hms,hmcr,par,maxNumInp,fitnessfun,namesds,fixedVars,model_train,ranges,scales,transf_fun):

     hm = RandomPopIni(hms,namesds,ranges,scales)
     fullMat = pd.concat([fv,hm],axis=1)

     popfv = fv.append([fv]*(hms-1),ignore_index=True)

     hm["Performance"] = fitnessfun(model=model_train,inputs=hm,fixedValues=popfv,transf_fun=transf_fun)

     hm = hm.sort_values(by = "Performance")

     worsthm = hm.iloc[[0]]
     besthm  = hm.iloc[[hms-1]]

     best_sol = hm["Performance"]

     for j in range(hms,maxNumInp):
          newHM = ImproviseFun(hm,hmcr,besthm,par,ranges,scales)
       
          newHM["Performance"] = fitnessfun(model_train,newHM,fv,transf_fun)

          #print(j,newHM["Performance"].iloc[0] ,"-",worsthm["Performance"].iloc[0])

          if newHM["Performance"].iloc[0] > worsthm["Performance"].iloc[0]:               
               hm = hm.append(newHM)
            
               hm = hm.sort_values(by = "Performance")

               hm = hm.iloc[[*range(1,(hms+1))]]

               besthm = hm.iloc[[hms-1]]
               worsthm = hm.iloc[[0]]
     
          #print(besthm["Performance"])

          best_sol[j] = besthm["Performance"].iloc[0]

     return [best_sol,besthm]

