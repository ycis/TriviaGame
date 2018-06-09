var queryUrl = "https://opentdb.com/api.php?amount=10&type=multiple";
var otdbArray;
var mainDiv = $("#main");
var titleDiv = $("<div>").attr("id","title-image");
var logoImg = $("<img>")
    .attr("src","assets/images/logo.png")
    .attr("alt","Open Trivia Database Logo")
    .attr("style","width:100%;");
var questionDetails = $("#game-row");
var mcButtons = $("#buttons");
var isTimeUp = false;
var questNum, loadCount, correctCntArr, totalCntArr, timeLeft, timerId, diffSelected;

function countdown() {
    if (timeLeft == 0) {
        clearTimeout(timerId);
        isTimeUp = true;
        ansClick();
    } else {
        timeLeft--;
    }
    $('.radial-progress').attr('data-progress', timeLeft);
}
function addRadialCountdown(elem,seconds) {
    var divNumbers = $("<div>").addClass("numbers")
    for(var i = 0; i < 31; i++) {
        var spanNum = $("<span>")
        if(i===0){
            spanNum.text("-");
        } else {
            spanNum.text(i);
        }
        divNumbers.append(spanNum);
    }
    var divFull = $("<div>")
        .addClass("mask full")
        .append($("<div>").addClass("fill"));
    var divHalf = $("<div>")
        .addClass("mask half")
        .append($("<div>").addClass("fill"))
        .append($("<div>").addClass("fill").addClass("fix"));
    var divCircle = $("<div>")
        .addClass("circle")
        .append(divFull)
        .append(divHalf)
        .append($("<div>").addClass("shadow"));
    var divPercentage = $("<div>")
        .addClass("percentage")
        .append(divNumbers);
    var divInset = $("<div>")
        .addClass("inset")
        .append(divPercentage);

    var divRadial = $("<div>").addClass("radial-progress");
    divRadial.attr("data-progress","30")
    divRadial.append(divCircle)
    divRadial.append(divInset);

    elem.append(divRadial);
    
    //be sure to modify and regenerate the css to go with this if not doing 30 seconds 
    timeLeft = seconds;
    $('.radial-progress').attr('data-progress', "30")
    timerId = setInterval(countdown, 1000);
}
function sentenceCase (str) {
    if ((str===null) || (str===''))
         return false;
    else
     str = str.toString();
   return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function initLoad(swalObject) {
    if(typeof swalObject !== "undefined") {
        swal(swalObject).then((result) => {
            if (!result.value) {window.close()};
            $("#question-row").remove();
          })
    }
    const questColLabelDiv = $("<div>").addClass("col-md-12 form-labels")
    const formMain = $("<form>");

    questNum = 0;
    correctCntArr = [0,0,0];
    totalCntArr = [0,0,0];
    isTimeUp = false;

    var textIn = $("<div>").addClass("top-left").text("An");
    var textOut = $("<div>").addClass("bottom-right").text("...based trivia game");
    var logoContainerDiv = $("<div>").addClass("container")
        .append(logoImg)
        .append(textIn)
        .append(textOut);
    titleDiv
        .empty()
        .removeClass()
        .addClass("title-row row")
        .append(logoContainerDiv);    
    mainDiv.prepend(titleDiv);
    const catList = [
        {value: "any", text: "Any Category"},
        {value: "9", text: "General Knowledge"},
        {value: "10", text: "Entertainment: Books"},
        {value: "11", text: "Entertainment: Film"},
        {value: "12", text: "Entertainment: Music"},
        {value: "13", text: "Entertainment: Musicals &amp; Theatres"},
        {value: "14", text: "Entertainment: Television"},
        {value: "15", text: "Entertainment: Video Games"},
        {value: "16", text: "Entertainment: Board Games"},
        {value: "29", text: "Entertainment: Comics"},
        {value: "31", text: "Entertainment: Japanese Anime &amp; Manga"},
        {value: "32", text: "Entertainment: Cartoon &amp; Animations"},
        {value: "17", text: "Science &amp; Nature"},
        {value: "18", text: "Science: Computers"},
        {value: "19", text: "Science: Mathematics"},
        {value: "30", text: "Science: Gadgets"},
        {value: "20", text: "Mythology"},
        {value: "21", text: "Sports"},
        {value: "22", text: "Geography"},
        {value: "23", text: "History"},
        {value: "24", text: "Politics"},
        {value: "25", text: "Art"},
        {value: "26", text: "Celebrities"},
        {value: "27", text: "Animals"},
        {value: "28", text: "Vehicles"}];
    const diffList = [
        {value: "any", text: "Any"},
        {value: "easy", text: "Easy"},
        {value: "medium", text: "Medium"},
        {value: "hard", text: "Hard"}];
    var diffSelGroupMain = $("<div>")
        .addClass("form-group")
        .attr("id","difficulty-selection");
    var diffSelLabel = $("<div>Select your difficulty level:");
    for(var i = 0; i < diffList.length; i++) {
        var diffSelGroup = $("<div>").addClass("form-check form-check-inline");
        var newInput = $("<input>")
            .addClass("form-check-input")
            .attr("type","radio")
            .attr("name","inlineRadioOptions")
            .attr("id","inlineRadio" + i)
            .val(diffList[i].value)
        var newLabel = $("<label>")
            .addClass("form-check-label")
            .attr("for","inlineRadio" + i)
            .text(diffList[i].text);
        diffSelGroup
            .append(newInput)
            .append(newLabel);
        diffSelGroupMain.append(diffSelGroup);
    };
    var catDropDownLabel = $("<label>")
        .attr("for","category")
        .text("Select a Category");
    var catDropDown = $("<select>")
        .addClass("form-control")
        .attr("id","category")
        .val("any");
    for(var i = 0; i < catList.length; i++) {
        var opt = $("<option>")
            .val(catList[i].value)
            .text(catList[i].text);
        catDropDown.append(opt);
    }
    var catGroup = $("<div>").addClass("form-group")
        .append(catDropDownLabel)
        .append(catDropDown);
    var startButton = $("<button>")
        .addClass("btn btn-light open-submit")
        .text("Go")
        .attr("type","submit");
    var btnDiv = $("<div>")
        .addClass("col-sm-12 text-center")
        .append(startButton);
    
    diffSelGroupMain.append(diffSelLabel);
    formMain.append(diffSelGroupMain);
    formMain.append(catGroup);
    questColLabelDiv.append(formMain);
    questionDetails.append(questColLabelDiv);
    mcButtons
        .empty()
        .append(btnDiv);
    loadCount++;
}
function preLaunchCheck() {
    diffSelected = $("#difficulty-selection input:radio:checked").val();
    if (typeof diffSelected === "undefined") {
        swal("Please select a difficulty level to play");
        return false;
    }
    switch (diffSelected) {
    case "any":
        return true;
    default:
        queryUrl = queryUrl + "&difficulty=" + diffSelected;
        return true;
    }
}
function loadGame() {
    //checks if difficulty selected and sets the value for the query if so
    if(preLaunchCheck() == true) {
        var catSelected = $("#category").val();
        if (catSelected !== "any" && typeof catSelected !== "undefined") {
            queryUrl = queryUrl + "&category=" + catSelected;
        }
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(fillQuestArr);
    }
}
function getSum(NumericArray) {
    var tmpVal = 0;
    for(var i = 0; i < NumericArray.length; i++) {
        switch(i) {
            case 0: console.log("Easy: " + NumericArray[i]);
            case 1: console.log("Medium: " + NumericArray[i]);
            case 2: console.log("Hard: " + NumericArray[i]);
        }
        tmpVal = tmpVal + NumericArray[i];
    }
    console.log("Total: " + tmpVal)
    return tmpVal;
}
function returnHTML(totalCorrect) {
    var finalHTML = "";
    finalHTML = "You Correctly Answered: " + totalCorrect + "<br>";
    if(diffSelected === "any") {
        finalHTML = finalHTML + 
            "Easy  : " + correctCntArr[0] + " Correct out of " + totalCntArr[0] +"<br>" +
            "Medium: " + correctCntArr[1] + " Correct out of " + totalCntArr[1] +"<br>" +
            "Hard  : " + correctCntArr[2] + " Correct out of " + totalCntArr[2] +"<br>";
    } else {
        finalHTML = "Difficulty: " + diffSelected + "<br>" + finalHTML;
    }
    return finalHTML + "<br>Do you want to play again??";
}
function returnDifficultyNum(diffStr) {
    switch(diffStr) {
        case "easy": return 0;
        case "medium": return 1;
        case "hard": return 2
        default: return -1;
    };
}
function ansClick() {
    var swalObj, questObj = otdbArray[questNum];
    var typeNum = returnDifficultyNum(questObj.difficulty);
    if(typeNum === -1) {console.log("trouble with question type determination")};
    totalCntArr[typeNum] = totalCntArr[typeNum] + 1;
    if(isTimeUp == true) {
        swalObj = {
            title: "Times Up!",
            text: "You ran out of time. The correct answer was: " + questObj.correct_answer,
            type: "error"};
    } else {
        swalObj = {
                title: $(this).attr("data-title"),
                text: $(this).attr("data-text"),
                type: $(this).attr("data-icon")};
        };
    if(swalObj.type === "success" && typeNum > -1) {correctCntArr[typeNum] = correctCntArr[typeNum] + 1}

    clearTimeout(timerId);
    questNum++;
    swal(swalObj).then((result) => {
        if(questNum < 10) {fillNextQuest()} else {
            var totalCorrect = getSum(correctCntArr);
            var swalHTML = returnHTML(totalCorrect);
            var finalScore = (totalCorrect / 10) * 100;
            var swalObj2 = {
                title: 'Game Over! Final Score: ' + finalScore.toString() + "%",
                html: swalHTML,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Play Again',
                cancelButtonText: "Good Bye"};
            initLoad(swalObj2);
        }
    });
}



function fillQuestArr(response) {
    if(response.response_code === 0) {
        otdbArray = response.results;
        fillNextQuest();
    } else {
        swal("There was an error retrieving the questions from the Open Trivia Database");
    };
}

function fillNextQuest() {
    var swalText = "";
    var swalTitle = "";
    var swalIcon = "";
    var ansVal = "";

    isTimeUp = false;
    var questObj = otdbArray[questNum];
    
    var questRem = 10 - questNum - 1;
    
    var logoDiv = $("<div>").addClass("col-md-4").append(logoImg);
    var questType = $("<div>")
        .append($("<p>").text("Category: "+questObj.category))
        .append($("<p>").text("Difficulty: " + sentenceCase(questObj.difficulty)))
        .append($("<p>").text(questRem + " Questions Remaining"));;
    var questTypeCol = $("<div>")
        .addClass("col-md-4 sub-title bg-info")
        .append(questType);
    var timerDiv = $("<div>").addClass("col-md-4");
        addRadialCountdown(timerDiv,30);
    
    titleDiv
        .empty()
        .removeClass()
        .addClass("row")
        .append(logoDiv)
        .append(questTypeCol)
        .append(timerDiv);
    var questColDiv = $("<div>")
        .addClass("col-md-12 text-white bg-dark")
        .html("<p id='question-row'>" +questObj.question+"<p>");
    questionDetails
        .empty()
        .append(questColDiv);    
    var corAnsLoc = Math.floor((Math.random() * 4));
    var ansArr = questObj.incorrect_answers;
    ansArr.splice(corAnsLoc,0,questObj.correct_answer);
    mcButtons.empty();
    for(var i = 0; i < ansArr.length; i++) {
        if(i == corAnsLoc) {
            swalTitle = "Good Job!";
            swalText = "That's the right answer";
            swalIcon = "success";
            ansVal = "1";
        } else {
            swalTitle = "Incorrect";
            swalText = "The correct answer is: "+questObj.correct_answer;
            swalIcon = "error";
            ansVal = "0";
        }
        var ansButton = $("<button>")
            .attr("type","button")
            .addClass("btn btn-primary btn-lg btn-block answer-submit")
            .html(ansArr[i])
            .attr("data-title",swalTitle)
            .attr("data-text",swalText)
            .attr("data-icon",swalIcon)
            .val(ansVal);
        mcButtons.append(ansButton);
    }
}



$(document).ready(function () {
    initLoad();
    $("#buttons").on("click",".open-submit", loadGame);
    $("#buttons").on("click",".answer-submit", ansClick);
})






// function NewElement(eType, attrArr, classVal, textVal, labelDisplay) {
//     this.Type = eType;
//     this.ID = idVal;
//     this.attributes = attrArr;
//     this.ClassString = classVal;
//     this.TextValue = textVal;
//     this.LabelString = labelDisplay;
// }
// function isValidVal(valVar) {
//     if(valVar !== "" && typeof valVar === "undefined") {
//         return true;
//     } else {
//         return false;
//     }
// }
// var NestedElementArray = [];
// function CreateElementsFromArr(parentElement) {
//     var elemCollection = [];
//     var objId, attrId, newElem, elemObj;
//     for(objId = NestedElementArray.length-1; objId >= 0; objId--) {
//         elemObj = NestedElementArray[objId];
//         newElem = $("<" + elemObj.Type + ">")
//         if(isValidVal(elemObj.ClassString)) {newElem.addClass(emObj.ClassString)}
//         if(isValidVal(elemObj.TextValue)) {newElem.text(emObj.TextValue)}
//     }
// }