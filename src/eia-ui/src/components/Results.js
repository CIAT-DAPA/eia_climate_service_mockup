import React, {useState, useEffect} from "react";
import { Table} from "react-bootstrap";

const Results = (returnedData) => {
    
    let returnedDataFixed = returnedData.returnedData;
    

    useEffect(() => {
        returnedDataFixed = returnedData.returnedData;
        
        
      }, [returnedData]);


    

    
    return(

        <div className="mt-4">

            

                
                    {   //Se recorre el objeto (que eran un json antes de estar en este componente) y se ponen los datos en la tabla
                        
                        returnedDataFixed.map((predictorsByLote, i)=>(
                            <div>
                                

                            <Table striped bordered hover size="sm">
                                    <thead>
                                        <th>{returnedData.lotes[i].label}</th>
                                    </thead>
                                    <thead>
                                        <tr>
                                        <th>Predictores</th>
                                        <th>Actual</th>
                                        <th>Óptimo</th>
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
                                            
                                                        <td>{currentPredictor}</td>
                                                        <td>{predictorsByLote.actual[0][currentPredictor]}</td>
                                                        <td>{predictorsByLote.optimo[0][currentPredictor]}</td>
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
                            
                                        <th>Rendimiento t/ha</th>
                                        <th>{predictorsByLote.actual[0]["Yield"]}</th>
                                        <th>{predictorsByLote.optimo[0]["Performance"]}</th>
                                        </tr>
                                    </thead>
                            </Table>
                            </div>
                            )

                        )
                    }
                

                    
        </div>



        
    )
}

export default Results;