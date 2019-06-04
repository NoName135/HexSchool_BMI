//指定Dom
const result = document.querySelector(".result");
const inputBox = document.querySelector(".inputBox");
const txt = document.querySelectorAll(".text");
const heightMsg = document.querySelector(".heightMsg");
const weightMsg = document.querySelector(".weightMsg");
const sendData = document.querySelector(".send");
let data = JSON.parse(localStorage.getItem("BMIList")) || [];

//判斷輸入內容
inputBox.addEventListener("keyup",function(){
    let heightInput = parseFloat(txt[0].value).toFixed(2);
    txt[0].value = heightInput>=0?(/\.0?$/.test(txt[0].value)?txt[0].value:heightInput.replace(/0$/,'').replace(/\.0$/,'')):'';
    let weightInput = parseFloat(txt[1].value).toFixed(2);
    txt[1].value = weightInput>=0?(/\.0?$/.test(txt[1].value)?txt[1].value:weightInput.replace(/0$/,'').replace(/\.0$/,'')):'';
});

//加入清單資料
sendData.addEventListener("click",addData);
function addData(e){
    e.preventDefault();
    const txt = document.querySelectorAll(".text");
    const cm = txt[0].value;
    const kg = txt[1].value;
    const bmi = (kg / (Math.pow(cm/100,2))).toFixed(2);
    let bmiText = "";
    let color = "";
    //判斷BMI數值
    if(bmi<18.5){
        bmiText = "過輕";
        color = "blue";
        resultColor = "#31BAF9"
    }else if(bmi>=18.5 && bmi<24){
        bmiText = "理想";
        color = "green";
        resultColor = "#86D73F"
    }else if(bmi>=24 && bmi<27){
        bmiText = "過重";
        color = "yellow"
        resultColor = "#FF982D"
    }else if(bmi>=27 && bmi<30){
        bmiText = "輕度肥胖";
        color = "orange"
        resultColor = "#FF6C03"
    }else if(bmi>=30 && bmi<35){
        bmiText = "中度肥胖";
        color = "orange"
        resultColor = "#FF6C03"
    }else if(bmi>=35){
        bmiText = "重度肥胖";
        color = "red"
        resultColor = "#FF1200"
    }
    const today = new Date();
    const yyyy = today.toLocaleDateString().slice(0,4)
    const mm = (today.getMonth()+1<10 ? '0' : '')+(today.getMonth()+1);
    const dd = (today.getDate()<10 ? '0' : '')+today.getDate();
    
    let bmiData = `
            <div class="date">${mm}-${dd}-${yyyy}</div>
            <div class="line ${color}"></div>
            <div class="bmiText">${bmiText}</div>
            <div class="bmi">BMI<span>${bmi}</span></div>
            <div class="weight">weight<span>${kg}kg</span></div>
            <div class="height">height<span>${cm}cm</span></div>`;

    //判斷輸入資料
    if(isNaN(txt[0].valueAsNumber) && isNaN(txt[1].valueAsNumber)){
        heightMsg.textContent = "*請填入資料";
        weightMsg.textContent = "*請填入資料";
    }else if(isNaN(txt[0].valueAsNumber) && txt[1].valueAsNumber > 0){
        heightMsg.textContent = "*請填入資料";
        weightMsg.textContent = "";
    }else if(txt[0].valueAsNumber > 0 && isNaN(txt[1].valueAsNumber)){
        heightMsg.textContent = "";
        weightMsg.textContent = "*請填入資料";
    }else{
        heightMsg.textContent = "";
        weightMsg.textContent = "";
        let todo = {
            content: bmiData
        }
        data.push(todo);
        localStorage.setItem("BMIList", JSON.stringify(data));
        updateList(data);

        //渲染結果圖示
        let bmiResult = `
            <div class="BMIResult" style="border-color: ${resultColor};">
                <p style="color: ${resultColor}">${bmi}</p>
                <h4 style="color: ${resultColor}">BMI</h4>
            </div>
            <div class="loop" style="background: ${resultColor}"><img src="img/icons_loop.png"></div>
            <p class="bmiText" style="color: ${resultColor}">${bmiText}</p>`;
        result.innerHTML = bmiResult;
        result.style.display = "block";
        sendData.style.display = "none";
        txt[0].readOnly= true;
        txt[0].style.background = "rgba(255,255,255,0.50)";
        txt[1].readOnly= true;
        txt[1].style.background = "rgba(255,255,255,0.50)";
        sendData.type = "button";

        //返回看結果
        const loop = document.querySelector(".loop");
        loop.addEventListener("click",function(){
            result.style.display = "none";
            sendData.style.display = "block";
            txt[0].readOnly = false;
            txt[0].value = "";
            txt[0].style.background = "rgba(255,255,255,0.18)";
            txt[1].readOnly = false;
            txt[1].value = "";
            txt[1].style.background = "rgba(255,255,255,0.18)";
            sendData.type = "submit";
        });
    }
}

//更新網頁內容
const list = document.querySelector(".list");
function updateList(items) {
    let str = "";
    for (let i = 0; i<items.length; i++) {
      str += `<li><div><a href="#" data-index=${i} class="fas fa-trash-alt"></a></div>${items[i].content}</li>`;
    }
    list.innerHTML = str;
}

//刪除清單資料
list.addEventListener("click", removeData);
updateList(data);
function removeData(e) {
    e.preventDefault();
    console.log(e.target.nodeName);
    if(e.target.nodeName !== 'A'){return};
    const index = e.target.dataset.index;
    console.log(e.target.dataset);
    data.splice(index, 1);
    localStorage.setItem("BMIList", JSON.stringify(data));
    updateList(data);
}

//清除全部紀錄
const clear = document.querySelector(".clear")
clear.addEventListener("click",function(e){
    e.preventDefault();
    localStorage.removeItem('BMIList');
    data = [];
    updateList(data);
});
