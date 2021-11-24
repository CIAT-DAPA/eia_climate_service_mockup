from flask import Flask, jsonify

app = Flask(__name__)
@app.route('/dummy/', methods=['GET', 'POST'])
def welcome():
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
                'current': 6,
                'optimal': 10 
            },
            'seed_treatment': {
                'current': 7,
                'optimal': 4 
            },
            'conservation_agriculture': {
                'current': 8,
                'optimal': 2 
            }
        },

        'yield': {
            'current': 15,
            'optimal': 17 
        }
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)