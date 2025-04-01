//initialize the password manager
const passwordManager = new PasswordManager();

//get all DOM elements
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const addModule = document.getElementById('add-modal');
const addPasswordForm = document.getElementById('add-password-form');
const fileUpload = document.getElementById('file-upload');
const downloadBtn = document.getElementById('download-btn');
const viewAllBtn = document.getElementById('view-all-btn');
const addNewBtn = document.getElementById('add-new-btn');

// add event Listeners
//even listener for the search input
searchInput.addEventListener('input', handleSearch);

//add new password submit button event listener
addPasswordForm.addEventListener('submit', handleAddPassword);
//menu buttons event listeners
fileUpload.addEventListener('change', handleFileUpload);
downloadBtn.addEventListener('click', handleDownload);

viewAllBtn.addEventListener('click', () => {


    //Show all passwords when view all clicked
    displayPasswords(passwordManager.data.passwords); // Call displayPasswords with all passwords
    const items = document.querySelectorAll('.password-item');

    items.forEach(item => {
        item.style.display = 'flex'; //Show all items
    });

    searchInput.value = ''; //clear the search input
});

addNewBtn.addEventListener('click', () => addModule.style.display = 'block');

//close the popup when adding the password on click of the X icon
document.querySelector('.close').addEventListener('click', () => {
    addModule.style.display = 'none';

});

// Close the popup when clicking outside of the popup
window.addEventListener('click', (event) => {

    if (event.target === addModule) {
        addModule.style.display = 'none';
    }
});

//handle the search when a value is entered the search input
function handleSearch(input) {
    const keyword = input.target.value.toLowerCase();

    // If search is empty, display all passwords
    if (!keyword.trim()) {
        displayPasswords(passwordManager.data.passwords); // Call displayPasswords with all passwords
        return;
    }

    // Search passwords and display results
    const searchResults = passwordManager.searchPasswords(keyword);
    displayPasswords(searchResults);

    // Show all matching items
    const items = document.querySelectorAll('.password-item');
    items.forEach(item => {
        const username = item.querySelector('.username-text').innerText.toLowerCase();
        const website = item.querySelector('.website-text').innerText.toLowerCase();
        if (username.includes(keyword) || website.includes(keyword)) {
            item.style.display = 'flex'; // Show matching items
        } else {
            item.style.display = 'none'; // Hide non-matching items
        }
    });
}

function handleAddPassword(e) {

    //prevents the form from auto submitting and from refreshing the page
    e.preventDefault();

    //get all the form values
    const username = document.getElementById('new-username').value; 
    const password = document.getElementById('new-password').value;
    const website = document.getElementById('new-website').value;
   
    //add the password to the password manager
    passwordManager.addPassword(username, website, password);

    //update the displayed passwords UI
    addModule.style.display = 'none';//remove the popup
    addPasswordForm.reset();//clear the form
    displayPasswords(passwordManager.data.passwords); // update the password list 
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return; // Exit if no file was selected

    // Use the fileReader function to create a fileReader object to read the file content
    const reader = new FileReader();

    // Set up what happens when the file is loaded
    reader.onload = async (e) => {
        // Now e.target.result contains the file in text format so we decrypt it and then convert it into JSON
        let dataInJSON = await passwordManager.importFromJSON(e.target.result);
        if (dataInJSON) {
            //Show password verification dialog
            const masterPass = prompt("Please enter the master password to import passwords:");
            
            // Verify the entered password matches the one in file
            if (!masterPass || masterPass !== passwordManager.data.masterPassword) {
                //refresh after 1 sec
                setTimeout(() => {
                    location.reload();
                }, 1000);

                return false;
            }else{
             //Then display the passwords but keep them hidden initially
            displayPasswords(passwordManager.data.passwords);
            const items = document.querySelectorAll('.password-item');
            items.forEach(item => {
                item.style.display = 'none'; // Keep them hidden
            });
            showToast('Passwords imported successfully!', true);
            }
           
        } else {
            // If import fails then display an error message
            showToast('Error importing passwords. Please check the file format.', false);
        }
    };

    // Start reading the file as text
    reader.readAsText(file);
}

async function handleDownload() {
    if(passwordManager.data.passwords.length < 1){
        showToast("Download Failed: Please Add at least one password to your list", false)
    }else{
    //double checking if this is the action user wants to take
    const confirmed = await showConfirm('By clicking on yes you will download all the passwords into a JSON file. Do you want to continue with this action?');
    console.log(confirmed)
    //double checking if this is the action user wants to take
    if (confirmed) {
    //first we convert the passwords into JSON format
    const jsonString = await passwordManager.exportToJSON(); // Add await here

     //Create the blob object(blob is the binary data) from the json string then creates a temprerarly URL that points to the blob in memory
     const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    //create an invisable <a> element
    const a = document.createElement('a');
    a.href = url;//set the href to the blob url
    a.download = `passwords_${Date.now()}.json`;//the filename will have the timestamp in it as an ID to prevent renaming or replacing needs
    document.body.appendChild(a);//Add link to document
    a.click();//programaticly click on the element
    document.body.removeChild(a);//then remove it
    URL.revokeObjectURL(url);//remove the url to free up the memory
    

    //display success message
    showToast("Passwords were downloaded successfully", true)
    } 
    }
    
}
//render the HTML dynamicly in the UI
function displayPasswords(passwords) {
    //clear all the content in the container
    resultsContainer.innerHTML = '';
    //check if passwords array is empty or not
     if (passwords.length === 0) {
            resultsContainer.innerHTML = '<p>No passwords found.</p>';
            return;
        }
    //loop through each password and render them
    passwords.forEach(entry => {

        //Create a new div element for each password
        const item = document.createElement('div');
        item.className = 'password-item';
        
        //set up the HTML content with the username, website and the hidden password
        item.innerHTML = `
            <div class="single-modules">
                <strong>Username:</strong> <span class="username-text">${entry.username}</span><br>
                <strong>Website:</strong> <span class="website-text">${entry.website}</span><br>
                <strong>Password:</strong> ${'•'.repeat(8)}
            </div>
            <div>
                <button onclick="showPassword(${entry.id})" class="icon-button">
                    <i class="fas fa-copy"></i>
                </button>
                <button onclick="deletePassword(${entry.id})" class="icon-button">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        //add the password to the results container
        resultsContainer.appendChild(item);
        item.style.display = 'none'; // Keep item hidden by default
    });
}
//create a function for the eye icon to display the specific password when clicked
function showPassword(id) {
    // find the matching password using the ID and store it in a variable then copy it in clipboard when clicked on the icon
    const entry = passwordManager.data.passwords.find(p => p.id === id);
    if (entry) {
        //copy password to clipboard
        navigator.clipboard.writeText(entry.password)

            .then(() => {
                //if successfull display the successful toast 
                showToast('Password copied to clipboard', true);
            })
            .catch(err => {
                 //if failed display the failed to copy password
                showToast('Failed to copy password', false);
                console.error('Failed to copy:', err);
            });
    }
}

//this function would delete the specific password once clicked on the delete function
async function deletePassword(id) {
    const confirm = await showConfirm('Are you sure you want to delete this password?');
    //double check user's decision to delete the password
    if (confirm) {
        //call the function with the ID to delete the password
        passwordManager.deletePassword(id);
        //update the ui
        displayPasswords(passwordManager.data.passwords);
        showToast('Password was deleted successfully', true)
    }
}


