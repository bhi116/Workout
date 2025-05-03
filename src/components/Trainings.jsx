import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import dayjs from 'dayjs';


ModuleRegistry.registerModules([AllCommunityModule]);


export default function Customers() {

    const [trainings, setTrainings] = useState([]);
    const gridRef = useRef();


    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
        .then(response => response.json())
        .then(data => {
            const Trainings = data._embedded.trainings;
    
            // haetaan asiakkaan nimi
            const customerFetches = Trainings.map(training =>
              fetch(training._links.customer.href)
                .then(response => response.json())
                .then(customer => ({
                  ...training,
                  customerName: `${customer.firstname} ${customer.lastname}`
                }))
            );

            Promise.all(customerFetches).then(trainingsWithCustomers => {
            setTrainings(trainingsWithCustomers);
            });
        })
        .catch(error => console.error("Virhe datan haussa:", error));
    }

    const columns = [
        {headerName: 'Date', field: 'date', valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm')},
        {headerName: 'Duration', field: 'duration'},
        {headerName: 'Activity', field: 'activity'},
        {headerName: 'Customer', field: 'customerName'}
        //{headerName: '', field: 'edit', filter: false, sortable: false, width: 100,
        //    cellRenderer: (params) => <Editcar updateCar={updateCar} car={params.data} />
        //},
        //{headerName: '', filter: false, sortable: false, width: 100, field: '_links.self.href',
        //    cellRenderer: (params) => 
        //    <Button size="small" color="secondary" onClick={() => deleteCar(params.value)}>Delete</Button>
        //}
      ]

    return (
        <div>
            <h1>Trainings</h1>
            <div style={{ height: '600px', width: '99vw'}}>
                <AgGridReact 
                    ref={gridRef}
                    onGridReady={ params => gridRef.current = params.api }
                    rowData={trainings}
                    columnDefs={columns}
                    rowSelection={{ mode: 'singleRow', checkboxes: false }}
                    pagination={true}       
                    paginationPageSize={10}
                    paginationPageSizeSelector={[5, 10, 25, 50]} 
                />
            </div>
        </div>
    ) 

    
}