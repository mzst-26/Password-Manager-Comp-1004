//Toast notification function that can be exported and reused
function showToast(message, state) {


    //this will be a non-blocking toast notification instead of using the alart() function
    const toast = document.createElement('div');

    toast.style.cssText = ` 

        transform: translateX(-50%);
        background-color: ${state == true ? '#4CAF50' : '#af4c4c'};
        color: white;
        padding: 16px;
        border-radius: 4px;
        z-index: 1000;
        position: fixed;
        bottom: 20px;
        left: 50%;
       
    `;

    toast.textContent = message;

    document.body.appendChild(toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 5000);
}

//Confirmation dialog function that returns true/false based on user choice
function showConfirm(message) {
    return new Promise((resolve) => {
        //create the popup container
        const confirmDialog = document.createElement('div');
        //insert the html elements and style into the div

        //styles
        confirmDialog.style.cssText = ` 
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            color: black;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
           
        `;
        //elements 
        confirmDialog.innerHTML = `
            <p style="margin-bottom: 20px; color: black;">${message}</p>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="confirm-yes" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Yes</button>
                <button id="confirm-no" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">No</button>
            </div>
        `;

        document.body.appendChild(confirmDialog);
        //get DOM elements
        const yesButton = confirmDialog.querySelector('#confirm-yes');
        const noButton = confirmDialog.querySelector('#confirm-no');
        //handel the event using onclick when clicked on the buttons then remove the popup and return the state
        yesButton.onclick = () => {
            document.body.removeChild(confirmDialog);
            resolve(true);
        };

        noButton.onclick = () => {
            document.body.removeChild(confirmDialog);
            resolve(false);
        };
    });
}

//this function will encrypt text with the secretKey
function encrypt(text, secretKey) {

    let encryptedText = ""; // This will store the encrypted version of the text
    
    // Loop through each character in the text
    for (let i = 0; i < text.length; i++) {
        //Apply the XOR between each character and a character in the secret key
        //this will make the text unreadable without the key
        encryptedText += String.fromCharCode(text.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length));
    }
    
    //convert the encrypted text into Base64 so it can be safely stored or sent
    return btoa(encryptedText);
}

//decrypt the text back to original string
function decrypt(string, secretKey) {

    let decryptedText = "";
    
    //decode the Base64 encoded text
    const encryptedText = atob(string); 
    
    //loop through the  character in the encrypted text
    for (let i = 0; i < encryptedText.length; i++) {

        // apply the XOR again with the same key to get back the original text
        decryptedText += String.fromCharCode(encryptedText.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length));
    }
    
     //Return the original text after decryption
    return decryptedText;
}



function encryptMasterPassword(masterPassword) {
    let encryptedText = ""; // This will store the encrypted version of the text
    
    //shift the charactors by 3
    for (let i = 0; i < masterPassword.length; i++) {
        encryptedText += String.fromCharCode(masterPassword.charCodeAt(i) + 3)
    }
    // Convert the encrypted text into Base64 so it can be safely stored or sent
    return btoa(encryptedText);
}

//decrypt the master pass
function decryptMasterPassword(encryptedPassword) {
    let decryptedText = "";
    // Decode the Base64 encoded text
    const encryptedText = atob(encryptedPassword);
    for (let i = 0; i < encryptedText.length; i++) {
        decryptedText += String.fromCharCode(encryptedText.charCodeAt(i) - 3); // Shift characters back by 3
    }
    return decryptedText;
}



//Confirmation returns true/false on user choice
function masterPasswordSavedConfirm(masterPassword) {
    return new Promise((resolve) => {
        //create the popup container
        const confirmDialog = document.createElement('div');
        //styles
        confirmDialog.style.cssText = ` 
            padding: 20px; 
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            max-width: 500px;
            width: 90%;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            color: black;
            position: fixed;
           


        `;
        //elements 
        confirmDialog.innerHTML = `
            <div style="margin-bottom: 20px; color: black;">
                <p style="font-size: 18px; margin-bottom: 15px;">⚠️ THIS IS YOUR MASTER PASSWORD ⚠️</p>

                <div style="background: #f8f8f8; padding: 10px; border-radius: 4px; margin: 10px 0; display: flex; justify-content: space-between; align-items: center;">
                    <code style="word-break: break-all;">${masterPassword}</code>


                    <button onclick="navigator.clipboard.writeText('${masterPassword}')" style="padding: 4px 8px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-copy"></i> Copy
                    </button>

                </div>



                <p style="margin-top: 15px;">This is the only time you can save your master password.</p>
                <p style="margin-top: 5px;">Without this you <strong>can not</strong> have access to your passwords.</p>
                <p style="margin-top: 5px;">Please save the master password safe and confirm that you have saved it by pressing on yes</p>


            </div>
            <div style="display: flex; justify-content: center;">
                <button id="confirm-yes" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Yes, I have saved the master password</button>
            </div>
        `;

        document.body.appendChild(confirmDialog);
        //get DOM elements
        const yesButton = confirmDialog.querySelector('#confirm-yes');
        
        //handle the event using onclick when clicked on the button then remove the popup and return true
        yesButton.onclick = () => {
            document.body.removeChild(confirmDialog);
            resolve(true);
        };
    });
}