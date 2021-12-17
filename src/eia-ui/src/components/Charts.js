import React, {useState, useEffect} from "react";
import '../styles/nvd3.css'
import NVD3Chart from "react-nvd3";
import Chart from "react-apexcharts";
import { Row, Col, Button, Form, FloatingLabel, InputGroup, FormControl} from "react-bootstrap";
import { render } from "react-dom";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
  
};

const variables = ["DIST_PLANTAS", "DIST_SURCOS", "NUM_SEMILLAS", "OBJ_RDT",
  "POBLACION_20DIAS", "production_har", "SEM_POR_SITIO", "area_fie", "humidity_percentage_har"

]

const Charts = ({cuantitativeData}) => {

  const [dataFilter, setDataFilter] = useState([]);

    const variableOnChange = (e) => {
      
      var result = cuantitativeData.filter(obj => {
        return obj.name === e
      })
      
      setDataFilter(result);



    }

    const Boxplot = () => {

      let state = {
          
        series: [
          {
            type: 'boxPlot',
            data: [
              {
                x: 'Jan 2015',
                y: [54, 66, 69, 75, 88]
              },
              {
                x: 'Jan 2016',
                y: [43, 65, 69, 76, 81]
              },
              {
                x: 'Jan 2017',
                y: [31, 39, 45, 51, 59]
              },
              {
                x: 'Jan 2018',
                y: [39, 46, 55, 65, 71]
              },
              {
                x: 'Jan 2019',
                y: [29, 31, 35, 39, 44]
              },
              {
                x: 'Jan 2020',
                y: [41, 49, 58, 61, 67]
              },
              {
                x: 'Jan 2021',
                y: [54, 59, 66, 71, 88]
              }
            ]
          }
        ],
        options: {
          chart: {
            type: 'boxPlot',
            height: 350
          },
          title: {
            text: 'Rendimiento vs prácticas de manejo en Boxplot',
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
            text: 'Rendimiento vs prácticas de manejo en Scatterplot',
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
          <Chart options={options} series={dataFilter} type="scatter" height={350} />
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
                                        onChange={e => variableOnChange(e.target.value)}
                                        
                                    >
                                        <option>Seleccionar</option>
                                        {
                                        variables.map( variable => (
                                            
                                            <option>{variable}</option>

                                                )

                                            )
                                        }
                                        
                                    </Form.Select>
                                </FloatingLabel>

                </Form.Group>
              
                {
                  dataFilter && <Scatter/>
                }

                <Boxplot/>
            
            </Col>


          </Row>
            
           
          
          

        

        </div>
    )


}
export default Charts;