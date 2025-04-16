import React, { useEffect } from 'react';
import './style.css';

const Map3D: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/src/mapDisplay.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="full">
      
      <div id="viewDiv" style={{ width: "100%", height: "100vh" }}>
        
      </div>
      <div className="mentions">
        
        <h4>
          RÉALISÉ AVEC
          <a
            href="https://developers.arcgis.com/javascript/latest/"
            target="_blank"
          >
              L'API JAVASCRIPT D'ARCGIS
          </a>
          <br />GITHUB :
          <a
            href="https://github.com/JapaLenos/JS-API/tree/main/Jardins-Parisiens"
            target="_blank"
          >
            @ngwehasteve
          </a>
          <br />relised by:
          <a
            href="https://github.com/stevengweha"
            target="_blank"
          >
           pierre steve ngweha peni, bill tuenkam yann, izac tiote
          </a>
        </h4>
      </div>
    </div>
  );
};

export default Map3D;