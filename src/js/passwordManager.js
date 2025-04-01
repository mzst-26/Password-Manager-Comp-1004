//main password manager class for handling all password operations
class PasswordManager {
    //setup initial data structre with empty master password and passwords list
    constructor() {
        this.data = {
            masterPassword:'',
            passwords: []
        };
    }

    // adds new password entry
    addPassword(username, website, password) {
        //make new password object with timestamp ID
        let newPassword = {   
            username: username,
            website: website,
            password: password,
            id: Date.now()
         
        };
        try{
        this.data.passwords.push(newPassword); 
        showToast("Passwords added successfully", true);
        return newPassword;
       
        }catch(error){
            showToast(`error ${error}`, false)
        }
       
    }

    // serches through stored passwords
    searchPasswords(keyword) {
        // return everything if no search term
        if (!keyword) {

            return this.data.passwords;
        }
        
        let searchTerm = keyword.toLowerCase();
        
        //filter passwords that match search
        let results = this.data.passwords.filter(function(entry) {
            let usernameMatch = entry.username.toLowerCase().includes(searchTerm);
            let websiteMatch = entry.website.toLowerCase().includes(searchTerm);
            return usernameMatch || websiteMatch;
        });

        return results;
    }

    //removes password entry by ID
    deletePassword(id) {

        // filter out matching password
        this.data.passwords = this.data.passwords.filter(function(entry) {
            return entry.id !== id;
        });

    }

    //exports passwords to encrypted JSON
    async exportToJSON() {
        if(this.data.masterPassword === "" || this.data.masterPassword === null || this.data.masterPassword.length < 29){
            this.data.masterPassword = await this.generateMasterPassword();
        }

        // encrypt all passwords before export
        const encryptPasswords = this.data.passwords.map(module => ({

            id: module.id,
            username: encrypt(module.username, this.data.masterPassword),
            website: encrypt(module.website, this.data.masterPassword), 
            password: encrypt(module.password, this.data.masterPassword)

        }));


        //combine master password and encrypted data
        const dataToExport = {

            masterPassword: encryptMasterPassword(this.data.masterPassword) ,
            passwords: encryptPasswords
        };

        let jsonData = JSON.stringify(dataToExport, null, 2);
        return jsonData;
        
    }

    // imports and decrypts passwords from JSON
    async importFromJSON(jsonString) {
        try {
            let jsonData = JSON.parse(jsonString);
            
            if (!jsonData.masterPassword) {
                showToast("Master Password is missing, Access Denied", false)
                throw new Error('Master password is missing');
            }

            this.data.masterPassword = await decryptMasterPassword(jsonData.masterPassword)
            console.log(this.data.masterPassword)
            //decrypt all the paswords
            const decryptedPasswords = jsonData.passwords.map(module => ({

                id: module.id,
                username: decrypt(module.username,this.data.masterPassword),
                website: decrypt(module.website, this.data.masterPassword),
                password: decrypt(module.password, this.data.masterPassword)

            }));
            console.log(decryptedPasswords)


            this.data.passwords = decryptedPasswords;
            console.log(this.data.masterPassword)
            console.log(this.data.passwords)
            return true;
        } catch (error) {
            console.error('Failed to import JSON:', error);
            return false;
        }
    }


    generateMasterPassword(){
        // generates secure 30 char password
        const length = 30;
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
        const numbers = "0123456789";
        const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        let password = "";
        
        //get cryptographicly secure random values
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        
        // add required character types    
        password += numbers[array[2] % numbers.length];
        password += special[array[3] % special.length];
        password += lowercase[array[0] % lowercase.length];
        password += uppercase[array[1] % uppercase.length];
    
        
        //combine all possible chars
        const allChars = lowercase + uppercase + numbers + special;

            for (let i = 4; i < length; i++) {

                password += allChars[array[i] % allChars.length];

            }
        
        // randomize final pasword order
        password = password.split('').sort(() => {

                const randVal = new Uint32Array(1);

                crypto.getRandomValues(randVal);
                return 0.5 - (randVal[0] / 4294967296);
        }).join('');
        
        this.data.masterPassword = password;
        return new Promise(async (resolve) => {
            try {
                const firstConfirm = await masterPasswordSavedConfirm(password);
                if(firstConfirm) {
                    resolve(password);
                    return;
                }
                
                const secondConfirm = await masterPasswordSavedConfirm(password);
                if(secondConfirm) {
                    resolve(password);
                    return;
                }

                showToast("YOU HAVE LOST ACCESS, IN 5 SECONDS A NEW ACCOUNT WILL BE CREATED FOR YOU", false);
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
                resolve(false);
            } catch(error) {
                console.error('Error confirming master password:', error);
                resolve(false);
            }
        });
    }
} 