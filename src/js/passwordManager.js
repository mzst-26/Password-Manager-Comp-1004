class PasswordManager {
  
    constructor() {
        this.data = {
            passwords: []
        };
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
        alert("successful")
        return newPassword;
       
        }catch{
            alert("error: failed")
        }
       
    }

  
    //removes password entry by ID
    deletePassword(id) {
        // filter out matching password
        this.data.passwords = this.data.passwords.filter(function(entry) {
            return entry.id !== id;
        });

    }

    //exports passwords JSON
    async exportToJSON() {
        const passwords = this.data.passwords.map(module => ({

            id: module.id,
            username: module.username,
            website: module.website,
            password: module.password

        }));

        const dataToExport = {
            passwords: passwords
        };

        let jsonData = JSON.stringify(dataToExport, null, 2);
        return jsonData;
        
    }

    // imports and passwords from JSON
    async importFromJSON(jsonString) {
        try {
            let jsonData = JSON.parse(jsonString);
            
            const passwords = jsonData.passwords.map(module => ({

                id: module.id,
                username: module.username,
                website:  module.website,
                password: module.password

            }));
            console.log(passwords)


            this.data.passwords = passwords;
            // console.log(this.data.passwords)
            return true;
        } catch (error) {
            console.error('Failed to import JSON:', error);
            return false;
        }
    }

} 