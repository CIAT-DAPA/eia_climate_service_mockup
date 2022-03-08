from flask import Flask, jsonify, request
from flask_cors import cross_origin, CORS
from numpy import array, double
import pandas as pd
import random

from model.Optimzation_workflow import Model

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
#api = Api(app)

info_farms_for_searching = pd.read_csv('.//data//datos_cordoba_extraccion_2017.csv', 
    dtype={"ID_CULTIVO": int, "NOMBRE_LOTE": str, "ID_FINCA": int, "FINCA": str, "LAT_LOTE": float, "LONG_LOTE":float}, 
    usecols={"ID_CULTIVO", "NOMBRE_LOTE", "FINCA", "LAT_LOTE", "LONG_LOTE"})

yield_and_cuantitative = pd.read_csv('.//data//Cordoba-id-recover.csv', 
    dtype={"Yield": float, "Sowing_Seeds_Number": float, "Seeds_Per_Site": float, "Plant_Density_20_days": float, "Chemical_Treat_Disease": float,
        "Chemical_Treat_Weeds":float, "Chemical_Treat_Pests":float, "Total_N": float, "Total_P": float, "Total_K":float,
        "Number_Chemical_Ferti":float, "pH":float, "Efective_Depth":float, "TM_Avg_VEG":float, "TA_Avg_VEG":float, "DR_Avg_VEG":float,
        "SR_Accu_VEG":float, "P_10_Freq_VEG":float, "TA_Avg_CF":float, "SR_Accu_CF":float, "P_Accu_CF":float, "RH_Avg_CF":float,
        "SR_Accu_MAT":float, "P_10_Freq_MAT":float, "RH_Avg_MAT":float},

    usecols={"Yield", "Sowing_Seeds_Number", "Seeds_Per_Site", "Plant_Density_20_days", "Chemical_Treat_Disease",
        "Chemical_Treat_Weeds", "Chemical_Treat_Pests", "Total_N", "Total_P", "Total_K", "Number_Chemical_Ferti", "pH",
        "Efective_Depth", "TM_Avg_VEG", "TA_Avg_VEG", "DR_Avg_VEG", "SR_Accu_VEG", "P_10_Freq_VEG", "TA_Avg_CF", "SR_Accu_CF",
        "RH_Avg_CF", "SR_Accu_MAT", "P_10_Freq_MAT", "RH_Avg_MAT"})

yield_and_cualitative = pd.read_csv('.//data//Cordoba-id-recover.csv', 
    dtype={"Yield": float, "Sowing_Method": str, "Seeds_Treatment": str, "Cultivar": str, "Former_Crop": str,
        "Field_Drainage":str, "Harvest_Method":str, "Cultivar_Type": str, "Soil_Structure": str, "Runoff":str,
        "Soil_Texture":str, "Organic_Matter_Content":str, "year_sems":str}, 
    usecols={"Yield", "Sowing_Method", "Seeds_Treatment", "Cultivar", "Former_Crop",
        "Field_Drainage", "Harvest_Method", "Cultivar_Type", "Soil_Structure", "Runoff", "Soil_Texture", "Organic_Matter_Content", "year_sems"})

#yield_and_cuantitative = yield_and_cuantitative.dropna()
#yield_and_cualitative = yield_and_cualitative.dropna()


info_farms_for_searching['FINCA'] = info_farms_for_searching['FINCA'].str.upper()
info_farms_for_searching['NOMBRE_LOTE'] = info_farms_for_searching['NOMBRE_LOTE'].str.upper()

def result_data(predictors, lote):
    results = []

    for p in predictors:
        results.append({p['value']: {'current': random.randint(1, 10),
                'optimal': random.randint(1, 10)}})

    return(
        
            {
                'lote': lote,
                'predictors':results,
                'yield': {
                    'current': random.randint(10, 15),
                    'optimal': random.randint(12, 17)
                }
            }
        )

@app.route('/dummy', methods=['GET', 'POST'])
@cross_origin()
def model_process():
    body = request.json
    print(body["lotes"])
    results_by_lotes = {}
    model_script = Model()
    
    #print(model_script.sol_gen.head())
    for r in range(int(len(body["lotes"]))):
        crop_id = body['lotes'][r]['value'][0]
        print("IDs: ", crop_id)
        #print(model_script.sol_gen)
        results_by_lotes[str(crop_id)] = model_script.run_model(crop_id).to_json()

    print(results_by_lotes)
    return jsonify(results_by_lotes)

@app.route('/farm/<name>', methods=['GET'])
@cross_origin()
def search(name):
    search_for=name.upper()
    result = info_farms_for_searching[info_farms_for_searching['FINCA'] == search_for]
    if(result.empty):
        return "No se encontró la finca", 400
    else:
        return result.to_json(orient='records')

@app.route('/cuantitative_data', methods=['GET'])
@cross_origin()
def cuantitative_data():
    return yield_and_cuantitative.to_json(orient='records')

@app.route('/cualitative_data', methods=['GET'])
@cross_origin()
def cualitative_data():
    return yield_and_cualitative.to_json(orient='records')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)