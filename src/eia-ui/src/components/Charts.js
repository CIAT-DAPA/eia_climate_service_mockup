import React, {useState, useEffect} from "react";
import '../styles/nvd3.css'
import Chart from "react-apexcharts";
import { Row, Col, Form, FloatingLabel} from "react-bootstrap";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
  
};

const variablesCuantitatives = ["DIST_PLANTAS", "DIST_SURCOS", "NUM_SEMILLAS", "OBJ_RDT",
  "POBLACION_20DIAS", "production_har", "SEM_POR_SITIO", "area_fie", "humidity_percentage_har"

]

const variablesCualitatives = ['ALMACENAMIENTO_FINCA', 'COLOR_ENDOSPERMO', 'CULT_ANT', 'DRENAJE', 'MATERIAL_GENETICO', 
    'METODO_COSECHA', 'PROD_COSECHADO', 'SEM_TRATADAS', 'TIPO_CULTIVO',
    'TIPO_SIEMBRA', 'name_gen_sow'];

const Charts = ({cuantitativeData, cualitativeData}) => {

  const [cuantitativeDataFilter, setCuantitativeDataFilter] = useState([]);
  const [cualitativeDataFilter, setCualitativeDataFilter] = useState([]);

    const variableOnChangeCuantitativeData = (e) => {

      if(cuantitativeData){
        var result = cuantitativeData.filter(obj => {
          return obj.name === e
        })
        setCuantitativeDataFilter(result);
        
      }

    }

    const variableOnChangeCualitativeData = (e) => {

      if(cualitativeData){
        var result = cualitativeData.filter(obj => {
          return obj.key === e
        })
        var finalFormat = [];
        for(const [key, value] of result[0].value){
          finalFormat.push({x: key, y: value});

        }
        setCualitativeDataFilter(finalFormat);
      }

    }

    const Boxplot = () => {

      let state = {
          
        series: 
        [
          {
            type: 'boxPlot',
            data: cualitativeDataFilter
          }
        ],
        options: {
          chart: {
            type: 'boxPlot',
            height: 350
          },
          title: {
            text: 'Rendimiento vs prácticas de manejo en Boxplot para datos cualitativos',
            align: 'left'
          },
          plotOptions: {
            boxPlot: {
              colors: {
                upper: '#5C4742',
                lower: '#A5978B'
              }
            }
          }
        },
      
      
      };

      return(
        <Chart options={state.options} series={state.series} type="boxPlot" height={350} />

    
      )

    }

 

    const Scatter =() => {

        let options = {
          chart: {
          animations: {
            enabled: false, 
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            size: 0
          },
            height: 350,
            type: 'scatter',
            zoom: {
              enabled: true,
              type: 'xy'
            }
          },
          title: {
            text: 'Rendimiento vs prácticas de manejo en Scatterplot para datos cuantitativos',
            align: 'left'
          },
          xaxis: {
            tickAmount: 10,
            labels: {
              formatter: function(val) {
                return parseFloat(val).toFixed(1)
              }
            }
          },
          yaxis: {
            tickAmount: 7,
            
          }
        }
        
        return(
          <Chart options={options} series={cuantitativeDataFilter} type="scatter" height={350} />
        );
          
    }




    return(
        <div className="mt-4 mb-4">
          <Row>
            
            <Col>
              <h6>Comparación de datos históricos de rendimiento vs prácticas de manejo</h6>

                <Form.Group as={Col} controlId="formGridSelectPredictor">
                                
                                <FloatingLabel controlId="floatingSelectInitialMonth" label="Seleccione variable a comparar con el rendimiento">
                                    <Form.Select 
                                        aria-label="Floating label select example"
                                        onChange={e => variableOnChangeCuantitativeData(e.target.value)}
                                        
                                    >
                                        <option>Seleccionar</option>
                                        {
                                        variablesCuantitatives.map( variable => (
                                            
                                            <option>{variable}</option>

                                                )

                                            )
                                        }
                                        
                                    </Form.Select>
                                </FloatingLabel>

                </Form.Group>
              
                {
                  cuantitativeDataFilter && <Scatter/> 
                }

                <Form.Group as={Col} controlId="formGridSelectPredictor">
                                
                                <FloatingLabel controlId="floatingSelectInitialMonth" label="Seleccione variable a comparar con el rendimiento">
                                    <Form.Select 
                                        aria-label="Floating label select example"
                                        onChange={e => variableOnChangeCualitativeData(e.target.value)}
                                        
                                    >
                                        <option>Seleccionar</option>
                                        {
                                        variablesCualitatives.map( variable => (
                                            
                                            <option>{variable}</option>

                                                )

                                            )
                                        }
                                        
                                    </Form.Select>
                                </FloatingLabel>

                </Form.Group>
              
                {
                  cuantitativeDataFilter && <Boxplot/> 
                }

                
            
            </Col>


          </Row>
            
           
          
          

        

        </div>
    )


}
export default Charts;