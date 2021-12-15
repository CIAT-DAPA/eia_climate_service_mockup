import React, {useState, useEffect} from "react";
import '../styles/nvd3.css'
import NVD3Chart from "react-nvd3";
import { Row, Col, Button, Form, FloatingLabel, InputGroup, FormControl} from "react-bootstrap";
import { render } from "react-dom";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
  
};

const variables = ["DIST_PLANTAS", "DIST_SURCOS", "NUM_SEMILLAS", "OBJ_RDT",
  "POBLACION_20DIAS", "RDT", "SEM_POR_SITIO", "area_fie", "humidity_percentage_har"

]

const Charts = ({cuantitativeData}) => {

  const [dataFilter, setDataFilter] = useState([]);

    const variableOnChange = (e) => {
      
      var result = cuantitativeData.filter(obj => {
        return obj.key === e
      })
      
      setDataFilter(result);



    }

 

    const Scatter =() => {
        
        return(
          <div  style={styles}>
            <NVD3Chart id="scatterChart" type="scatterChart" datum={dataFilter} x="key" y="y"/>
          </div>

        );
          
          
    }




    return(
        <div className="mt-4">
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
            
           
          
          

        

        </div>
    )


}
export default Charts;