document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
  
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
  
    document.getElementById('clearBtn').addEventListener('click', clearCanvas);
    document.getElementById('predictBtn').addEventListener('click', predictNumber);
  
    function startDrawing(e) {
      isDrawing = true;
      draw(e);
    }
  
    function draw(e) {
      if (!isDrawing) return;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
      ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }
  
    function stopDrawing() {
      isDrawing = false;
      ctx.beginPath();
    }
  
    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    async function predictNumber() {
        const drawingDataURL = canvas.toDataURL();
        const cleanedBase64 = drawingDataURL.split(',')[1];
        
        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: cleanedBase64 })
            });
    
            const data = await response.json();
            
            if (data.prediction !== undefined && data.prediction_percentage !== undefined && 
                data.second_closest_prediction !== undefined && data.second_prediction_percentage !== undefined) {
                
                alert(`Predicted Number: ${data.prediction} (${data.prediction_percentage})\n` + 
                      `Second Closest Number: ${data.second_closest_prediction} (${data.second_prediction_percentage})`);
                
            } else {
                alert('Prediction failed. Please try again.');
            }
    
        } catch (error) {
            console.error("Error predicting number:", error);
            alert('An error occurred while predicting. Please try again.');
        }
    }
    
    
  
    
  });
  