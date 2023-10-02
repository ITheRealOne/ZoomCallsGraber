const chalk = require('chalk')
const fs = require('fs')
const express = require('express')
const app = express()

// Function for save logs about user
const logUser = (userName, userId, ip, linkName) => {
    const dateObj = new Date(Date.now());
    const filePath = 'Logs/' + userName + userId + '.txt';
    const logString = '[\n' 
                        + dateObj.getFullYear() + ':' + (dateObj.getMonth() + 1) + ':' + dateObj.getDate() + '\n' 
                        + dateObj.getHours() + ':' + dateObj.getMinutes() + '\n' 
                        + 'IP: ' + ip + '\nLink Name: ' + linkName + '\n'
                        + ']\n'
    fs.appendFile(filePath, logString, err => {
        if (err) throw err;
    });
}

app.get('/j/82684314532/:linkId/:userId', (req, res) => {
    const {linkId, userId} = req.params;
    const {links, users} = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    const ip = req.ip;

    // Find name of a user in config
    let userName = 'None';
    users.forEach(user => {
        if (user.Id === Number(userId))
            userName = user.Name;
    });

    // Find link to redirect
    let linkUrl = 'google.com';
    let linkName = 'None';
    links.forEach(link => {
        if (link.Id === Number(linkId)){
            linkUrl = link.Link;
            linkName = link.Name;
        }
    });

    // Log user
    logUser(userName, userId, ip, linkName);

    // Redirect to link
    res.redirect(linkUrl)
})

app.get('/links', (req, res) => {
    
    // Generate links file
    const {links, users} = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    const filePath = 'Links.txt';
    let linksString = 'Links:\n'
    users.forEach(user => {
        linksString += '\n\n' + user.Name + ' (' + user.Mail + ')' + ': \n'
        links.forEach(link => {
            const tempArr = link.Link.split('=')
            let queryDecoration = tempArr[1]
            linksString += '\n' + link.Name + ': ' + req.get('host') + '/j/82684314532/' + link.Id + '/' + user.Id + '?pwd=' + queryDecoration
        });
    });
    fs.writeFileSync(filePath, linksString, err => {
        if (err) throw err;
    });

    // Download link file
    res.download('Links.txt');
})

app.listen(3000, () => {
    console.log(chalk.cyan('Server started...\n'))
})