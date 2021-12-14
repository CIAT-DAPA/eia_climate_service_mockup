import React, {useState, useEffect} from "react";
import '../styles/nvd3.css'
import NVD3Chart from "react-nvd3";
import { render } from "react-dom";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};




var datum = [{
  key: "A",
  values: [
    {
      "label" : "popuj" ,
      "value" : 500000,
    }
    
      ]
  },
  {
  key: "B",
  values: [
    {
      "label" : "asas" ,
      "value" : 400000
    } 
      ]
  }
]

const Charts = ({cuantitativeData}) => {

  console.log(cuantitativeData)

    const Scatter =() => {
        

        
        
        return(
          <div  style={styles}>
            <NVD3Chart id="scatterChart" type="scatterChart" datum={cuantitativeData} x="value" y="key"/>
          </div>

        );
          
          
    }




    return(
        <div className="mt-4">
           
         
            <Scatter/>
           
          
          

            

            


        </div>
    )


}
export default Charts;