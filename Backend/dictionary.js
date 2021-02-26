var data = require('./E2Bdatabase.json');

var prime = 999999999959;
var prime2 = 999999999959n;
var slot = 100000;
var hashArray = new Array(slot);
var a = BigInt(1 + Math.floor((Math.random() * prime - 1)));
var b = BigInt(Math.floor((Math.random() * prime)));
var m = BigInt(slot);

const wordToNumber = (word) => {
    let number = 0;
    for(let i in word) {
        number = ((257 * number) + word.charCodeAt(i) + 1) % prime;
    }
    return BigInt(number);
}

const truncateDuplicateData = () => {
    var len = data.length;
    var uniqueData = [];
    var map = new Map();  //mapping for duplicate data
    for (let i=0; i<len; i++) {
        if (map.get(data[i].en) == undefined) {
            uniqueData.push(data[i]);
            map.set(data[i].en, 1);
        }
    }
    data = uniqueData;
}

module.exports.readData = async (req, res) => {
    arr = [];
    return arr;
};

module.exports.primaryHash = async () => {
    truncateDuplicateData();
    for(let i = 0; i < data.length; i = i+1){
        let number = wordToNumber(data[i].en);
        let hash = ((a * number + b) % prime2 ) % m;
        if(hashArray[hash] == undefined){
            hashArray[hash] = [data[i]];
        }
        else{
            hashArray[hash].push(data[i]);
        }
    }
}

module.exports.secondaryHash = async () => {
    tempArray = [];
    for(let i = 0; i < hashArray.length; i++) {
        if(hashArray[i] == undefined)
            continue;
        else if(hashArray[i].length >= 1){
            tempArray = hashArray[i];
            while(true){
                let flag = 0;
                hashArray[i] = {
                    m: BigInt(Math.pow(tempArray.length, 2)),
                    a: BigInt(1 + Math.floor((Math.random() * prime - 1))),
                    b: BigInt(Math.floor((Math.random() * prime))),
                    arr: []
                }
                for(let j = 0; j < tempArray.length; j++) {
                    let hash = ((hashArray[i].a * wordToNumber(tempArray[j].en) + hashArray[i].b) % prime2 ) % hashArray[i].m;
                    if(hashArray[i].arr[hash] == undefined)
                        hashArray[i].arr[hash] = tempArray[j];
                    else{
                        flag = 1;
                        break;
                    }
                }
                if(flag == 0) break;
                else continue;
            }
        }
    }
}

module.exports.translate = async (req, res) => {
    let word = req.query.word.toLowerCase();
    let key = wordToNumber(word);
    let hash = ((a * key + b) % prime2 ) % m;
    let struct = hashArray[hash];
    if(struct == undefined)
        res.send("Sorry, Word not found!");
    else {
        let tempA = struct.a;
        let tempB = struct.b;
        let tempM = struct.m;
        let hash2 = ((tempA * key + tempB) % prime2) % tempM;
        let result = hashArray[hash].arr[hash2];
        if(result == undefined)
            res.send("Sorry, Word not found!");
        else if(result.en == word)
            res.send(result.bn);
        else
            res.send("Sorry, Word not found!");
    }
}