import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const BarGraph = ({array, currentId, finished}) =>{
    let sorted = [...array].reverse();

    const labels = sorted.map(process => process.id);

    const finishedLabels = finished.map(process => process.id);

    const tmeValues = sorted.map(process => process.tme);
    
    const getColor = (id) => {
        if(id === currentId){
            return 'rgba(255, 0, 0, 0.8)';
        }
        else if(finishedLabels.includes(id)){
            return 'rgba(0, 255, 0, 0.8)';
        }
        else{
            return 'rgba(204, 84, 9, 0.8)';
        }
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Tiempo estimado',
                data: tmeValues,
                backgroundColor: labels.map(id => getColor(id)),
                borderColor: labels.map(id => getColor(id)),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                type: 'linear',
                beginAtZero: true,
            },
        },
    };
    
    return (
        <div style = {{position: 'absolute', width: '800px', height: 'auto', right: '31%'}}>
            <Bar data = {data} options = {options}></Bar>
        </div>
    );
};

export default BarGraph;
