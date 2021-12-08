from flask import Flask, jsonify, request
from numpy import double
import pandas as pd


app = Flask(__name__)

info_farms_for_searching = pd.read_csv('.//data//datos_cordoba_extraccion_2017.csv', 
    dtype={"ID_LOTE": int, "NOMBRE_LOTE": str, "ID_FINCA": int, "FINCA": str, "LAT_LOTE": float, "LONG_LOTE":float}, 
    usecols={"ID_LOTE", "NOMBRE_LOTE", "FINCA", "LAT_LOTE", "LONG_LOTE"})

info_farms_for_searching['FINCA'] = info_farms_for_searching['FINCA'].str.upper()
info_farms_for_searching['NOMBRE_LOTE'] = info_farms_for_searching['NOMBRE_LOTE'].str.upper()






@app.route('/dummy/', methods=['GET', 'POST'])
def welcome():

    json_data = request.form
    return jsonify({

        'predictors':{

            'number_of_post_sowing_herbicides_applications': {
                'current': 1,
                'optimal': 0.8 
            },
            'number_of_applications_of_insecticides': {
                'current': 2,
                'optimal': 0.8 
            },
            'total_amount_of_nitrogen_applied_kg_ha': {
                'current': 3,
                'optimal': 2 
            },
            'total_amount_of_phosporus_applied_kg_ha': {
                'current': 4,
                'optimal': 12 
            },
            'total_amount_of_potassium_applied': {
                'current': 5,
                'optimal': 7 
            },
            'cultivars_group': {
                'current': 'others',
                'optimal': 'P4082W' 
            },
            'seed_treatment': {
                'current':'No',
                'optimal':'Yes' 
            },
            'conservation_agriculture': {
                'current':'No',
                'optimal':'Yes' 
            },
        },

        'yield': {
            'current': 15,
            'optimal': 17 
        }
        })

@app.route('/farm/<name>', methods=['GET'])
def search(name):
    search_for=name.upper()
    result = info_farms_for_searching[info_farms_for_searching['FINCA'] == search_for]
    return result.to_json(orient='records')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)