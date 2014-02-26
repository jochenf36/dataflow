var mySections = new Array();
mySections[0] = 1

var badgesMap = new Object(); // keep track of badge numbers


// insert paragrah in enclosingDiv
function insertParagraph(enclosingDiv,sectionNr) {
  console.log("Insert Paragraph: " + enclosingDiv + " " + sectionNr);
var newParagrahID = mySections[sectionNr-1]
newParagrahID++
mySections[sectionNr-1]=newParagrahID;

var $newParagraph = $( "<div id='paragraph" + sectionNr + "_" + newParagrahID  + "''><h4>Paragraph " + newParagrahID+"</h4><textarea id='textarea" + sectionNr + "_" + newParagrahID  + "'' class='form-control contextMenu' rows='5'></textarea></div>" );


var outerDiv = "."+enclosingDiv;
$(outerDiv).append($newParagraph);

console.log("location: " + window.location.hash);


window.location.hash = 'paragraph' + sectionNr + "_" + newParagrahID ;
 loadContexMenu();
}


// insert section in article
function insertSection() {

var amountOfSections= mySections.length;
mySections[amountOfSections] = 0;

currentSectionNr =amountOfSections+1;

var $newSection = $( "<div id='section" + currentSectionNr+ "''><h3>Section " + currentSectionNr + "</h3><div class='well inSection" + currentSectionNr +"'>" +
 "<a  id='inSection" + currentSectionNr +"'' onClick='insertParagraph(this.id,"+currentSectionNr+ ")' class='pull-right'><i class='fa fa-plus'></i> Paragraph</a>'");


var outerDiv = ".article";
$(outerDiv).append($newSection);

// create first paragraph for newly created section
insertParagraph("inSection"+currentSectionNr,currentSectionNr );


}


// add badge to textarea
function makeActive(spinnerID, textareaID)
{

var badgeID=  textareaID +"_badge"

if ($("#"+badgeID).length > 0){
  var newBadgeNr =badgesMap[badgeID] +1;
      badgesMap[badgeID] =   newBadgeNr;
$("#"+badgeID).text("Active: " +newBadgeNr);

}
else
{
  spinnerID.append("").append("<a class='pull-right'><span class='badge' id='" + badgeID+ "'' >Active 1</span></a>");
  badgesMap[badgeID] = 1;

};




}

// all the things to do when loading the page
function onPageLoad()
{
  loadContexMenu();
  $(".extraBox").sticky({topSpacing:0});
}


// set contextMenu on textareas
function loadContexMenu()
{
   $('.contextMenu').contextMenu('myMenu1', {


      menuStyle: {

        width: '150px'

      },

      bindings: {

        'sensor': function(t) {

         idElement = "#"+t.id;
         makeActive($(idElement).parent(),t.id);

        },

        'database': function(t) {

          idElement = "#"+t.id;
          makeActive($(idElement).parent(),t.id);
         $(".database").show();

        },

        'webservice': function(t) {

          idElement = "#"+t.id;
          makeActive($(idElement).parent(),t.id);

        }

      }

    });
}






