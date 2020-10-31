var text = "";
var title = "";
var articleData = [];
var originalLabels = [];
var originalSpecLabels = [];
var recommendedLabels = [];
var recommendedSpecLabels = [];
var minLabelChecked = false;
var acc = 0.5;
var selectedID = 0;
var incrDecrNum = 20;
var fileName ="data.txt";
var previous20Button = document.getElementById('first_button');
var next20Button = document.getElementById('last_button');
var previousButton = document.getElementById('previous_button');
var nextButton = document.getElementById('next_button');
var collapseButton = document.getElementById('collapse_button');
var sidebarMenu = document.getElementById('menu_side');
var accuracySet = document.getElementById('accuracy_range');
var selectedTitle = document.getElementById('selected_title');
var minimumLabel = document.getElementById('minimum_labels');
window.onload=loadArticleFirst;


function mapping(data){
  selectedTitle.innerHTML = "";
  articleData.map((data, index) => {
    if(index >= selectedID && index < (selectedID + incrDecrNum)) {
      var option = document.createElement('option');
      option.innerText = data.title;
      option.value = data.title;
      selectedTitle.appendChild(option);
    }
  })
  
}

function readData() {
  //articleData=[];
  fetch(fileName)
    .then((response) => response.text())
    .then((text) => text.split('\n'))
    .then((text) => text.map((line) => line.split('$$$')))
    .then((text) => {
      var tempData = {};
      var i = 0;
      text.forEach((line) => {
        tempData.recommended = line[0];
        tempData.recommendedSpec = line[1];
        tempData.original = line[2];
        tempData.title = line[3];
        tempData.text = line[4];
        tempData.id = i++;

        articleData.push(tempData);
        tempData = {};
      });
        mapping(articleData);
    });
};

function loadLabel (nodeId, data = []) {
 var node = document.getElementById(nodeId);
  node.innerHTML = "";
  if(minLabelChecked) {
    for(var i = 0; i < data.length && i < 3; i++) {
      var list = document.createElement('li');
        if (data[i].accuracy !== undefined) {
          list.textContent = `${data[i].label} ${data[i].accuracy}`;
        }else {
          list.textContent = data[i].label;
        }
        node.appendChild(list);
    }
    for(var i = 3; i < data.length; i++) {
      if(data[i].accuracy !== undefined) {
        if(data[i].accuracy >= acc) {
          var list = document.createElement('li');
          if (data[i].accuracy !== undefined) {
            list.textContent = `${data[i].label} ${data[i].accuracy}`;
          }else {
            list.textContent = data[i].label;
          }
          node.appendChild(list);
        }
      } else {
        var list = document.createElement('li');
        if (data[i].accuracy !== undefined) {
          list.textContent = `${data[i].label} ${data[i].accuracy}`;
        }else {
          list.textContent = data[i].label;
        }
        node.appendChild(list);
      }
    }
  } else {
    for(var i = 0; i < data.length; i++) {
      if(data[i].accuracy !== undefined) {
        if(data[i].accuracy >= acc) {
          var list = document.createElement('li');
          if (data[i].accuracy !== undefined) {
            list.textContent = `${data[i].label} ${data[i].accuracy}`;
          }else {
            list.textContent = data[i].label;
          }
          node.appendChild(list);
        }
      } else {
        var list = document.createElement('li');
        if (data[i].accuracy !== undefined) {
          list.textContent = `${data[i].label} ${data[i].accuracy}`;
        }else {
          list.textContent = data[i].label;
        }
        node.appendChild(list);
      }
    }
  }
};


function labelCategory(labelType,tempData,labelArray){
  labelType.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      tempData.label = item.replace("__label__", "").replace(/@{2}/g, " ");
    }else if(item != "") {
      tempData.accuracy = item.trim();
      labelArray.push(tempData);
      tempData = {};
    }
  });
}

function getArticleContent(data) {
  var tempData = {};
  var recommended = data.recommended.split(' '); 
  var recommendedSpec = data.recommendedSpec.split(' '); 
  var original = data.original.split(' ');
  title = data.title;
  text = data.text;
  recommendedLabels=[];
  recommendedSpecLabels=[];
  originalLabels=[];
  originalSpecLabels=[];
  
   labelCategory(recommended,tempData,recommendedLabels);
   labelCategory(recommendedSpec,tempData,recommendedSpecLabels);


  original.forEach(item => {
    if(item.trim().startsWith('__label__')) {
      tempData.label = item.replace("__label__", "").replace(/@{2}/g, " ");
      originalLabels.push(tempData);
      tempData = {};
    }else if(item != "") {
      tempData.label = item.replace(/@{2}/g, " ");
      originalSpecLabels.push(tempData);
      tempData = {};
    }
  });

  var content = document.getElementById("article_content");
  content.innerHTML = text;
  
  insertLabel();
}
(function () {
  readData();
  acc = accuracySet.value;
  document.getElementById('range_value').textContent = accuracy_range.value;
})();

function insertLabel()
{
  loadLabel("original_labels", originalLabels);
  loadLabel("recommended_labels", recommendedLabels);
  loadLabel("recommendedspec_labels", recommendedSpecLabels);
  loadLabel("originalspec_labels", originalSpecLabels);
};


function loadArticleFirst(){  
    readData();
    var option = articleData.find(d => d.id ==0);
   getArticleContent(option);

};
  

previous20Button.addEventListener('click', function() {
  selectedID =selectedID - incrDecrNum;
  console.log(selectedID);
  if(selectedID<0){
    selectedID=2000+selectedID;
  }
  console.log(selectedID);
  readData();
  var option = articleData.find(d => d.id ==selectedID);
  getArticleContent(option);
})

next20Button.addEventListener('click', function() {
  selectedID = selectedID + incrDecrNum;
  console.log(selectedID);
  if(selectedID===2000){
    selectedID=0;
  }
  else if(selectedID > 2000){
    var helper=2000-selectedID;
    selectedID=0+(incrDecrNum-helper);
  }
  readData();
  console.log(selectedID);
  var option = articleData.find(d => d.id ==selectedID);
  getArticleContent(option);
})

previousButton.addEventListener('click', function() {
  selectedID = selectedID - 1;
  if(selectedID < 0) {
    selectedID = 2000 - incrDecrNum;
  }
  readData();
  var option = articleData.find(d => d.id ==selectedID);
  getArticleContent(option);
})

nextButton.addEventListener('click', function() {
  selectedID = selectedID + 1;
  if(selectedID + incrDecrNum >= 2000) {
    selectedID = 0;
  }
  readData();
  console.log(selectedID);
  var option = articleData.find(d => d.id ==selectedID);
  getArticleContent(option);
})

selectedTitle.addEventListener('change', function(event) {
  var option = articleData.find(d => d.title == event.target.value);
  getArticleContent(option);
});

minimumLabel.addEventListener('change', function() {
  minLabelChecked = !minLabelChecked;
  insertLabel();
});

collapseButton.addEventListener('click', function() {
  sidebarMenu.classList.toggle('active');
});

accuracySet.addEventListener('input', function(event) {
  acc = event.target.value;
  document.getElementById('range_value').textContent = event.target.value;
  insertLabel();
});



