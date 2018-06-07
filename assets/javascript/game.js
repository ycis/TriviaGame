var queryUrl = "https://opentdb.com/api.php?amount=10&type=multiple";
var questNum = 0;
var otdbArray;
var mainDiv = $("#main");
var logoDiv = $("<div>").attr("id","title-image");
var logoImg = $("<img>")
    .attr("src","assets/images/logo.png")
    .attr("alt","Open Trivia Database Logo")
    .attr("style","width:100%;");
var questionDetails = $("#game-row");
var mcButtons = $("#buttons");

function initLoad() {
    const questColLabelDiv = $("<div>").addClass("col-md-12 form-labels")
    const formMain = $("<form>");
    
    var textIn = $("<div>").addClass("top-left").text("An");
    var textOut = $("<div>").addClass("bottom-right").text("...based trivia game");
    var logoContainerDiv = $("<div>").addClass("container")
    .append(logoImg)
    .append(textIn)
    .append(textOut);

    logoDiv
        .append(logoContainerDiv)    
        .removeClass()
        .addClass("row");
    
    mainDiv.prepend(logoDiv);
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
    mcButtons.append(btnDiv);
}
function preLaunchCheck() {
    var diffSelected = $("#difficulty-selection input:radio:checked").val();
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
function progress(timeleft, timetotal, $element) {
    var progressBarWidth = timeleft * $element.width() / timetotal;
    $element.find("div").animate({ width: progressBarWidth }, 500).html(Math.floor(timeleft/60) + ":"+ timeleft%60);
    if(timeleft > 0) {
        setTimeout(function() {
            progress(timeleft - 1, timetotal, $element);
        }, 1000);
    } else {
        // timer expires code
    };
};
function nextClicked(promptObj){
    var proceed = false;
    var cnt = 0;
    do {
        if(cnt > 5) {
            swal(`You left me more than 5 times, tryna cheat ehh?!`);
            proceed = true;
            return "GameOver";
        } else {
            swal(promptObj).then((value) => {
                proceed = value;
                if(value) {
                    if(questNum === 9) {
                        questNum = 0;
                        return "Reset";
                    } else {
                        questNum++;
                        return "Next";
                    };
                };
            });
        }
        cnt++;
    } while (proceed == false)
}

function fillQuestArr(response) {
    if(response.response_code === 0) {
        otdbArray = response.results
        questNum = -1;
        fillNextQuest();
    } else {
        swal("There was an error retriving the questions from the Open Trivia Database");
    };
}
function fillNextQuest() {
    questNum++;
    console.log(questNum);
    console.log(otdbArray);
    questionDetails.empty();
    mcButtons.empty();

    var questObj = otdbArray[questNum];
    // progress(600, 600, $("#progressBar"));
}





$(document).ready(function () {
    initLoad();
    $("#buttons").on("click",".open-submit", loadGame);
});

