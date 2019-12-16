// 設定變數calStart為按鈕顯示區，用於更新按鈕區域
let calStart = document.querySelector('.calStart');
// 設定變數calBtn為按鈕，用於綁定監聽click事件
let calBtn = document.querySelector('.calBtn');

// 透過變數heightInput綁定height輸入input
let heightInput = document.querySelector('#height');
// 透過變數weightInput綁定height輸入input
let weightInput = document.querySelector('#weight');
// 設定變數resultList為結果顯示區
let resultList = document.querySelector('.resultList');
// 先宣告變數resultItems為空陣列，於list更新後進行綁定元素並監聽點擊事件
let resultItems = [];
// 綁定刪除全部按鈕
let deletAllBtn = document.querySelector('.deletAllResult');
// 設定變數bmiRecordData為計算結果紀錄資料，初始為localStorage(取出並透過JSON.parse轉為陣列) || 空陣列
let bmiRecordData = JSON.parse(localStorage.getItem('bmiResultListData')) || [];
updateResultList();

function calBmi(e) {
    // // 設定變數calBtn為觸發按鈕(因更新按鈕區域會導致全域綁定.calBtn失效，因此觸發時再綁定)
    // let calBtn = document.querySelector('.calBtn');
    // // 透過indexOf從點擊事件中e.path(點擊元素路徑)陣列中，判斷是否包含calBtn
    // // indexOf如有找到符合會回傳陣列位置，沒有符合則回傳-1
    // if (e.path.indexOf(calBtn) < 0) { return };

    // 觸發才取input的value(用全域變數init時事先綁定，會因value尚未填入是無法綁定取得後來才填入的數值)
    let calHeight = parseInt(heightInput.value);
    let calWeight = parseInt(weightInput.value);
    // 使用isNaN(變數)判斷input內是否為空值
    if (isNaN(calHeight) || isNaN(calWeight)) {
        alert('身高和體重都要填寫才能計算哦！')
        return
    }
    // 計算bmi數值，並透過math.round取四捨五入(數值*100)/100取小數點後第二位(取四位則：(數值*10000)/10000)
    let bmiResult = Math.round((calWeight / ((calHeight / 100) ** 2)) * 100) / 100;
    // 透過new Date()取得當前時間全部資訊
    let today = new Date();
    // 透過陣列取出各項時間日期值
    let resultDate = [
        // .getMonth()取出的月份，1月值為0，故要加1
        today.getMonth() + 1,
        // .getDate()取出當前日期
        today.getDate(),
        // .getFullYear()取出當前年份，為4位數西元年
        today.getFullYear()
    ];
    let resultItem = {
        level: '',
        label: '',
    }
    // 當switch參數設為true時，可在case中加入判斷式，亦即判斷式為true時match
    switch (true) {
        case 18.5 >= bmiResult:
            resultItem = {
                level: 'light',
                label: '過輕',
                bmi: bmiResult,
                height: calHeight,
                weight: calWeight,
                date: resultDate[0] + '-' + resultDate[1] + '-' + resultDate[2]
            };
            break;
        case bmiResult > 18.5 && bmiResult <= 25:
            resultItem = {
                level: 'normal',
                label: '理想',
                bmi: bmiResult,
                height: calHeight,
                weight: calWeight,
                date: resultDate[0] + '-' + resultDate[1] + '-' + resultDate[2]
            };
            break;
        case bmiResult > 25 && bmiResult <= 30:
            resultItem = {
                level: 'heavyLV0',
                label: '過重',
                bmi: bmiResult,
                height: calHeight,
                weight: calWeight,
                date: resultDate[0] + '-' + resultDate[1] + '-' + resultDate[2]
            };
            break;
        case bmiResult > 30 && bmiResult <= 35:
            resultItem = {
                level: 'heavyLV1',
                label: '輕度肥胖',
                bmi: bmiResult,
                height: calHeight,
                weight: calWeight,
                date: resultDate[0] + '-' + resultDate[1] + '-' + resultDate[2]
            };
            break;
        case bmiResult > 35 && bmiResult <= 40:
            resultItem = {
                level: 'heavyLV2',
                label: '中度肥胖',
                bmi: bmiResult,
                height: calHeight,
                weight: calWeight,
                date: resultDate[0] + '-' + resultDate[1] + '-' + resultDate[2]
            };
            break;
        case bmiResult > 40:
            resultItem = {
                level: 'heavyLV3',
                label: '重度肥胖',
                bmi: bmiResult,
                height: calHeight,
                weight: calWeight,
                date: resultDate[0] + '-' + resultDate[1] + '-' + resultDate[2]
            };
            break;
    };
    // switch判斷組成的物件插入bmiRecordData陣列中
    bmiRecordData.push(resultItem);
    //將陣列轉為String更新key為bmiResultListData的LocalStorage(存入)
    localStorage.setItem('bmiResultListData', JSON.stringify(bmiRecordData));
    // 更新按鈕顯示區畫面，顯示本次計算結果，帶入參數level,bmi,label
    updateCalStart(resultItem.level, resultItem.bmi, resultItem.label);
    // 更新結果紀錄顯示區
    updateResultList();
}
// 更新按鈕區域，顯示當下計算結果
function updateCalStart(level, bmi, levelLabel) {
    let str =
        `<div class="calContent result ${level}">
    <div class="calBtn">
    <div class="btnText">${bmi}</div>
    <div class="bmiLabel">BMI</div>
    <div class="recalIcon"><img src="images/icons_loop.png"></div>
    </div>
    <div class="levelLabel">${levelLabel}</div>
    </div>`
    calStart.innerHTML = str;
    // 按鈕區域更新後，原綁定失效，重新綁定按鈕，並重新綁定監聽事件
    calBtn = document.querySelector('.calBtn');
    calBtn.addEventListener('click', calBmi, false);
    clearInput();
}
// 更新input區域，清空輸入內容
function clearInput() {
    heightInput.value = ''
    weightInput.value = ''
}

// 更新結果紀錄顯示區
function updateResultList(items) {
    if (bmiRecordData == null) { return };
    let str = '';
    for (let i = 0; i < bmiRecordData.length; i++) {
        str +=
            `<div class="resultItem" data-recordindex="${i}">
        <div class="status ${bmiRecordData[i].level}"></div>
        <div class="levelLabel">${bmiRecordData[i].label}</div>
        <div class="bmiScore">
        <span class="label">BMI</span>
        <span class="number">${bmiRecordData[i].bmi}</span>
        </div>
        <div class="recordWeight">
        <span class="label">weight</span>
        <span class="number">${bmiRecordData[i].weight}kg</span>
        </div>
        <div class="recordHeight">
        <span class="label">height</span>
        <span class="number">${bmiRecordData[i].height}cm</span>
        </div>
        <div class="recordDate">
        <span class="label">${bmiRecordData[i].date}</span>
        </div>
        </div>
        `
    }
    resultList.innerHTML = str;
    // 更新畫面後綁定item，避免list更新時無法綁定
    resultItems = document.querySelectorAll('.resultItem')
    // 透過for迴圈為每個item綁定click監聽事件，click後刪除
    for (let i = 0; i < resultItems.length; i++) {
        resultItems[i].addEventListener('click', deletItem, false)
    }
}

// 刪除item的function(delItem)，用於點擊item後刪除該項目
function deletItem(e) {
    let itemIndex = e.target.dataset.recordindex
    // 將資料陣列刪除該位置資料
    bmiRecordData.splice(itemIndex, 1)
    // 更新localStorage資料
    localStorage.setItem('bmiResultListData', JSON.stringify(bmiRecordData));
    // 更新畫面
    updateResultList();
}

function deletAll(e){
    // // 方法1，直接將bmiRecordData設為空陣列清除資料，再更新localStorage資料與畫面
    // bmiRecordData =[]
    // 方法2，從第0筆開始刪，刪數量為資料長度
    bmiRecordData.splice(0,bmiRecordData.length)
    // // 方法3，跑for迴圈，
    // // 但陣列位置刪除後即變更，刪除0、1後方資料會遞補上變成位置0、1，此方法無法完成全部刪除
    // for(let i=0;i<bmiRecordData.length;i++){
    //     bmiRecordData.splice(i,1)
    // }

    // 更新localStorage資料
    localStorage.setItem('bmiResultListData', JSON.stringify(bmiRecordData));
    // 更新畫面
    updateResultList();
}

// // 綁定監聽事件於按鈕區域calStart，並執行calBmi計算function
// calStart.addEventListener('click', calBmi, false);

// 綁定監聽事件於按鈕deletAll，執行刪除全部資料function
deletAllBtn.addEventListener('click',deletAll,false);


// 綁定監聽事件於按鈕calBtn，並執行calBmi計算function
calBtn.addEventListener('click', calBmi, false);