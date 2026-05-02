const tiles = ["1m","2m","3m","4m","5m","6m","7m","8m","9m",
               "1s","2s","3s","4s","5s","6s","7s","8s","9s",
               "1p","2p","3p","4p","5p","6p","7p","8p","9p",
               "E","S","W","N","HKU","HT","CHU","aka5m","aka5s","aka5p"];

let hand = [];

//初期表示
window.onload = () => {
    const container = document.getElementById("tile-container")

    tiles.forEach(tile => {
        const img = document.createElement("img");
        img.src = `images/${tile}.png`;
        img.onclick = () => addTile(tile);
        container.appendChild(img);
    });
};

//手牌追加
function addTile(tile){
    const count = hand.filter(t => t === tile).length;

    if(count >= 4){
        alert("同じ牌は4枚まで");
        return;
    }

    if(hand.length >= 14){
        alert("14枚まで");
        return;
    }

    hand.push(tile);
    renderHand();
}

//手牌表示
function renderHand(){
    const handDiv = document.getElementById("hand");
    handDiv.innerHTML = "";

    hand.forEach((tile, index) => {
        const img = document.createElement("img");
        img.src = `images/${tile}.png`;

        //クリックで削除
        img.onclick = () => {
            hand.splice(index, 1);
            renderHand();
        };

        handDiv.appendChild(img);
    });
}

//リセット
function resetHand(){
    hand = [];
    renderHand();
}

//枚数カウントをわかりやすく
function getTileCounts(hand){
    const counts = {};

    hand.forEach(tile => {
        if(!counts[tile]){
            counts[tile] = 0;
        }

        counts[tile]++;
    });

    return counts;
}

function calculateWaits(){
    let waits = [];

    tiles.forEach(tile => {
        let temp = [...hand,tile];

        if(isWinningHand(temp)){
            waits.push(tile);
        }
    });

    displayResult(waits);
}

function isWinningHand(hand){
    if(hand.length!==14){
        return false;
    }

    const counts = getTileCounts(hand);

    //雀頭候補を全部試す
    for(let tile in counts){

        if(counts[tile] >= 2){

             //雀頭を抜く
             counts[tile] -= 2;

             //残りがすべて面子か
             if(canFormMelds({...counts})){
             return true;
             }
             //戻す
             counts[tile] += 2;
        }
    }

    return false;
}

function canFormMelds(counts){
    //牌を順番に見る
    for(let tile of tiles){
        while(counts[tile] > 0){

            //刻子
            if(counts[tile] >= 3){
                counts[tile] -= 3;
                continue;
            }

            //順子順番チェック
            if(isSequencePossible(tile,counts)){
                const next1 = getNextTile(tile, 1);
                const next2 = getNextTile(tile, 2);

                counts[tile]--;
                counts[next1]--;
                counts[next2]--;
            }else{
                return false;
            }
        }
    }
    return true
}

function isSequencePossible(tile, counts){
    //字牌は順子不可
    if(["E","S","W","N","HKU","HT","CHU"].includes(tile)){
        return false;
    }

    const number = parseInt(tile[0]);
    const suit = tile[1];

    //8，9は始点になれない
    if(number >= 8){
        return false;
    }

    const next1 = `${number + 1}${suit}`;
    const next2 = `${number + 2}${suit}`;

    return counts[next1] > 0 && counts[next2] > 0
}

function getNextTile(tile, offset){

    const number = parseInt(tile[0]);
    const suit = tile[1];

    return `${number + offset}${suit}`
}


function displayResult(waits){
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    waits.forEach(tile => {
        const img = document.createElement("img");
        img.src = `images/${tile}.png`;
        resultDiv.append(img);
    });
}

