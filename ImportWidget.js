(function() {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <style>
    .switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

    </style>

<div style="display: flex; align-items: center;">
  <label class="switch">
    <input type="checkbox" id="debugToggle">
    <span class="slider round"></span>
  </label>
  <p id="debugStatus" style="margin-left: 10px;">Debugging Mode Inactive</p>
</div>

<div id="debugging-area" style="display: none;">
  <h2>Debugging Mode</h2>
  <button id="getAccessToken">Get Access Token</button>
  <button id="getCsrfToken">Get CSRF Token</button>
  <button id="createJob">Create Job</button>
  <button id="uploadData">Upload Data</button>
  <button id="validateJob">Validate Job</button>
  <button id="runJob">Run Job</button>
  <h3>Messages</h3>
  <div id="messages"></div>
</div>

    `;



    
    class ImportWidgetAPI extends HTMLElement {
        constructor() {
            super();
            console.log('Constructor called');
            this._shadowRoot = this.attachShadow({mode: 'open'});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._props = {};
            this.tasks = [];
            this.taskToCsv = this.taskToCsv.bind(this);


 
// Add event listener for the toggle button
this._shadowRoot.getElementById('debugToggle').addEventListener('change', () => {
  const debuggingArea = this._shadowRoot.getElementById('debugging-area');
  const debugStatus = this._shadowRoot.getElementById('debugStatus');
  if (this._shadowRoot.getElementById('debugToggle').checked) {
    debugStatus.textContent = 'Debugging Mode Active';
    debuggingArea.style.display = 'block';
  } else {
    debugStatus.textContent = 'Debugging Mode Inactive';
    debuggingArea.style.display = 'none';
  }
});


// Get a reference to the messages element
const messagesElement = this._shadowRoot.getElementById('messages');

// Pass the reference to the functions
 const csvData_debugger = `Version,Date,DIM,DIM2
public.Actual,202401,1,1,1`;
            
this._shadowRoot.getElementById('getAccessToken').addEventListener('click', () => window.getAccessToken(messagesElement));
this._shadowRoot.getElementById('getCsrfToken').addEventListener('click', () => window.getCsrfToken(messagesElement));
this._shadowRoot.getElementById('createJob').addEventListener('click', () => window.createJob(messagesElement));
this._shadowRoot.getElementById('uploadData').addEventListener('click', () => window.uploadData(csvData_debugger, messagesElement));
this._shadowRoot.getElementById('validateJob').addEventListener('click', () => window.validateJob(messagesElement));
this._shadowRoot.getElementById('runJob').addEventListener('click', () => window.runJob(messagesElement));


// Load SACAPI_DataImport.js
        const script = document.createElement('script');
        script.src = 'https://https://franaguilarlt.github.io/Test/SACIMPORT.js';
        document.head.appendChild(script);
            
        }

    taskToCsv(task) {
        // Convert the task data to the CSV format
        const version = 'public.Actual';  
        const date =  '000000'; 
        const dim = task.id;
        const dim2 = task.text;
     
        console.log("New task was added: ", task);
  
        // Create the CSV string
        const csvString = `${version},${date},${dim},${dim2}`;

        // Log the CSV string
        console.log('CSV string:', csvString);
  const csvData_raw = 'Version,Date,DIM,DIM2\n' + csvString;

        // Return the CSV string
           console.log('Data_raw:', csvData_raw);
    
        return csvData_raw;
    }



        // GanttChart methods
        static get metadata() {
            console.log('metadata called');
            return {
                properties: {
                    myDataBinding: {
                        type: "object",
                        defaultValue: {}
                    },
                }
            };
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            console.log('onCustomWidgetBeforeUpdate called');
            this._props = { ...this._props, ...changedProperties };
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            console.log('onCustomWidgetAfterUpdate called');
            if ("myDataBinding" in changedProperties) {
                const dataBinding = changedProperties.myDataBinding;
                if (dataBinding.state === 'success') {
                    this._updateData(dataBinding);
                }
            }
        }

_updateData(dataBinding) {
    console.log('_updateData called');
    if (dataBinding && Array.isArray(dataBinding.data)) {
        this.tasks = dataBinding.data.map((row, index) => {
            if (row.dimensions_0 && row.dimensions_1 && row.dimensions_2 && row.dimensions_3) {
  
                
                console.log('original startDate:', row.dimensions_2.id , 'endDate:', row.dimensions_3.id);  // Log the start and end dates
             console.log('the rest measure:', row.measures_0.raw, 'the rest dim', row.dimensions_4.id );  // Log the start and end dates
                
   const startDate = new Date(row.dimensions_2.id);
const endDate = new Date(row.dimensions_3.id);

                console.log('original startDate:', startDate, 'endDate:', endDate);  // Log the start and end dates
       
                // Check if startDate and endDate are valid dates
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.error('Invalid date:', row.dimensions_2.id, row.dimensions_3.id);
                    return null;
                }
                // Check if startDate is before endDate
                if (startDate > endDate) {
                    console.error('Start date is after end date:', startDate, endDate);
                    return null;
                }
                console.log('startDate:', startDate, 'endDate:', endDate);  // Log the start and end dates
                return {
                    id: row.dimensions_0.label,  // Unique id of task
                    text: row.dimensions_1.label,  // Name of task
                    start_date: startDate,  // Start date of task
                    end_date: endDate,  // End date of task
                    progress: row.measures_0.raw,  // Progress of task in percent
                    open: row.dimensions_4.id  // Task is open by default
                };
            }
        }).filter(Boolean);  // Filter out any null values

        // Check if all tasks have valid start and end dates
        for (let task of this.tasks) {
            if (!task.start_date || !task.end_date) {
                console.error('Task with null start or end date:', task);
            }
        }

        console.log('Tasks:', this.tasks);  // Log the tasks

        this._renderChart();
    }
}


_renderChart() {
    console.log('_renderChart called');
    
    const chartElement = this._shadowRoot.getElementById('chart');

    // Set fit_tasks to false to enable horizontal scrolling
    gantt.config.fit_tasks = true;
        // Configure the Gantt chart to use a monthly scale
    gantt.config.scale_unit = "month";
    gantt.config.step = 1;
    
    // Initialize the Gantt chart
    gantt.init(chartElement);



gantt.attachEvent("onAfterTaskAdd", (id, task) => {
    console.log("New task was added: ", task);
    // Convert the task to CSV
    const csvData = this.taskToCsv(task);
    // Retrieve the tokens and then call createJob, uploadData, validateJob, and runJob
    window.getAccessToken().then(() => {
        window.getCsrfToken().then(() => {
            window.createJob().then(() => {
                window.uploadData(csvData).then(() => {
                    window.validateJob().then(() => {
                        window.runJob();
                          gantt.clearAll();
                           // Load the new data
                        gantt.parse({ data: this.tasks });

                    });
                });
            });
        });
    });
});

        
        // Load the tasks into the Gantt chart
        gantt.parse({ data: this.tasks });

        console.log('Gantt chart rendered');
    
}






    }

    customElements.define('gantt-chart-widget-api', GanttChartWidgetAPI);
})();