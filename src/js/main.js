

//get all DOM elements
const addNewBtn = document.getElementById('add-new-btn');
const searchInput = document.getElementById('search-input');
const downloadBtn = document.getElementById('download-btn');


const viewAllBtn = document.getElementById('view-all-btn');

const resultsContainer = document.getElementById('results-container');
const addModule = document.getElementById('add-modal');
const addPasswordForm = document.getElementById('add-password-form');
const fileUpload = document.getElementById('file-upload');


// add event Listeners
searchInput.addEventListener('input', handleSearch);


addPasswordForm.addEventListener('submit', handleAddPassword);
fileUpload.addEventListener('change', handleFileUpload);
downloadBtn.addEventListener('click', handleDownload);

viewAllBtn.addEventListener('click', () => {

});

addNewBtn.addEventListener('click', () => addModule.style.display = 'block');

//close the popup when adding the password on click of the X icon
document.querySelector('.close').addEventListener('click', () => {
    addModule.style.display = 'none';

});



//handle the search when a value is entered the search input
function handleSearch(input) {
    const keyword = input.target.value.toLowerCase();

}

function handleAddPassword(e) {

    //prevents the form from auto submitting and from refreshing the page
    e.preventDefault();

    addModule.style.display = 'none';
    addPasswordForm.reset();//clear the form
   
}
function displayPasswords() {

    resultsContainer.innerHTML = '';
    
    passwords.forEach(entry => {

        //Create a new div element for each password
        const item = document.createElement('div');
        item.className = 'password-item';
        item.innerHTML = `something`;

        //add the password to the results container
        resultsContainer.appendChild(item);
        item.style.display = 'none'; // Keep item hidden by default
    });
}
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return; // Exit if no file was selected


    const reader = new FileReader();

    // Set up what happens when the file is loaded
    reader.onload = async (e) => {
        
    };

    // Start reading the file as text
    reader.readAsText(file);
}

async function handleDownload() {

}


function showPassword(id) {

}

//this function would delete the specific password once clicked on the delete function
async function deletePassword(id) {
    const confirm = await showConfirm('Are you sure you want to delete this password?');
    if (confirm) {
        
    }
}


