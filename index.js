const chalk = require('chalk')
const fs = require('fs')
const express = require('express')
const app = express()

app.get('/j/82684314532', (req, res) => {
    
    const ip = req.ip
    console.log(chalk.greenBright('New user connected: ') + chalk.bgRed(ip))
    const queryArray = JSON.stringify(req.query.pwd).split(".");
    var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    var Username = 'None';
    Object.keys(config.users).forEach((user) => {
        if(config.users[user].Id === parseInt(queryArray[2])){
            Username = config.users[user].Name;
        }
    }); 
    var Link = 'None';
    var LinkName = 'None';
    Object.keys(config.links).forEach((link) => {
        if(config.links[link].Id === parseInt(queryArray[1])){
            Link = config.links[link].Link;
            LinkName = config.links[link].Name;
        }
    }); 
    console.log(chalk.greenBright('User name: ') + chalk.magentaBright(Username))
    console.log(chalk.greenBright('Link: ') + chalk.magentaBright(LinkName) + '\n')
    let CurrentDate = Date.now()
    let DateObj = new Date(CurrentDate)
    fs.appendFile('Logs/' + Username + '.txt', '[' + DateObj.getFullYear() + ':' + (DateObj.getMonth() + 1) + ':' + DateObj.getDate() + ']\n' + DateObj.getHours() + ':' + DateObj.getMinutes() + '\n' + 'IP: ' + ip + '\nLink Name: ' + LinkName + '\n\n', function (err) {
        if (err) throw err;
    });
    res.redirect(Link)

})

app.listen(3000, ()=>{
    console.log(chalk.cyan('Server started...\n'))
})