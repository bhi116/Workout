import { useEffect } from "react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Button from '@mui/material/Button';
import workoutimg from '../assets/workout.jpg';
import workoutimg2 from '../assets/workout2.jpg';

ModuleRegistry.registerModules([AllCommunityModule]);


export default function Home() {
    
    const fetchData = () => {
        console.log("Data haettu!");
    };
    

    // resetoi tietokanta
    const resetDatabase = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/reset', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                alert("Tietokanta on resetoitu.");
                fetchData();
            } else {
                alert("Resetointi epäonnistui.");
            }
        })
        .catch(error => {
            console.error("Virhe resetoinnissa:", error);
            alert("Tapahtui virhe.");
        });
    };

    useEffect(() => fetchData(), []);

    return (
        <div style={{ padding: '15px', fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif' }}>
           <h1>Personal Trainer App</h1>
            <Button variant="contained" color="primary" onClick={resetDatabase}>
                Reset Database
            </Button>
            <br/>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <img src={workoutimg} alt="Workout picture"
                style={{ width: '50%', height: '400px', marginTop: '30px', objectFit: 'cover' }}/>
            <img src={workoutimg2} alt="Workout picture"
                style={{ width: '50%', height: '400px', marginTop: '30px', objectFit: 'cover' }}/>  
            </div>    
        </div>
    ) 

    
}