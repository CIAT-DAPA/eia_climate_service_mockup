import React, {useState, useEffect} from "react";
import { Table, Accordion} from "react-bootstrap";

const Results = ({returnedData, lotesSelected, managmentFactors}) => {
    
    let returnedDataFixed = returnedData.returnedData;
    
    useEffect(() => {
        returnedDataFixed = returnedData.returnedData;
        
        
      }, [returnedData]);


    

    
    return(

        <div className="mt-1">

            

                
                    {   //Se recorre el objeto (que eran un json antes de estar en este componente) y se ponen los datos en la tabla
                        
                        returnedData.map((predictorsByLote, i)=>(
                            <div>
                                

                            <Accordion defaultActiveKey={['0']} alwaysOpen>
                                <Accordion.Item eventKey={i.toString()}>
                                    <Accordion.Header>{lotesSelected[i].label}</Accordion.Header>

                                    <Accordion.Body>
                                    <Table size="sm" striped={true} borderless={true} bordered={true}>
                                       
                                       <thead>
                                           <tr>
                                            <th>Factores de manejo</th>
                                            <th>Actual</th>
                                            <th>Óptimo</th>
                                            <th>Unidad</th>
                                           </tr>
                                       </thead>

                                           {   //Aquí se leen los resultados. Debido a que son arrays anidados, se deben leer los resultados de esa manera.
                                               // predictorsByLote.predictors - todos los predictores
                                               // currentPredictor - la llave del primero predictor. Es una posicion en el arreglo
                                               // Object.keys(predictorsByLote.predictors[currentPredictor]) - el nombre del predictor
                                               Object.keys(predictorsByLote.optimo[0]).map((currentPredictor, i)=>(
                                                   <tbody>
               
                                                   {
                                                       (currentPredictor !== 'Performance') &&
                                                       <tr>
                                               
                                                           <td>{managmentFactors[currentPredictor][0]}</td>
                                                           <td>{predictorsByLote.actual[0][currentPredictor]}</td>
                                                           <td>{predictorsByLote.optimo[0][currentPredictor]}</td>
                                                           <td>{managmentFactors[currentPredictor][1]}</td>
                                                           {/* <td>{predictorsByLote.predictors[currentPredictor][Object.keys(predictorsByLote.predictors[currentPredictor])].current}</td>
                                                           <td>{predictorsByLote.predictors[currentPredictor][Object.keys(predictorsByLote.predictors[currentPredictor])].optimal}</td> */}

                                                       </tr>

                                                   }
                                                   </tbody>
               
                                                   )
                       
                                               )

                                           }

                                       


                                       <thead>
                                           <tr>
                               
                                           <th>Rendimiento (ton/ha)</th>
                                           <th>{predictorsByLote.actual[0]["Yield"]}</th>
                                           <th>{predictorsByLote.optimo[0]["Performance"]}</th>
                                           </tr>
                                       </thead>
                               </Table>
        
                                    </Accordion.Body>

                                </Accordion.Item>

                                
                            </Accordion>
                            </div>
                            )

                        )
                    }
                

                    
        </div>



        
    )
}

export default Results;