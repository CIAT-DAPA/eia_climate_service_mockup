from flask import Flask, jsonify, request
from flask_cors import cross_origin, CORS
from numpy import array, double
import pandas as pd
import random


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
#api = Api(app)

info_farms_for_searching = pd.read_csv('.//data//datos_cordoba_extraccion_2017.csv', 
    dtype={"ID_LOTE": int, "NOMBRE_LOTE": str, "ID_FINCA": int, "FINCA": str, "LAT_LOTE": float, "LONG_LOTE":float}, 
    usecols={"ID_LOTE", "NOMBRE_LOTE", "FINCA", "LAT_LOTE", "LONG_LOTE"})

yield_and_cuantitative = pd.read_csv('.//data//datos_cordoba_extraccion_2017.csv', 
    dtype={"RDT": float, "NUM_SEMILLAS": float, "DIST_SURCOS": float, "DIST_PLANTAS": float, "SEM_POR_SITIO": float,
        "OBJ_RDT":float, "POBLACION_20DIAS":float, "production_har": float, "humidity_percentage_har": float, "area_fie":float,
        "NOMBRE_LOTE":str}, 
    usecols={"production_har", "NUM_SEMILLAS", "DIST_SURCOS", "DIST_PLANTAS", "SEM_POR_SITIO",
        "OBJ_RDT", "POBLACION_20DIAS", "RDT", "humidity_percentage_har", "area_fie", "NOMBRE_LOTE"})

yield_and_cualitative = pd.read_csv('.//data//datos_cordoba_extraccion_2017.csv', 
    dtype={"RDT": float, "TIPO_SIEMBRA": str, "SEM_TRATADAS": str, "TIPO_CULTIVO": str, "COLOR_ENDOSPERMO": str,
        "MATERIAL_GENETICO":str, "CULT_ANT":str, "DRENAJE": str, "METODO_COSECHA": str, "PROD_COSECHADO":str,
        "NOMBRE_LOTE":str, "name_gen_sow":str, "ALMACENAMIENTO_FINCA":str}, 
    usecols={"RDT", "TIPO_SIEMBRA", "SEM_TRATADAS", "TIPO_CULTIVO", "COLOR_ENDOSPERMO",
        "MATERIAL_GENETICO", "CULT_ANT", "DRENAJE", "METODO_COSECHA", "PROD_COSECHADO", "NOMBRE_LOTE", "name_gen_sow", "ALMACENAMIENTO_FINCA"})

yield_and_cuantitative = yield_and_cuantitative.dropna()
yield_and_cualitative = yield_and_cualitative.dropna()


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
    results_by_lotes = []
    for r in range(int(len(body["lotes"]))):
         results_by_lotes.append(result_data(body["predictores"], body["lotes"][r]['label']))

    return jsonify(results_by_lotes)

@app.route('/farm/<name>', methods=['GET'])
@cross_origin()
def search(name):
    search_for=name.upper()
    result = info_farms_for_searching[info_farms_for_searching['FINCA'] == search_for]
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